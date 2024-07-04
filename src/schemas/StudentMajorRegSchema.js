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
  
  const StudentMajorRegSchema = [
    {
      key: "2",
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
      key: "hbxdxfvgas1",
      label: "Nationality",
      name: "nationality",
      type: "select",
      options: countries.map((country) => ({
        key: country.code,
        value: country.label,
        phone: true, // ليظهر العلم
        dialCode: country.dialCode, // الرمز الخاص بالبلد
      })),
      validationSchema: Yup.string().required("Nationality is required"),
      initialValue: "",
      startIcon: <FmdGood />,
    },
    {
      key: "4",
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
    {
      key: "hbxdxfvga",
      label: "Country Of Area Interest",
      name: "nationalityOfAreaInterest",
      type: "select",
      options: countries.map((country) => ({
        key: country.code,
        value: country.label,
        phone: true, // ليظهر العلم
        dialCode: country.dialCode, // الرمز الخاص بالبلد
      })),
      validationSchema: Yup.string().required("Nationality is required"),
      initialValue: "",
      startIcon: <FmdGood />,
    },
  ];
  
  export default StudentMajorRegSchema;
  