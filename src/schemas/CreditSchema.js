import * as Yup from "yup";

const CreditSchema = [
	{
		key: "11",
		label: "Enter Your Requested Credits",
		validationSchema: Yup.string().required("This field is Required"),
		name: "requestCredit",
		// validationSchema: Yup.number().required("Requested Credit is Required"),
		initialValue: "",
		type: "select",
		options: [
			{
				credit: "3 credits (1800 AED)",
				value: 3,
				key: "1",
			},
			{
				credit: "5 credits (2500 AED)",
				value: 5,
				key: "2",
			},
			{
				credit: "10 credits (4500 AED)",
				value: 10,
				key: "3",
			},
			// {
			// 	credit: "100 Credits ($850)",
			// 	value: 100,
			// 	key: "4",
			// },
			// {
			// 	credit: "150 Credits ($1000)",
			// 	value: 150,
			// 	key: "5",
			// },
		],
	},
];
export default CreditSchema;
