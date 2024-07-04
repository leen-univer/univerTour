import * as Yup from "yup";

const changePasswordSchema = [
  {
    key: "1",
    label: "Old Password",
    name: "oldPassword",
    type: "password",
    validationSchema: Yup.string()
      .required("Current password Required")
      .min(8, "Password must be at least 8 characters")
      .trim(),
    initialValue: "",
  },
  {
    key: "2",
    label: "New Password",
    name: "newPassword",
    type: "password",
    validationSchema: Yup.string()
      .required("Enter your New password")
      .min(8, "Password must be 8 characters long")
      .trim(),
    initialValue: "",
  },
  {
    key: "3",
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    validationSchema: Yup.string()
      .required("New password does not match. Enter new password again here!")
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .trim(),
    initialValue: "",
  },
];

const changePasswordInitialValues = changePasswordSchema.reduce(
  (accumulator, currentValue) => {
    accumulator[currentValue?.name] = currentValue.initialValue;
    return accumulator;
  },
  {} 
);

const changePasswordValidation = changePasswordSchema.reduce(
  (accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.validationSchema;
    return accumulator;
  },
  {} 
);

// type changePasswordValueType =
//   | {
//       oldPassword: string;
//       newPassword: string;
//       confirmPassword: string;
//     }
//   | {
//       [key: string]: string;
//     };
export {
  changePasswordSchema,
  changePasswordInitialValues,
  changePasswordValidation,
};
// export type { changePasswordValueType };
