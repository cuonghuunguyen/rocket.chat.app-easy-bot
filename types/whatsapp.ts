interface ButtonReply {
	type: "button_reply";
	button_reply: {
		id: string; // Unique ID of a button
		title: string; // Title of a button
	};
}

interface ListReply {
	type: "list_reply";
	list_reply: {
		id: string; // Unique ID of the selected list item
		title: string; // Title of the selected list item
		description: string; // Description of the selected row
	};
}

export type Interactive = ButtonReply | ListReply;
