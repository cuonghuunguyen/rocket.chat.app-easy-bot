import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { ILivechatMessage, ILivechatRoom } from "@rocket.chat/apps-engine/definition/livechat";

import BeyondBotApp from "../BeyondBotApp";
import { ConfigId, ServerSettingID } from "../constants/settings";
import { computeTransferAction, getBotReplies, sendGreetingMessage } from "../helpers/bot-helpers";
import { isValidTimeRange } from "../helpers/day-helpers";
import { addRoomCustomField, closeRoom, sendText } from "../helpers/rocketchat-helper";
import { templateResolver } from "../helpers/template-resolver";
import { ActionTransferRoom, BotButtonType, IBotReply } from "../types/bot";

import { Interactive } from "./../types/whatsapp";

/**
 * The default handler for the hook IPostMessageSent of Rocket.Chat App-Engine
 */
class PostMessageSentHandler {
	constructor(
		protected app: BeyondBotApp,
		protected message: ILivechatMessage,
		protected reader: IRead,
		protected http: IHttp,
		protected persistence: IPersistence,
		protected modifier: IModify
	) {}

	public async run(): Promise<void> {
		const settingReader = this.reader.getEnvironmentReader().getSettings();
		const serverSettingReader = this.reader.getEnvironmentReader().getServerSettings();

		const { text, attachments, sender } = this.message;
		const room = this.message.room as ILivechatRoom;
		const visitor = room.visitor;
		const phone = visitor?.phone?.[0]?.phoneNumber;

		const siteUrl = await serverSettingReader.getValueById(ServerSettingID.SITE_URL);
		const messageType = (this.message as any)._unmappedProperties_?.t;
		const interactive: Interactive | undefined = this.message.customFields?.interactive;

		const botAgentUsername = await settingReader.getValueById(ConfigId.BOT_AGENT_USERNAME);
		const botAgent = await this.reader.getUserReader().getByUsername(botAgentUsername);
		const isNewRoom = room.customFields?.new !== false;

		if (!botAgent) {
			console.error("No Agent found", botAgentUsername);
			return;
		}

		if (messageType) {
			return;
		}

		if (this.message.editedAt) {
			return;
		}

		if (sender.id !== room.visitor.id) {
			return;
		}

		if (room.servedBy?.username !== botAgentUsername) {
			return;
		}

		const replies = await getBotReplies(this.reader);

		try {
			if (!interactive) {
				if (isNewRoom) {
					await addRoomCustomField(room, "new", false, botAgent, this.modifier);
					await sendGreetingMessage(room, this.reader, this.modifier);
					return;
				}
				console.error("Cannot find interactive in the message", this.message.customFields);
				await sendText(
					replies.wrongSelectionText || "Please one of the answers bellow to continue!",
					room,
					botAgent,
					this.modifier
				);
				await sendGreetingMessage(room, this.reader, this.modifier);
				return;
			}

			const buttonReply = interactive.type === "button_reply" ? interactive.button_reply : interactive.list_reply;

			const validReply: ActionTransferRoom | undefined = replies.buttons?.find(
				button =>
					button.type === BotButtonType.TRANSFER_CHAT && buttonReply.id.startsWith(computeTransferAction(button))
			) as ActionTransferRoom | undefined;

			if (!validReply) {
				console.error("Cannot find a valid reply", this.message.customFields);
				await sendText(
					replies.wrongSelectionText || "Please one of the answers bellow to continue!",
					room,
					botAgent,
					this.modifier
				);
				await sendGreetingMessage(room, this.reader, this.modifier);
				return;
			}

			await this.transferRoom(validReply, replies);

			if (replies.transferSuccessText) {
				await sendText(replies.transferSuccessText, room, botAgent, this.modifier);
			}
		} catch (error) {
			console.error(error);
			await sendText(
				replies.technicalErrorText || "Technical error happened, please try again later",
				room,
				botAgent,
				this.modifier
			);
		}
	}

	private async transferRoom(actionTransfer: ActionTransferRoom, botReply: IBotReply): Promise<void> {
		const room = this.message.room as ILivechatRoom;
		const { department: departmentNameOrId, conditions } = actionTransfer;

		console.log("Transfering room with action", actionTransfer);
		const { startBusinessHour, stopBusinessHour } = conditions || {};
		const department = await this.reader.getLivechatReader().getLivechatDepartmentByIdOrName(departmentNameOrId);

		if (!department) {
			throw "Cannot find department";
		}

		const departmentIsOnline = this.reader.getLivechatReader().isOnlineAsync(department.id);

		if (!departmentIsOnline) {
			throw "Department is not online";
		}

		if (!isValidTimeRange(startBusinessHour, stopBusinessHour)) {
			console.error(
				`Transfer failed to ${department.name} because it is out of business hour from ${startBusinessHour} to ${stopBusinessHour}`
			);

			await sendText(
				templateResolver(botReply.departmentOfflineText || "Department is offline, please try again later", {
					startBusinessHour,
					stopBusinessHour
				}),
				room,
				room.servedBy!,
				this.modifier
			);

			await closeRoom(room, `Transfer failed to ${departmentNameOrId}`, this.modifier);
			return;
		}

		await this.modifier
			.getUpdater()
			.getLivechatUpdater()
			.transferVisitor((this.message.room as ILivechatRoom).visitor, {
				currentRoom: this.message.room as ILivechatRoom,
				targetDepartment: department.id
			});
	}
}
export default PostMessageSentHandler;
