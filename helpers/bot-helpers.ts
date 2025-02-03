import { IHttp, IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { ILivechatRoom } from "@rocket.chat/apps-engine/definition/livechat";
import { IMessageAttachment } from "@rocket.chat/apps-engine/definition/messages";
import { ActionsBlock, ButtonElement } from "@rocket.chat/ui-kit";

import { closeChat, selectChatLanguage, transferRoom } from "../actions";
import { ConfigId } from "../constants/settings";
import { IBotResponse } from "../types";

import { templateResolver } from "./template-resolver";

export const getBotReplies = async (reader: IRead): Promise<Record<string, IBotResponse[]>> => {
	try {
		const repliesJson = await reader.getEnvironmentReader().getSettings().getValueById(ConfigId.BOT_REPLIES);
		return JSON.parse(repliesJson);
	} catch (error) {
		console.log("ERROR getting bot responses", error);
		return {};
	}
};

export const sendBotResponses = async (
	botResponses: IBotResponse[],
	room: ILivechatRoom,
	reader: IRead,
	modifier: IModify,
	http: IHttp,
	extraData?: any
) => {
	console.log("Bot responses", botResponses);
	const language = room.visitor.livechatData?.["language"] || "en";

	const visitorName = room.visitor.name;
	const agentName = room.servedBy?.name;

	const roomExtraData = {
		...extraData,
		visitorName,
		agentName
	};
	try {
		for (const answer of botResponses) {
			const { text, buttons, list, image, transfer, close, selectLanguage } = answer;
			const messageBuilder = modifier.getCreator().startMessage();
			messageBuilder.setRoom(room);
			const messageAttachment: IMessageAttachment = {};

			if (text) {
				messageBuilder.setText(templateResolver(text, language, roomExtraData));
			}

			const replies = buttons || list;

			if (replies) {
				const actionBlock: ActionsBlock = {
					type: "actions",
					elements: replies.map(
						(button): ButtonElement =>
							({
								type: "button",
								text: {
									type: "plain_text",
									text: templateResolver(button.title, language, roomExtraData),
									emoji: true
								},
								value: templateResolver(button.title, language, roomExtraData),
								actionId: button.payload
							} as ButtonElement)
					)
				};
				messageBuilder.addBlocks([actionBlock]);
			}

			if (image) {
				messageAttachment.imageUrl = image;
				messageBuilder.addAttachment(messageAttachment);
			}

			if (transfer) {
				await transferRoom(room, transfer, language, reader, modifier);
			}

			if (close) {
				await closeChat(room, close, language, reader, modifier);
			}

			await modifier.getCreator().finish(messageBuilder);

			if (selectLanguage) {
				await selectChatLanguage(room, selectLanguage, reader, modifier, http);

				const newRoom = (await reader.getRoomReader().getById(room.id)) as ILivechatRoom;
				await sendGreetingMessage(newRoom, reader, modifier, http);
			}
		}
	} catch (error) {
		console.error("Cannot send bot responses", error);
		throw error;
	}
};

export const sendGreetingMessage = async (room: ILivechatRoom, reader: IRead, modifier: IModify, http: IHttp) => {
	const replies = await getBotReplies(reader);

	await sendBotResponses(replies["greeting"], room, reader, modifier, http);
};

export const sendSelectLanguageMessage = async (room: ILivechatRoom, reader: IRead, modifier: IModify, http: IHttp) => {
	const replies = await getBotReplies(reader);

	await sendBotResponses(replies["selectLanguage"], room, reader, modifier, http);
};

export const sendWrongResponseMessage = async (room: ILivechatRoom, reader: IRead, modifier: IModify, http: IHttp) => {
	const replies = await getBotReplies(reader);

	await sendBotResponses(replies["wrongSelection"], room, reader, modifier, http);
};

export const sendTechnicalErrorMessage = async (
	room: ILivechatRoom,
	error: Error,
	reader: IRead,
	modifier: IModify,
	http: IHttp
) => {
	const replies = await getBotReplies(reader);

	await sendBotResponses(replies["technicalError"], room, reader, modifier, http, {
		errorMessage: error?.message || error
	});
};
