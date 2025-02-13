import { App } from "@rocket.chat/apps-engine/definition/App";
import {
	IAppAccessors,
	IConfigurationExtend,
	IEnvironmentRead,
	IHttp,
	ILogger,
	IModify,
	IPersistence,
	IRead
} from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage, IPostMessageSent } from "@rocket.chat/apps-engine/definition/messages";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { IUIKitResponse, UIKitLivechatBlockInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";

import { settings } from "./constants/settings";
import { ExecuteLivechatBlockActionHandler } from "./hooks/execute-livechat-block-action-handler";
import PostMessageSentHandler from "./hooks/post-message-sent-handler";

class EasyBotApp extends App implements IPostMessageSent {
	constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
		super(info, logger, accessors);
	}

	protected async extendConfiguration(
		configuration: IConfigurationExtend,
		environmentRead: IEnvironmentRead
	): Promise<void> {
		await Promise.all(settings.map(setting => configuration.settings.provideSetting(setting)));
	}

	async executePostMessageSent(
		message: IMessage,
		reader: IRead,
		http: IHttp,
		persistence: IPersistence,
		modifier: IModify
	): Promise<void> {
		const postMessageSentHandler = new PostMessageSentHandler(this, message, reader, http, persistence, modifier);
		await postMessageSentHandler.run();
	}

	public async executeLivechatBlockActionHandler(
		context: UIKitLivechatBlockInteractionContext,
		read: IRead,
		http: IHttp,
		persistence: IPersistence,
		modify: IModify
	): Promise<IUIKitResponse> {
		const handler = new ExecuteLivechatBlockActionHandler(this, context, read, http, persistence, modify);
		return await handler.run();
	}

	// async onPreSettingUpdate(
	// 	context: ISettingUpdateContext,
	// 	configurationModify: IConfigurationModify,
	// 	read: IRead,
	// 	http: IHttp
	// ): Promise<ISetting> {
	// 	const { newSetting, oldSetting } = context;
	// 	const { id, value } = newSetting;

	// 	if (id !== ConfigId.BOT_REPLIES) {
	// 		return newSetting;
	// 	}
	// 	let botReplies: any;
	// 	try {
	// 		botReplies = JSON.parse(value);
	// 	} catch (error) {
	// 		return oldSetting;
	// 	}

	// 	if (validateIBotReply(botReplies)) {
	// 		return newSetting;
	// 	}

	// 	return oldSetting;
	// }
}

export default EasyBotApp;
