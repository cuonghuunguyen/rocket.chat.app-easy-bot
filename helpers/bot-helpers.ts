import { inspect } from "util";

import { IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { ILivechatRoom } from "@rocket.chat/apps-engine/definition/livechat";
import {
	IMessageAction,
	IMessageAttachment,
	MessageActionType,
	MessageProcessingType
} from "@rocket.chat/apps-engine/definition/messages";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

import { ConfigId } from "../constants/settings";
import { ActionTransferRoom, BotButtonType, IBotReply, IExtendedMessageAction } from "../types/bot";

export const getBotReplies = async (reader: IRead): Promise<IBotReply> => {
	const botRepliesRaw = await reader.getEnvironmentReader().getSettings().getValueById(ConfigId.BOT_REPLIES);
	return JSON.parse(botRepliesRaw);
};

export const getBotResponsesAttachment = async (reader: IRead): Promise<IMessageAttachment | undefined> => {
	try {
		const botReplies: IBotReply = await getBotReplies(reader);
		const messageAttachment: IMessageAttachment = {};

		messageAttachment.text = botReplies.text;

		messageAttachment.actions = botReplies.buttons?.map(button => {
			let messageAction: IMessageAction = {
				type: MessageActionType.BUTTON,
				msg_processing_type: MessageProcessingType.RespondWithMessage,
				msg_in_chat_window: true
			};

			messageAction.text = button.title;

			switch (button.type) {
				case BotButtonType.SEND_MESSAGE: {
					messageAction.msg = button.text;
					break;
				}
				case BotButtonType.TRANSFER_CHAT: {
					const extendedAction: IExtendedMessageAction = {
						...messageAction,
						actionId: computeTransferAction(button),
						msg: "transfer"
					};
					messageAction = {
						...messageAction,
						...extendedAction
					};
				}
			}
			return messageAction;
		});

		return messageAttachment;
	} catch (error) {
		console.error("Cannot get bot reply", error);
	}
	return undefined;
};

export const sendGreetingMessage = async (room: ILivechatRoom, reader: IRead, modifier: IModify) => {
	const roomAgent = room.servedBy as IUser;
	const messageBuilder = modifier.getCreator().startMessage();

	const replies = await getBotResponsesAttachment(reader);

	if (!replies) {
		// TODO send error
		console.error("Cannot get bot reply for the room ", room.id);
		return;
	}

	messageBuilder.addAttachment(replies);
	messageBuilder.setRoom(room);
	messageBuilder.setSender(roomAgent);
	console.log("Sending message", inspect(replies, { depth: 4 }));
	await modifier.getCreator().finish(messageBuilder);
};

export const computeTransferAction = (action: ActionTransferRoom, onlyDepartment = false) => {
	const { department, conditions } = action;
	console.log(inspect(action));
	if (onlyDepartment) {
		return `transfer/${department}`;
	}
	return `transfer/${department}/${conditions?.startBusinessHour || "_"}/${conditions?.stopBusinessHour || "_"}`;
};

export const getTransferAction = (actionRaw: string): ActionTransferRoom | undefined => {
	if (!actionRaw.startsWith("transfer")) {
		console.error("Transfer action must starts with transfer");
		return;
	}

	const segments = actionRaw.split("/");
	if (segments.length !== 4) {
		console.error("Invalid transfer action");
		return;
	}

	const [_, department, startBusinessHourRaw, stopBusinessHourRaw] = segments;

	return {
		type: BotButtonType.TRANSFER_CHAT,
		title: "transfer",
		department,
		conditions: {
			startBusinessHour: startBusinessHourRaw === "_" ? undefined : startBusinessHourRaw,
			stopBusinessHour: stopBusinessHourRaw === "_" ? undefined : stopBusinessHourRaw
		}
	};
};
