import * as Yup from "yup";

const ContactUsSchema = [
  {
    key: "1",
    label: "University Name",
    name: "name",
    validationSchema: Yup.string()
      .required("Name is Required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 150 characters"),
    initialValue: "",
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
  },
  {
    key: "3",
    label: "Phone",
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
  },
  {
    key: "4",
    label: "Subject",
    name: "subject",
    validationSchema: Yup.string()
      .required("Subject is Required")
      .max(50, "Subject must be less than 50 characters")
      .min(5, "Subject must be greater than 5 characters"),
    initialValue: "",
  },
  {
    key: "5",
    label: "Drop a Message 😊",
    name: "message",
    multiline: true,
    rows: 4,
    validationSchema: Yup.string()
      .required("Message is Required")
      .max(350, "Message must be less than 350 characters")
      .min(5, "Message must be greater than 5 characters"),
    initialValue: "",
  },
];
export default ContactUsSchema;
