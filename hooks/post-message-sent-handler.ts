import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { ILivechatMessage, ILivechatRoom } from "@rocket.chat/apps-engine/definition/livechat";

import EasyBotApp from "../EasyBotApp";
import { ConfigId } from "../constants/settings";
import {
	getBotReplies,
	sendBotResponses,
	sendGreetingMessage,
	sendTechnicalErrorMessage,
	sendWrongResponseMessage
} from "../helpers/bot-helpers";
import { addRoomCustomField } from "../helpers/rocketchat-helper";
import { Interactive } from "../types";

/**
 * The default handler for the hook IPostMessageSent of Rocket.Chat App-Engine
 */
class PostMessageSentHandler {
	constructor(
		protected app: EasyBotApp,
		protected message: ILivechatMessage,
		protected reader: IRead,
		protected http: IHttp,
		protected persistence: IPersistence,
		protected modifier: IModify
	) {}

	public async run(): Promise<void> {
		const settingReader = this.reader.getEnvironmentReader().getSettings();
		const { token, text } = this.message;
		const room = this.message.room as ILivechatRoom;
		const interactive: Interactive | undefined = this.message.customFields?.interactive;

		const messageType = (this.message as any)._unmappedProperties_?.t;

		const botAgentUsername = await settingReader.getValueById(ConfigId.BOT_AGENT_USERNAME);
		const botAgent = await this.reader.getUserReader().getByUsername(botAgentUsername);
		const isNewRoom = room.customFields?.new !== false;

		if (!botAgent) {
			console.error("No Agent found", botAgentUsername);
			return;
		}

		if (messageType && messageType !== "uj") {
			return;
		}

		if (this.message.editedAt) {
			return;
		}

		if (!token) {
			return;
		}

		if (room.servedBy?.username !== botAgentUsername) {
			return;
		}

		try {
			if (!interactive) {
				if (isNewRoom) {
					await addRoomCustomField(room, "new", false, botAgent, this.modifier);
					await sendGreetingMessage(room, this.reader, this.modifier, this.http);
					return;
				}
				console.error("Cannot find interactive in the message", this.message.customFields);
				await sendWrongResponseMessage(room, this.reader, this.modifier, this.http);
				await sendGreetingMessage(room, this.reader, this.modifier, this.http);
				return;
			}

			const botReplies = await getBotReplies(this.reader);

			const botResponses = botReplies[interactive.actionId];

			if (!botResponses) {
				console.error("Cannot find a valid reply", this.message.customFields);
				await sendWrongResponseMessage(room, this.reader, this.modifier, this.http);

				await sendGreetingMessage(room, this.reader, this.modifier, this.http);
				return;
			}

			await sendBotResponses(botResponses, room, this.reader, this.modifier, this.http);
		} catch (error) {
			console.error(error);
			await sendTechnicalErrorMessage(room, error, this.reader, this.modifier, this.http);
		}
	}
}
export default PostMessageSentHandler;
