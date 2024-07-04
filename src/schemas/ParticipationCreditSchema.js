import * as Yup from "yup";

const ParticipationCreditSchema = [
  {
    key: "11",
    label: "Enter Participation Credits",
    validationSchema: Yup.string().required("This field is Required"),
    name: "credits",
    // validationSchema: Yup.number().required("Requested Credit is Required"),
    initialValue: "",
    type: "number",
  },
];
export default ParticipationCreditSchema;
