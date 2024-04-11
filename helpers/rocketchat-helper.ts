import { IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
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

export const transferRoom = async (room: ILivechatRoom, targetDepartment: string, reader: IRead, modifier: IModify) => {
	const department = await reader.getLivechatReader().getLivechatDepartmentByIdOrName(targetDepartment);

	if (!department) {
		throw "Cannot find department";
	}

	const departmentIsOnline = reader.getLivechatReader().isOnlineAsync(department.id);

	if (!departmentIsOnline) {
		throw "Department is not online";
	}

	await modifier.getUpdater().getLivechatUpdater().transferVisitor(room.visitor, {
		currentRoom: room,
		targetDepartment: department.id
	});
};
