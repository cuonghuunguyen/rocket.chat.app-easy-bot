export const templateResolver = (text: string, args: any): string => {
	return text.replace(/\$([a-zA-Z_]+?)\$/g, (match, group1) => {
		return args[group1] ? args[group1] : match;
	});
};
