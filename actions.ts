import { IHttp, IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { ILivechatRoom } from "@rocket.chat/apps-engine/definition/livechat";

import { ConfigId } from "./constants/settings";
import { isValidTimeRange } from "./helpers/day-helpers";
import { closeRoom, sendText, updateVisitorCustomField } from "./helpers/rocketchat-helper";
import { templateResolver } from "./helpers/template-resolver";
import { ActionCloseRoom, ActionSelectLanguage, ActionTransferRoom } from "./types";

export async function transferRoom(
	room: ILivechatRoom,
	actionTransfer: ActionTransferRoom,
	language: string,
	reader: IRead,
	modifier: IModify
): Promise<void> {
	const { department: departmentNameOrId, conditions, welcomeMessage } = actionTransfer;

	console.log("Transfering room with action", actionTransfer);
	const { startBusinessHour, stopBusinessHour, workDays } = conditions || {};
	const department = await reader.getLivechatReader().getLivechatDepartmentByIdOrName(departmentNameOrId);
	const dstEnabled = await reader.getEnvironmentReader().getSettings().getValueById(ConfigId.DST_ENABLED);
	const departmentOfflineText = await reader
		.getEnvironmentReader()
		.getSettings()
		.getValueById(ConfigId.DEPARTMENT_OFFLINE_TEXT);

	if (!department) {
		throw "Cannot find department";
	}

	const departmentIsOnline = reader.getLivechatReader().isOnlineAsync(department.id);

	if (!departmentIsOnline) {
		throw "Department is not online";
	}

	if (!isValidTimeRange(startBusinessHour, stopBusinessHour, workDays, dstEnabled)) {
		console.error(
			`Transfer failed to ${department.name} because it is out of business hour from ${startBusinessHour} to ${stopBusinessHour}`
		);

		await sendText(
			templateResolver(departmentOfflineText, language, {
				startBusinessHour,
				stopBusinessHour
			}),
			room,
			modifier
		);

		await closeRoom(room, `Transfer failed to ${departmentNameOrId}`, modifier);
		return;
	}

	const success = await modifier
		.getUpdater()
		.getLivechatUpdater()
		.transferVisitor((room as ILivechatRoom).visitor, {
			currentRoom: room as ILivechatRoom,
			targetDepartment: department.id
		});

	if (!success) {
		throw "Transfer chat failed with unknown reason";
	}

	if (welcomeMessage) {
		const newRoom = (await reader.getRoomReader().getById(room.id)) as ILivechatRoom;
		await sendText(
			templateResolver(welcomeMessage, language, {
				startBusinessHour,
				stopBusinessHour
			}),
			newRoom,
			modifier
		);
	}
}

export async function closeChat(
	room: ILivechatRoom,
	actionCloseRoom: ActionCloseRoom,
	language: string,
	reader: IRead,
	modifier: IModify
) {
	const { reason = "" } = actionCloseRoom;
	console.log("Closing room with action", actionCloseRoom);

	await closeRoom(room, templateResolver(reason, language), modifier);
}
export async function selectChatLanguage(
	room: ILivechatRoom,
	actionSelectLanguage: ActionSelectLanguage,
	reader: IRead,
	modifier: IModify,
	http: IHttp
) {
	const { language } = actionSelectLanguage;
	console.log("Changing language for room with action", actionSelectLanguage);

	await updateVisitorCustomField(room, "language", language, modifier);
}
