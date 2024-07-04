import { Email, Person } from "@mui/icons-material";
import * as Yup from "yup";

const ProfileSchema = [
  {
    key: "2",
    label: "Name",
    name: "displayName",
    validationSchema: Yup.string()
      .required("Name is Required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 150 characters"),
    initialValue: "",
    startIcon: <Person />,
  },
  {
    key: "1",
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
    key: "3",
    label: "Phone Number",
    name: "phoneNumber",
    type: "tel",
    validationSchema: Yup.string()
      .required("Phone Number is Required")
      .min(5, "Phone Number must be at least 5 characters")
      .max(15, "Phone Number must be less than 15 characters"),
    initialValue: "",
  },
];
export default ProfileSchema;
