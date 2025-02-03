import { Localizable } from "../types";

export const templateResolver = (text: Localizable, language: string, args?: any): string => {
	const localizedText = (typeof text === "string" ? text : text[language]) || "";

	return localizedText.replace(/\$([a-zA-Z_]+?)\$/g, (match, group1) => {
		return args[group1] ? args[group1] : match;
	});
};
