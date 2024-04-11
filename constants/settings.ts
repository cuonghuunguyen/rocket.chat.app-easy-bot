import { ISetting, SettingType } from "@rocket.chat/apps-engine/definition/settings";

export enum ConfigId {
	BOT_AGENT_USERNAME = "BOT_AGENT_USERNAME",
	BOT_REPLIES = "BOT_REPLIES"
}

export const settings: Array<ISetting> = [
	{
		id: ConfigId.BOT_AGENT_USERNAME,
		type: SettingType.STRING,
		i18nLabel: "config_bot_agent_username_label",
		i18nDescription: "config_bot_agent_username_desc",
		packageValue: "botagent",
		public: false,
		required: true
	},
	{
		id: ConfigId.BOT_REPLIES,
		type: SettingType.CODE,
		i18nLabel: "config_bot_replies_label",
		i18nDescription: "config_bot_replies_desc",
		packageValue: "{}",
		public: false,
		required: true
	}
];

export const ServerSettingID = {
	CORS_ORIGIN: "API_CORS_Origin",
	SITE_URL: "Site_Url",
	CUSTOM_SCRIPT_LOGGED_IN: "Custom_Script_Logged_In"
};
