import { IMessageAction } from "@rocket.chat/apps-engine/definition/messages";

export interface IBotReply {
	dstEnabled: boolean;
	text: string;
	wrongSelectionText?: string;
	transferSuccessText?: string;
	departmentOfflineText?: string;
	technicalErrorText?: string;
	buttons?: (ActionSendMessage | ActionTransferRoom)[];
}
export interface IBotButtonBase {
	type: BotButtonType;
	title: string;
}

export enum BotButtonType {
	SEND_MESSAGE = "send-message",
	TRANSFER_CHAT = "transfer"
}

export interface ActionSendMessage extends IBotButtonBase {
	type: BotButtonType.SEND_MESSAGE;
	text: string;
}

export interface ActionTransferRoom extends IBotButtonBase {
	type: BotButtonType.TRANSFER_CHAT;
	department: string;
	fallbackDepartment?: string;
	conditions?: {
		startBusinessHour?: string;
		stopBusinessHour?: string;
	};
}

export interface IExtendedMessageAction extends IMessageAction {
	actionId: string;
}
