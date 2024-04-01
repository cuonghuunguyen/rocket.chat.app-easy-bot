import { ILivechatRoom } from "@rocket.chat/apps-engine/definition/livechat";
import { IHttp, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";

import RocketChatWhatsAppApp from "../RocketChatWhatsAppApp";
import WhatsappSdk from "../helpers/whatsapp-sdk";
import { getPhoneNumber } from "../helpers/config-persistence";

/**
 * The default handler for the hook ILiveChatRoomClosed of Rocket.Chat App-Engine
 */
class LiveChatRoomStartedHandler {
	constructor(
		protected app: RocketChatWhatsAppApp,
		protected room: ILivechatRoom,
		protected reader: IRead,
		protected http: IHttp,
		protected persistence: IPersistence
	) {}

	private isWhatsAppRoom(room: ILivechatRoom): boolean {
		return room.source?.type === "app" && (room.source as any)?.id === this.app.getID();
	}
	/**
	 * Clean up conversation register after a room is closed
	 */
	public async run(): Promise<void> {
		const phoneId = this.room.customFields?.phoneId;
		const phoneNumberConfig = await getPhoneNumber(phoneId, this.reader.getPersistenceReader());

		if (!phoneNumberConfig) {
			return;
		}
		const sdk = new WhatsappSdk(
			phoneNumberConfig.phoneId,
			phoneNumberConfig.accessToken,
			this.persistence,
			this.http
		);

		const visitor = this.room.visitor;
		const phone = visitor?.phone?.[0]?.phoneNumber;

		if (!this.isWhatsAppRoom(this.room)) {
			return;
		}

		if (!phone) {
			return;
		}

		if (phoneNumberConfig.welcomeMessage) {
			await sdk.sendText(phone, phoneNumberConfig.welcomeMessage);
		}
	}
}

export default LiveChatRoomStartedHandler;
