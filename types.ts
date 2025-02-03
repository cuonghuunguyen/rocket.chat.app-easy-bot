export type Interactive = {
	title: string;
	actionId: string;
};

import { IMessageAction } from "@rocket.chat/apps-engine/definition/messages";

export interface IExtendedMessageAction extends IMessageAction {
	actionId: string;
	description?: string;
}

export const isExtendedMessageAction = (action: IMessageAction): action is IExtendedMessageAction => {
	return Boolean((action as IExtendedMessageAction).actionId);
};

export type IBotReply = Record<string, IBotResponse[]>;

/**
 * The default schema for Rasa response button
 */
export interface IWhatsAppButton {
	payload: string;
	description?: Localizable;
	title: Localizable;
}

export interface ActionTransferRoom {
	department: string;
	fallbackDepartment?: string;
	conditions?: {
		startBusinessHour?: string;
		stopBusinessHour?: string;
		workDays?: string[];
	};
	welcomeMessage?: Localizable;
}

export interface ActionCloseRoom {
	reason?: Localizable;
}

export interface ActionSelectLanguage {
	language: string;
}

export type Localizable =
	| {
			[lang: string]: string;
	  }
	| string;

export interface IBotResponse {
	text?: Localizable;
	buttons?: IWhatsAppButton[];
	list?: IWhatsAppButton[];
	image?: string;
	transfer?: ActionTransferRoom;
	close?: ActionCloseRoom;
	selectLanguage?: ActionSelectLanguage;
}
