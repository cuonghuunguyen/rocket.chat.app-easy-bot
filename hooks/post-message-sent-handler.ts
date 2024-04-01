import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { ILivechatMessage, ILivechatRoom } from "@rocket.chat/apps-engine/definition/livechat";

import RocketChatWhatsAppApp from "../RocketChatWhatsAppApp";
import { AgentDisplayInfo, ConfigId, ServerSettingID } from "../constants/settings";

/**
 * The default handler for the hook IPostMessageSent of Rocket.Chat App-Engine
 */
class PostMessageSentHandler {
	constructor(
		protected app: RocketChatWhatsAppApp,
		protected message: ILivechatMessage,
		protected reader: IRead,
		protected http: IHttp,
		protected persistence: IPersistence,
		protected modifier: IModify
	) {}

	private isWhatsAppRoom(room: ILivechatRoom): boolean {
		return room.source?.type === "app" && (room.source as any)?.id === this.app.getID();
	}

	public async run(): Promise<void> {
		const settingReader = this.reader.getEnvironmentReader().getSettings();
		const serverSettingReader = this.reader.getEnvironmentReader().getServerSettings();

		const { text, attachments, sender } = this.message;
		const room = this.message.room as ILivechatRoom;
		const visitor = room.visitor;
		const phone = visitor?.phone?.[0]?.phoneNumber;

		const siteUrl = await serverSettingReader.getValueById(ServerSettingID.SITE_URL);
		const agentDisplayInfo: AgentDisplayInfo = await settingReader.getValueById(ConfigId.AGENT_DISPLAY_INFO);
		const messageType = (this.message as any)._unmappedProperties_?.t;

		if (messageType) {
			return;
		}

		const agentName =
			agentDisplayInfo === AgentDisplayInfo.USERNAME
				? sender.username
				: agentDisplayInfo === AgentDisplayInfo.NAME
				? sender.name
				: undefined;

		try {
			if (!this.isWhatsAppRoom(room)) {
				return;
			}

			if (sender.id === room.visitor.id) {
				return;
			}

			if (!phone) {
				return;
			}

			if (text) {
				await sdk.sendText(phone, text, this.message.id);
			}

			if (attachments) {
				for (const attachment of attachments) {
					if (attachment.imageUrl) {
						let url: string;
						if (attachment.title?.link) {
							url = this.getAttachmentUrl(attachment.title?.link as string, siteUrl);
						} else {
							url = this.getAttachmentUrl(attachment.imageUrl as string, siteUrl);
						}

						await sdk.sendImage(phone, url, this.message.id, {
							caption: attachment.description
						});
						continue;
					}

					if (attachment.audioUrl) {
						const { url, caption } = this.extractAttachmentInfo(attachment, "audioUrl", siteUrl);
						if (caption) {
							await sdk.sendText(phone, caption, this.message.id);
						}
						await sdk.sendAudio(phone, url, this.message.id);
						continue;
					}

					if (attachment.videoUrl) {
						const { url, caption } = this.extractAttachmentInfo(attachment, "videoUrl", siteUrl);
						if (caption) {
							await sdk.sendText(phone, caption, this.message.id);
						}
						await sdk.sendVideo(phone, url, this.message.id);
						continue;
					}

					if (attachment.type === "file") {
						if (attachment.title?.link) {
							await sdk.sendDocument(phone, this.getAttachmentUrl(attachment.title?.link, siteUrl), this.message.id, {
								caption: attachment.description,
								filename: attachment.title.value
							});
						}
						continue;
					}
				}
			}
		} catch (error) {
			await this.handleError(error);
			console.error(error);
		}
	}
}
export default PostMessageSentHandler;
