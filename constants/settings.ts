import { ISetting, SettingType } from "@rocket.chat/apps-engine/definition/settings";

import { mockResponse } from "../helpers/mock-response";

export enum ConfigId {
	BOT_AGENT_USERNAME = "BOT_AGENT_USERNAME",
	BOT_REPLIES = "BOT_REPLIES",
	DST_ENABLED = "DST_ENABLED",
	DEPARTMENT_OFFLINE_TEXT = "DEPARTMENT_OFFLINE_TEXT"
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
		packageValue: JSON.stringify(mockResponse),
		public: false,
		required: true
	},
	{
		id: ConfigId.DST_ENABLED,
		type: SettingType.BOOLEAN,
		i18nLabel: "config_dst_enabled_label",
		i18nDescription: "config_dst_enabled_desc",
		packageValue: false,
		public: false,
		required: true
	},
	{
		id: ConfigId.DEPARTMENT_OFFLINE_TEXT,
		type: SettingType.STRING,
		i18nLabel: "config_department_offline_text_label",
		i18nDescription: "config_department_offline_text_desc",
		packageValue: "Department is offline, please try again later",
		public: false,
		required: true
	}
];

export const ServerSettingID = {
	CORS_ORIGIN: "API_CORS_Origin",
	SITE_URL: "Site_Url",
	CUSTOM_SCRIPT_LOGGED_IN: "Custom_Script_Logged_In"
};
