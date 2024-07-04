import { Cancel, Send } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { TextInput } from "components/core";
import { Form, Formik } from "formik";
import { MessageSchema } from "schemas";
import * as Yup from "yup";
const SendReply = ({ selectedUsers, handleClose }) => {
  const initialValues = MessageSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.initialValue;
    return accumulator;
  }, {});
  const validationSchema = MessageSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.validationSchema;
    return accumulator;
  }, {});
  const handleSendReply = async (values, submitProps) => {
    try {
      // console.log(values, selectedUsers);
      submitProps.resetForm();
    } catch (error) {
      console.log(error);
      submitProps.setSubmitting(false);
    }
  };
  return (
    <>
      <Dialog
        open={Boolean(selectedUsers?.length)}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object(validationSchema)}
          onSubmit={handleSendReply}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              <DialogTitle>Send Reply</DialogTitle>
              <DialogContent dividers>
                {MessageSchema.map((inputItem) => (
                  <TextInput
                    key={inputItem.key}
                    name={inputItem?.name}
                    label={inputItem?.label}
                    type={inputItem?.type}
                    startIcon={inputItem?.startIcon}
                    multiline={inputItem?.multiline}
                    rows={inputItem?.rows}
                  />
                ))}
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleClose}
                  color="error"
                >
                  Close
                </Button>
                <LoadingButton
                  variant="contained"
                  startIcon={<Send />}
                  disabled={!isValid}
                  loading={isSubmitting}
                  type="submit"
                >
                  Send
                </LoadingButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default SendReply;
