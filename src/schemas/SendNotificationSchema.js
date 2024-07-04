import * as Yup from "yup";

const SendNotificationSchema = [
  {
    key: "1",
    label: "Title Of Notification",
    name: "title",
    validationSchema: Yup.string()
      .required("Title is Required")
      .max(50, "Title must be less than 50 characters")
      .min(5, "Title must be greater than 5 characters"),
    initialValue: "",
  },
  {
    key: "2",
    label: "Description Of Notification",
    name: "description",
    multiline: true,
    rows: 5,
    validationSchema: Yup.string()
      .required("Description is Required")
      .max(350, "Description must be less than 350 characters")
      .min(5, "Description must be greater than 5 characters"),
    initialValue: "",
  },
];
export default SendNotificationSchema;
