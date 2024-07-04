import { Dialog, DialogContent, DialogTitle,Container } from "@mui/material";
import { useState } from "react";
import * as Yup from "yup";
import { Form,Formik} from "formik";
import Swal from "sweetalert2";
import { TextInput } from "components/core";
import { Done,} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import ChangePasswordSchemas from "schemas/ChangePasswordSchemas";
import { auth, database } from "configs";
import { useAppContext } from "contexts";
import { BASE_URL } from "configs/api";




const PasswordDialogue = ({ open, setIsOpen,universityData }) => {
    console.log("universityData:",universityData)
    const { snackBarOpen } = useAppContext();
  const initialValues = ChangePasswordSchemas.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.initialValue;
    return accumulator;
  }, {});
  const validationSchema = ChangePasswordSchemas.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.validationSchema;
    return accumulator;
  }, {});
//   const handleLogin =  (values, submitProps) => {
//     console.log(values);
//     Swal.fire(`Success`, `Password changed successfully!`, "success");
//   };
const handleChangePassword = async (values, submitProps) => {
   try {
    const respond = await fetch(BASE_URL + "/update-password-university", {
      method: "POST",
      body: JSON.stringify({ uid: universityData?.uid,newPassword: values?.newPassword}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await respond.json();
    setIsOpen(false)
    Swal.fire(`Success`, `Password changed successfully!`, "success")
   } catch (error) {
    Swal.fire(`Error`, `${error.message}`, "error")
   }
  };
  return (
    <Dialog
      onClose={()=>setIsOpen(false)}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth
      className=""
    >
      <DialogTitle className="" id="customized-dialog-title">
        <p className="text-center text-xl font-bold text-theme tracking-wide">
          VIEW UNIVERSITY DETAILS
        </p>
      </DialogTitle>
      <DialogContent className="app-scrollbar" sx={{ p: 2 }}>
        <div className="md:w-full md:px-4 px-2 tracking-wide">
          <div className="flex  gap-3">
            <p className="font-semibold">
              University Name :
            </p>
            <p className="font-semibold">
              {universityData?.displayName}{" "}
            </p>
          </div>
        </div>
     

        {/* <Formik
          initialValues={initialValues}
          validationSchema={Yup.object(validationSchema)}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              <CardContent>
                {ChangePasswordSchemas.map((inputItem) => (
                  <TextInput
                    key={inputItem.key}
                    name={inputItem?.name}
                    label={inputItem?.label}
                    type={inputItem?.type}
                    startIcon={inputItem?.startIcon}
                  />
                ))}
               
                <div style={{ textAlign: "right" }}></div>
                <div className="place-content-center">
                  <LoadingButton
                    className="mt-1vh gradient"
                    variant="contained"
                    sx={{ color: "snow" }}
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    loading={isSubmitting}
                    loadingPosition="start"
                    //startIcon={<LoginOutlined />}
                    fullWidth
                  >
                    Change Password
                  </LoadingButton>
                </div>
               
              </CardContent>
            </Form>
          )}
        </Formik> */}
         <Container maxWidth="sm">
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object(validationSchema)}
        onSubmit={handleChangePassword}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            {ChangePasswordSchemas.map((inputItem) => (
              <TextInput
                key={inputItem.key}
                name={inputItem?.name}
                label={inputItem?.label}
                type={inputItem?.type}
                startIcon={inputItem?.startIcon}
              />
            ))}
            <div className="flex justify-center items-center">
              <LoadingButton
                className="mt-1vh gradient"
                variant="contained"
                type="submit"
                disabled={isSubmitting || !isValid}
                loading={isSubmitting}
                loadingPosition="start"
                startIcon={<Done />}
                sx={{ color: "snow" }}
              >
                Update Password
              </LoadingButton>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialogue;
