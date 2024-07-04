import { Cancel, Done, Money, Send } from "@mui/icons-material";
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
import { ParticipationCreditSchema } from "schemas";
import * as Yup from "yup";

const ParticipationCreditDialog = ({ openDialog, handleClose }) => {
  const { snackBarOpen, user, sendNotification, sendMail } = useAppContext();
  const { universities } = useUniversities();
  const School = universities?.filter(
    (university) => university?.uid === openDialog?._id
  )[0];
  // console.log(School);
  const initialValues = ParticipationCreditSchema?.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.initialValue;
      return accumulator;
    },
    {}
  );
  const validationSchema = ParticipationCreditSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.validationSchema;
      return accumulator;
    },
    {}
  );
  const handleSendReply = async (values, submitProps) => {
    try {
      await database.ref(`SchoolFairs/${School?.uid}/${openDialog?.id}`).set({
        ...openDialog,
        credits: values?.credits,
        timestamp: new Date().toString(),
        startDate: "",
        endDate: "",
        tableData: {},
        isAccepted: "accepted",
      });
      await database
        .ref(`FairRequests/${School?.uid}/${openDialog?.id}`)
        .remove();
      const notification = {
        title: "College Fair Approved ",
        description: `${openDialog?.displayName} fair is approved by  Univer Team`,
        read: false,
        timestamp: new Date().toString(),
      };
      sendNotification({
        notification: {
          title: "College Fair Approved",
          body: `${openDialog?.displayName} fair is approved by  Univer Team`,
        },
        FCMToken: School?.fcmToken,
      });
      sendMail({
        to: School?.email,
        subject: "College Fair Approved",
        html: `<p>Hey ${openDialog?.contactName}</p>
        <p>${openDialog?.displayName} fair is approved by Univer Team and you can now share link with students and keep track of participants list</p>
        <p>Please login to your account at collegefairs.ae to view the students registration link</p>
        <p>We wish you a successful & productive fair!</p>
        <p>Univer Team</p>
        `,
      });
      database.ref(`Notifications/${openDialog?._id}`).push(notification);
      snackBarOpen("Fair Request Accepted", "success");

      submitProps.resetForm();
      handleClose();
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
              <DialogTitle>Add Participation Credit</DialogTitle>
              {ParticipationCreditSchema?.map((inputItem) => (
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
                  startIcon={<Done />}
                >
                  Accept
                </LoadingButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default ParticipationCreditDialog;
