import * as Yup from "yup";

const MessageSchema = [
	{
		key: "1",
		label: "Message",
		name: "message",
		multiline: true,
		rows: 1,
		validationSchema: Yup.string()
			.required("Message is Required"),
		initialValue: "",
	},
];
export default MessageSchema;
