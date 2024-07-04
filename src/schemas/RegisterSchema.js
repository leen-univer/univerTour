import {
	AccountBalance,
	ContactMail,
	Email,
	HomeOutlined,
	LocationCity,
	Person,
	VpnKey,
	Web,
} from "@mui/icons-material";
import { countries } from "configs";
import * as Yup from "yup";
const url_regex =
	/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const RegisterSchema = [
	{
		key: "1",
		label: "University / School Name",
		name: "displayName",
		validationSchema: Yup.string()
			.required("Name is Required")
			.min(3, "Name must be at least 3 characters")
			.max(50, "Name must be less than 150 characters"),
		initialValue: "",
		startIcon: <AccountBalance />,
	},
	{
		key: "4",
		label: "Phone Number",
		name: "phoneNumber",
		type: "tel",
		validationSchema: Yup.string()
			.required("Phone Number is Required")
			.min(5, "Phone Number must be at least 5 characters")
			.max(15, "Phone Number must be less than 15 characters")
			.matches(
				/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
				"Phone number is not valid"
			),
		initialValue: "",
		startIcon: <ContactMail />,
	},
	{
		key: "2",
		label: "Email",
		name: "email",
		type: "email",

		validationSchema: Yup.string()
			.required("Email is Required")
			.email("Please enter a valid email"),
		initialValue: "",
		startIcon: <Email />,
	},
	{
		key: "10",
		label: "Password",
		name: "password",
		type: "password",
		validationSchema: Yup.string()
			.min(6, "Password must be at least 6 characters")
			.required("Password is Required"),
		initialValue: "",
		startIcon: <VpnKey />,
	},

	{
		key: "5",
		label: "Location",
		name: "location",
		type: "text",
		validationSchema: Yup.string()
			.required("location is Required")
			.min(3, "location must be at least 3 characters")
			.max(50, "location must be less than 150 characters"),
		initialValue: "",
		startIcon: <HomeOutlined />,
	},
	{
		key: "7",
		label: "Your Country",
		name: "country",
		type: "select",
		validationSchema: Yup.string().required("This field is Required"),
		initialValue: "",
		options: countries.map((country) => ({
			key: country.code,
			value: `${country.label}`,
			phone: country.phone,
		})),
		startIcon: <LocationCity />,
	},
	{
		key: "6",
		label: "Contact Person",
		name: "contactName",
		type: "text",
		validationSchema: Yup.string()
			.required("Contact Person is Required")
			.min(3, "Contact Person must be at least 3 characters")
			.max(50, "Contact Person must be less than 150 characters"),
		initialValue: "",
		startIcon: <Person />,
	},
	{
		key: "6bxhs",
		label: "Role",
		name: "role",
		type: "select",
		validationSchema: Yup.string().required("This field is Required"),
		initialValue: "",
		options: [
			{ key: "1", value: `university`, label: "UNIVERSITY" },
			{ key: "1x", value: `school`, label: "SCHOOL" },
		],
		startIcon: <Person />,
	},
	{
		key: "8",
		label: "Your Website URL",
		name: "website",
		type: "url",
		validationSchema: Yup.string()
			.matches(url_regex, "URL is not valid")
			.required("This field is Required"),
		initialValue: "",
		startIcon: <Web />,
	},
];
export default RegisterSchema;
