import { ISetting } from "@rocket.chat/apps-engine/definition/settings";

export enum ConfigId {}

export const settings: Array<ISetting> = [];

export const ServerSettingID = {
	CORS_ORIGIN: "API_CORS_Origin",
	SITE_URL: "Site_Url",
	CUSTOM_SCRIPT_LOGGED_IN: "Custom_Script_Logged_In"
};
