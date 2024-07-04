import * as React from "react";
import { Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Send } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { ContactUsSchema } from "schemas";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { database } from "configs";
import { useAppContext } from "contexts";
import { CONTACTIMG } from "assets";
import { useUniversities } from "hooks";

const ContactUs = () => {
  const { snackBarOpen } = useAppContext();

  const { universities } = useUniversities();

  const SUPERADMIN = universities?.filter(
    (university) => university?.role === "superadmin"
  )[0];

  // const { students } = useStudents();
  const { sendNotification, sendMail } = useAppContext();

  const initialValues = ContactUsSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.initialValue;
    return accumulator;
  }, {});
  const validationSchema = ContactUsSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.validationSchema;
      return accumulator;
    },
    {}
  );
  const handleSendReply = async (values, submitProps) => {
    try {
      database.ref(`Contacts`).push({
        ...values,
        timestamp: new Date().toString(),
      });

      const notification = {
        title: "Enquiry Message",
        description: `Enquiry message received`,
        read: false,
        timestamp: new Date().toString(),
      };

      sendNotification({
        notification: {
          title: `Enquiry Message`,
          body: `Enquiry message received`,
        },
        FCMToken: SUPERADMIN?.fcmToken,
      });
      sendMail({
        to: SUPERADMIN?.email,
        subject: "Enquiry message",
        html: `Enquiry message received`,
      });
      database.ref(`Notifications/${SUPERADMIN?.uid}`).push(notification);

      snackBarOpen("Your Message Sent", "success");
      submitProps.resetForm();
    } catch (error) {
      console.log(error);
      submitProps.setSubmitting(false);
    }
  };
  // const [listItems, setListItems] = React.useState("React");

  // const handleChangeItems = (event) => {
  //   setListItems(event.target.value);
  // };

  return (
    <Container id="ContactUs">
      <div className="contactDiv">
        <div className="pointingRightImage">
          <img src={CONTACTIMG} alt="Pointing Right" height={"583px"} />
        </div>
        <div className="formDiv change_new_clr">
          <h1 className="login-title">Contact Us !</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object(validationSchema)}
            onSubmit={handleSendReply}
          >
            <Form>
              {ContactUsSchema.map((inputItem) => (
                <Field name={inputItem.name} key={inputItem.key}>
                  {(props) => {
                    return (
                      <>
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
                        />
                      </>
                    );
                  }}
                </Field>
              ))}

              <LoadingButton
                className="mt-1vh gradient "
                variant="contained"
                type="submit"
                sx={{ color: "snow" }}
                // disabled={isSubmitting || !isValid}
                // loading={isSubmitting}
                loadingPosition="start"
                startIcon={<Send />}
                fullWidth
              >
                Send Message
              </LoadingButton>
            </Form>
          </Formik>
        </div>
      </div>
    </Container>
  );
};

export default ContactUs;
<form action="" className="form">
  <div className="nameDiv change_new_clr">
    <TextField
      type="text"
      placeholder="Enter Your University Name"
      id="outlined-basic"
      variant="outlined"
      className="form-name outLine padding-left-zero"
      InputProps={{
        classes: {
          root: "border-10 bg-white",
          notchedOutline: "outLine",
          input: "form-textfield",
        },
      }}
    />
  </div>
</form>;
