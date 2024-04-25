import { ActionSendMessage, ActionTransferRoom, IBotReply } from "../types/bot";

export function validateIBotReply(data: any): data is IBotReply {
	if (typeof data !== "object" || data === null || Object.keys(data).length === 0) {
		return false;
	}

	const { buttons, departmentOfflineText, technicalErrorText, text, wrongSelectionText } = data;

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

	if (technicalErrorText !== undefined && typeof technicalErrorText !== "string") {
		return false;
	}

	if (wrongSelectionText !== undefined && typeof wrongSelectionText !== "string") {
		return false;
	}

	return true;
}

function isValidButton(button: any): button is ActionSendMessage | ActionTransferRoom {
	if (typeof button !== "object" || button === null) {
		return false;
	}

	if (button.type === "send-message" && isValidActionSendMessage(button)) {
		return true;
	}

	if (button.type === "transfer" && isValidActionTransferRoom(button)) {
		return true;
	}

	return false;
}

function isValidActionSendMessage(action: any): action is ActionSendMessage {
	if (typeof action.text !== "string" || typeof action.title !== "string" || action.type !== "send-message") {
		return false;
	}
	return true;
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
