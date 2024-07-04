import { Lock } from "@mui/icons-material";
import * as Yup from "yup";

const ChangePasswordSchema = [
	{
		key: "2",
		label: "New Password",
		name: "newPassword",
		type: "password",
		validationSchema: Yup.string()
			.min(6, "Password must be at least 6 characters")
			.required("Password is Required"),
		initialValue: "",
		startIcon: <Lock />,
	},
	{
		key: "3",
		label: "Confirm Password",
		name: "confirmPassword",
		type: "password",
		validationSchema: Yup.string()
			.required("Confirm Password is Required")
			.test("confirmPassword", "Passwords must match", function (value) {
				return this?.parent?.newPassword === value;
			}),
		initialValue: "",
		startIcon: <Lock />,
	},
];
export default ChangePasswordSchema;
