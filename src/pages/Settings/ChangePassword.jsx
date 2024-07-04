import { Done } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Container } from "@mui/material";
import { TextInput } from "components/core";
import { Form, Formik } from "formik";
import { ChangePasswordSchema } from "schemas";
import { auth, database } from "configs";
import * as Yup from "yup";
import { useAppContext } from "contexts";
const ChangePassword = () => {
  const { snackBarOpen } = useAppContext();
  const initialValues = ChangePasswordSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.initialValue;
      return accumulator;
    },
    {}
  );
  const validationSchema = ChangePasswordSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.validationSchema;
      return accumulator;
    },
    {}
  );
  const handleChangePassword = async (values, submitProps) => {
    try {
      await auth.currentUser.updatePassword(values.newPassword);
      database
        .ref(`Users/${auth.currentUser.uid}`)
        .update({ password: values.newPassword });

      snackBarOpen("Password Changed Successfully", "success");
      submitProps.resetForm();
    } catch (error) {
      snackBarOpen(error.message, "error");
      console.log(error);
      snackBarOpen(error?.message, "error");
      submitProps.setSubmitting(false);
    }
  };
  return (
    <Container maxWidth="sm">
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object(validationSchema)}
        onSubmit={handleChangePassword}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            {ChangePasswordSchema.map((inputItem) => (
              <TextInput
                key={inputItem.key}
                name={inputItem?.name}
                label={inputItem?.label}
                type={inputItem?.type}
                startIcon={inputItem?.startIcon}
              />
            ))}
            <div className="d-flex place-content-end">
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
  );
};

export default ChangePassword;
