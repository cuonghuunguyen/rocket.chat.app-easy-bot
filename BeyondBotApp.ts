import {
	IAppAccessors,
	IHttp,
	ILogger,
	IModify,
	IPersistence,
	IRead
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { ILivechatRoom, IPostLivechatRoomStarted } from "@rocket.chat/apps-engine/definition/livechat";
import { IMessage, IPostMessageSent } from "@rocket.chat/apps-engine/definition/messages";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";

export class BeyondBotApp extends App implements IPostMessageSent, IPostLivechatRoomStarted {
	constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
		super(info, logger, accessors);
	}

	executePostMessageSent(
		message: IMessage,
		read: IRead,
		http: IHttp,
		persistence: IPersistence,
		modify: IModify
	): Promise<void> {
		throw new Error("Method not implemented.");
	}

	executePostLivechatRoomStarted(
		room: ILivechatRoom,
		read: IRead,
		http: IHttp,
		persis: IPersistence,
		modify?: IModify | undefined
	): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
