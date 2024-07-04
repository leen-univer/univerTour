import {
  BorderColor,
  ContactMail,
  Email,
  FmdGood,
  LocationCity,
  Stars,
} from "@mui/icons-material";
import { countries } from "configs";
import * as Yup from "yup";

const StudentRegisterSchema = [
  {
    key: "1",
    label: "Name",
    name: "name",
    validationSchema: Yup.string()
      .required("Name is Required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 150 characters"),
    initialValue: "",
    startIcon: <BorderColor />,
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
    key: "7",
    label: "Gender",
    name: "gender",
    type: "select",
    validationSchema: Yup.string().required("This field is Required"),
    initialValue: "",
    options: [
      {
        label: "Male",
        value: "MALE",
      },
      {
        label: "Female",
        value: "FEMALE",
      },
    ],
    startIcon: <LocationCity />,
  },
  {
    key: "hb1",
    label: "Age (years)",
    name: "age",
    type: "number",
    validationSchema: Yup.string().required("Age is required"),
    initialValue: "",
    startIcon: <BorderColor />,
  },
  {
    key: "hbxdxfvgas1",
    label: "Nationality",
    name: "nationality",
    type: "select",
    options: countries.map((country) => ({
      key: country.code,
      value: `${country.label}`,
      phone: country.phone,
    })),
    validationSchema: Yup.string().required("Nationality is required"),
    initialValue: "",
    startIcon: <FmdGood />,
  },
  {
    key: "hbxaas1",
    label: "Area Of Interest",
    name: "areaOfInterest",
    type: "select",
    options: [
      {
        key: "1",
        value: `Business/Finance/Accounting`,
        label: "Business/Finance/Accounting",
      },
      { key: "1x", value: `Engineering`, label: "Engineering" },
      {
        key: "1xs",
        value: `Medicine/Pharmacy/Nursing`,
        label: "Medicine/Pharmacy/Nursing",
      },
      {
        key: "1wxs",
        value: `Sciences`,
        label: "Sciences",
      },
      {
        key: "1wsaxs",
        value: `Art_Design`,
        label: "Art & Design ",
      },
      {
        key: "1wxs",
        value: `Law_International_Relations`,
        label: "Law & International Relations ",
      },
      {
        key: "1wwsxs",
        value: `Computer_AI`,
        label: "Computer & AI",
      },
      {
        key: "1wdexs",
        value: `SportsSciences`,
        label: "Sports Sciences",
      },
      {
        key: "1asxs",
        value: `psychology`,
        label: "Psychology",
      },
      {
        key: "ss",
        value: `other`,
        label: "Other",
      },
    ],
    validationSchema: Yup.string().required("Area Of Interest is required"),
    initialValue: "",

    startIcon: <Stars />,
  },
];
export default StudentRegisterSchema;
