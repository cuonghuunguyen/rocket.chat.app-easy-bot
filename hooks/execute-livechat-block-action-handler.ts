import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IApp } from "@rocket.chat/apps-engine/definition/IApp";
import { ILivechatRoom } from "@rocket.chat/apps-engine/definition/livechat";
import { IUIKitResponse, UIKitLivechatBlockInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { UIKitIncomingInteractionContainerType } from "@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionContainer";

import { ConfigId } from "../constants/settings";
import { sendInteractive } from "../helpers/rocketchat-helper";

export class ExecuteLivechatBlockActionHandler {
	constructor(
		private readonly app: IApp,
		private context: UIKitLivechatBlockInteractionContext,
		private reader: IRead,
		private http: IHttp,
		private persistence: IPersistence,
		private modifier: IModify
	) {}

	public async run(): Promise<IUIKitResponse> {
		try {
			const interactionData = this.context.getInteractionData();
			const settingReader = this.reader.getEnvironmentReader().getSettings();
			const {
				visitor,
				room,
				container: { id, type },
				value: title = "",
				actionId
			} = interactionData;

			if (type !== UIKitIncomingInteractionContainerType.MESSAGE) {
				console.log("Not a message interaction", type);
				return this.context.getInteractionResponder().successResponse();
			}

			const botAgentUsername = await settingReader.getValueById(ConfigId.BOT_AGENT_USERNAME);

			const { servedBy: { username = null } = {}, id: rid } = room as ILivechatRoom;

			if (!username || botAgentUsername !== username) {
				console.log("Not a bot agent", username, botAgentUsername);
				return this.context.getInteractionResponder().successResponse();
			}

			await sendInteractive({ actionId, title }, room as ILivechatRoom, this.modifier);

			return this.context.getInteractionResponder().successResponse();
		} catch (error) {
			console.error(error);
			return this.context.getInteractionResponder().errorResponse();
		}
	}
}
