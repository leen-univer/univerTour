import { Cancel, Money, Send } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { auth, database } from "configs";
import { useAppContext } from "contexts";
import { Field, Form, Formik } from "formik";
import { useUniversities } from "hooks";
import { CreditSchema } from "schemas";
import * as Yup from "yup";

const CreditDialog = ({ openDialog, handleClose }) => {
  const { snackBarOpen, user, sendNotification, sendMail } = useAppContext();
  const { universities } = useUniversities();
  const SUPERADMIN = universities?.filter(
    (university) => university?.role === "superadmin"
  )[0];
  // console.log(SUPERADMIN);
  const initialValues = CreditSchema?.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.initialValue;
    return accumulator;
  }, {});
  const validationSchema = CreditSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.validationSchema;
    return accumulator;
  }, {});
  const handleSendReply = async (values, submitProps) => {
    try {
      await database.ref(`RequestedCredits`).push({
        requestCredit: values?.requestCredit,
        uid: auth.currentUser.uid,
        displayName: user?.displayName,
        creditAmount: user?.creditAmount,
        read: false,
        timestamp: new Date().toString(),
      });

      const notification = {
        title: "Credit Request",
        description: `${user?.displayName} requested ${values?.requestCredit} credits`,
        read: false,
        timestamp: new Date().toString(),
      };
      sendNotification({
        notification: {
          title: "Credit Request",
          body: `${user?.displayName} requested ${values?.requestCredit} credits`,
        },
        FCMToken: SUPERADMIN?.fcmToken,
      });
      sendMail({
        to: SUPERADMIN?.email,
        subject: "Credit Request",
        html: `${user?.displayName} requested ${values?.requestCredit} credits`,
      });
      database.ref(`Notifications/${SUPERADMIN?.uid}`).push(notification);

      snackBarOpen("Request Sent Successfully", "success");

      submitProps.resetForm();
    } catch (error) {
      snackBarOpen(error.message, "error");
      console.log(error);
      submitProps.setSubmitting(false);
    }
  };
  return (
    <>
      <Dialog
        open={Boolean(openDialog)}
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
              <DialogTitle>Send Request</DialogTitle>
              {CreditSchema?.map((inputItem) => (
                <DialogContent dividers>
                  <Field name={inputItem.name} key={inputItem.key}>
                    {(props) => {
                      if (inputItem.type === "select") {
                        return (
                          <FormControl
                            required
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={Boolean(
                              props.meta.touched && props.meta.error
                            )}
                          >
                            <InputLabel id={`label-${inputItem.name}`}>
                              {inputItem.label}
                            </InputLabel>
                            <Select
                              labelId={`label-${inputItem.name}`}
                              id={inputItem.name}
                              label={inputItem.label}
                              {...props.field}
                            >
                              {inputItem.options.map((option) => (
                                <MenuItem value={option.value} key={option.key}>
                                  {option.credit}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {props.meta.touched && props.meta.error}
                            </FormHelperText>
                          </FormControl>
                        );
                      }
                      return (
                        <div>
                          <TextField
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            label={inputItem.label}
                            type={inputItem.type}
                            multiline={inputItem?.multiline}
                            rows={inputItem?.rows}
                            error={Boolean(
                              props.meta.touched && props.meta.error
                            )}
                            helperText={props.meta.touched && props.meta.error}
                            {...props.field}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Money />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      );
                    }}
                  </Field>
                </DialogContent>
              ))}
              <DialogActions>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleClose}
                  color="error"
                >
                  Close
                </Button>
                {/* <LoadingButton
                  variant="contained"
                  startIcon={<Send />}
                  disabled={!isValid}
                  loading={isSubmitting}
                  type="submit"
                >
                  Send
                </LoadingButton> */}
                <LoadingButton
                  variant="contained"
                  type="submit"
                  sx={{ color: "snow" }}
                  disabled={isSubmitting || !isValid}
                  loading={isSubmitting}
                  loadingPosition="start"
                  startIcon={<Send />}
                >
                  send
                </LoadingButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default CreditDialog;
