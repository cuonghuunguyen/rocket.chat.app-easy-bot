import { ActionSendMessage, ActionTransferRoom, IBotReply } from "../types/bot";

export function validateIBotReply(data: any): data is IBotReply {
	if (typeof data !== "object" || data === null || Object.keys(data).length === 0) {
		return false;
	}

	const { buttons, departmentOfflineText, technicalErrorText, text, wrongSelectionText, fallbackDepartment } = data;

	if (typeof text !== "string") {
		return false;
	}

	if (buttons) {
		if (!Array.isArray(buttons)) {
			return false;
		}
		if (!buttons.every(item => isValidButton(item))) {
			return false;
		}
	}

	if (departmentOfflineText !== undefined && typeof departmentOfflineText !== "string") {
		return false;
	}

	if (fallbackDepartment !== undefined && typeof fallbackDepartment !== "string") {
		return false;
	}

	if (technicalErrorText !== undefined && typeof technicalErrorText !== "string") {
		return false;
	}

	return !(wrongSelectionText !== undefined && typeof wrongSelectionText !== "string");
}

function isValidButton(button: any): button is ActionSendMessage | ActionTransferRoom {
	if (typeof button !== "object" || button === null) {
		return false;
	}

	if (button.type === "send-message" && isValidActionSendMessage(button)) {
		return true;
	}

	return !!(button.type === "transfer" && isValidActionTransferRoom(button));
}

function isValidActionSendMessage(action: any): action is ActionSendMessage {
	return !(typeof action.text !== "string" || typeof action.title !== "string" || action.type !== "send-message");
}

function isValidActionTransferRoom(action: any): action is ActionTransferRoom {
	if (typeof action.department !== "string" || typeof action.title !== "string" || action.type !== "transfer") {
		return false;
	}

	if (action.conditions) {
		const { startBusinessHour, stopBusinessHour } = action.conditions;
		if (startBusinessHour !== undefined && typeof startBusinessHour !== "string") {
			return false;
		}
		if (stopBusinessHour !== undefined && typeof stopBusinessHour !== "string") {
			return false;
		}
	}

	return true;
}
