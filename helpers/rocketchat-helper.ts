import { ILivechatMessageBuilder, IMessageBuilder, IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { ILivechatRoom } from "@rocket.chat/apps-engine/definition/livechat";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

import { Interactive } from "../types";

export const sendText = async (text: string, room: ILivechatRoom, modifier: IModify, fromVisitor = false) => {
	// Create message builder
	let messageBuilder: ILivechatMessageBuilder | IMessageBuilder;

	if (fromVisitor) {
		messageBuilder = modifier.getCreator().startLivechatMessage();
		messageBuilder.setToken(room.visitor.token);
	} else {
		messageBuilder = modifier.getCreator().startMessage();
	}
	messageBuilder.setSender(room.servedBy!);
	// Set the message text, room, and sender
	messageBuilder.setText(text);
	messageBuilder.setRoom(room);

	// Complete and send the message
	await modifier.getCreator().finish(messageBuilder);
};

export const sendInteractive = async (interactive: Interactive, room: ILivechatRoom, modifier: IModify) => {
	// Create message builder
	const messageBuilder: ILivechatMessageBuilder = modifier.getCreator().startLivechatMessage();
	messageBuilder.setToken(room.visitor.token);

	messageBuilder.setSender(room.servedBy!);
	// Set the message text, room, and sender
	messageBuilder.setText(interactive.title);
	messageBuilder.setRoom(room);

	messageBuilder.getMessage().customFields = {
		interactive: interactive
	};
	// Complete and send the message
	await modifier.getCreator().finish(messageBuilder);
};

export const closeRoom = async (room: ILivechatRoom, reason: string, modifier: IModify) => {
	await modifier.getUpdater().getLivechatUpdater().closeRoom(room, reason);
};

export const updateVisitorCustomField = async (room: ILivechatRoom, key: string, value: string, modifier: IModify) => {
	const token = room.visitor.token;
	await modifier.getUpdater().getLivechatUpdater().setCustomFields(token, key, value, true);
};

export const addRoomCustomField = async (
	room: ILivechatRoom,
	key: string,
	value: any,
	updater: IUser,
	modifier: IModify
) => {
	const roomExtender = (await modifier.getUpdater().room(room.id, updater)).addCustomField(key, value);
	modifier.getUpdater().finish(roomExtender);
};
