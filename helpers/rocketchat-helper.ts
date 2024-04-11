import { IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { ILivechatRoom } from "@rocket.chat/apps-engine/definition/livechat";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export const sendText = async (text: string, room: ILivechatRoom, sender: IUser, modifier: IModify) => {
	// Create message builder
	const messageBuilder = modifier.getCreator().startMessage();

	// Set the message text, room, and sender
	messageBuilder.setText(text);
	messageBuilder.setRoom(room);
	messageBuilder.setSender(sender);

	// Complete and send the message
	await modifier.getCreator().finish(messageBuilder);
};

export const closeRoom = async (room: ILivechatRoom, reason: string, modifier: IModify) => {
	await modifier.getUpdater().getLivechatUpdater().closeRoom(room, `Transfer failed to ${reason}`);
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
