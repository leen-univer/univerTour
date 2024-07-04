import { Person } from "@mui/icons-material";
import * as Yup from "yup";
import { number } from "yup";

const url_regex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const AddSchoolFairSchema = [
  {
    key: "2",
    label: "Name",
    name: "displayName",
    placeholder: "Usually will be your school name",
    validationSchema: Yup.string()
      .required("Name is Required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 150 characters"),
    initialValue: "",
    startIcon: <Person />,
  },

  {
    key: "7",
    label: "City",
    name: "city",
    validationSchema: Yup.string()
      .required("City Name Is Required")
      .min(3, "City must be at least 3 characters")
      .max(50, "City must be less than 150 characters"),
    initialValue: "",
    startIcon: <Person />,
  },

  {
    key: "6",
    label: "School System",
    name: "schoolName",
    validationSchema: Yup.string()
      .required("School Name is Required")
      .min(3, "School Name must be at least 3 characters")
      .max(50, "School Name must be less than 150 characters"),
    initialValue: "",
    startIcon: <Person />,
  },

  {
    key: "5",
    label: "Date",
    name: "date",
    type: "date",
    validationSchema: Yup.date().nullable().required("Start Date is required"),
    // .min(new Date(), "Start Date must be later than today"),
    min: new Date().toISOString().split("T")[0],
    initialValue: "",
    startIcon: <Person />,
  },

  {
    key: "8",
    label: "Start Time",
    name: "time",
    type: "time",
    validationSchema: Yup.string().required("Start Time is Required"),
    initialValue: "",
    startIcon: <Person />,
  },
  {
    key: "8.1",
    label: "End Time",
    name: "endTime",
    type: "time",
    validationSchema: Yup.string().required("End Time is Required"),
    initialValue: "",
    startIcon: <Person />,
  },
  //   {
  //     key: "11",
  //     label: "Participation Credits",
  //     name: "credits",
  //     type: "number",
  //     validationSchema: Yup.string().required("Time is Required"),
  //     initialValue: "",
  //     startIcon: <Person />,
  //   },
  {
    key: "15",
    label: "Number Of Students",
    name: "studentCount",
    type: number,
    validationSchema: Yup.number().required("This field is required"),
    initialValue: "",
    startIcon: <Person />,
  },
  {
    key: "10",
    label: "Location Link",
    name: "link",
    type: "url",
    validationSchema: Yup.string()
      .matches(url_regex, "URL is not valid")
      .required("Location Link Is Required"),
    initialValue: "",
    startIcon: <Person />,
  },

  {
    key: "9",
    label: "Notes",
    name: "notes",
    validationSchema: Yup.string()
      .required("Notes is Required")
      .min(3, "Univer Notes must be at least 3 characters")
      .max(250, "Univer Notes must be less than 250 characters"),
    initialValue: "",
    multiline: true,
    rows: 1,
    type: "text",
    startIcon: <Person />,
  },
];
export default AddSchoolFairSchema;
