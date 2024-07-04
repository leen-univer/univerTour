import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  Button,
  CardContent,
  CardHeader,
  Grid,
  Card,
  Container,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { RegisterSchema } from "schemas";
import { LoginOutlined } from "@mui/icons-material";
import { TextInput } from "components/core";
import { LOGO } from "assets";
import { database } from "configs";
import { useAppContext } from "contexts";
import { Link, useNavigate } from "react-router-dom";
import { useUniversities } from "hooks";
import Swal from "sweetalert2";

const UniversityRegister = () => {
  const navigate = useNavigate();

  const { universities } = useUniversities();
  const SUPERADMIN = universities?.filter(
    (university) => university?.role === "superadmin"
  )[0];

  const { sendNotification, sendMail } = useAppContext();

  const { snackBarOpen } = useAppContext();
  const initialValues = RegisterSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.initialValue;
    return accumulator;
  }, {});
  const validationSchema = RegisterSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.validationSchema;
      return accumulator;
    },
    {}
  );
  const handleRegister = async (values, submitProps) => {
    try {
      // Check if email already exists in the Users collection
      const emailExists = await database
        .ref("Users")
        .orderByChild("email")
        .equalTo(values.email)
        .once("value");
      if (emailExists.exists()) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Email already exists!",
        });
        return;
      }
      await database.ref(`RequestedUniversities/`).push({
        ...values,
        role: values?.role,
        isAccepted: "pending",
        timestamp: new Date().toString(),
      });

      const notification = {
        title: "New University",
        description: `New university has been registered`,
        read: false,
        timestamp: new Date().toString(),
      };

      sendNotification({
        notification: {
          title: `New University`,
          body: `New University has been registered`,
        },
        FCMToken: SUPERADMIN?.fcmToken,
      });
      sendMail({
        to: SUPERADMIN?.email,
        subject: "New University",
        html: `New University has been registered`,
      });
      database.ref(`Notifications/${SUPERADMIN?.uid}`).push(notification);
      snackBarOpen("Your Request Sent", "success");
      navigate("/");
      submitProps.resetForm();
    } catch (error) {
      console.log(error);
      snackBarOpen(error.message, "error");
      submitProps.setSubmitting(false);
    }
  };
  return (
    <div className="auth-page">
      <Container
        maxWidth="md"
        className="place-content-center place-items-center"
      >
        <Card sx={{ marginTop: "2vh" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center", // Center both horizontally and vertically
              marginTop: "2vh",
            }}
          >
            <img src={LOGO} width="150" alt="" />
          </div>
          <CardHeader
            title="Sign Up "
            subheader="Please Register Here"
            titleTypographyProps={{
              gutterBottom: true,
              align: "center",
            }}
            subheaderTypographyProps={{
              gutterBottom: true,
              align: "center",
            }}
          />
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object(validationSchema)}
            onSubmit={handleRegister}
          >
            {(formik) => (
              <Form>
                <CardContent>
                  <Grid container spacing={2}>
                    {RegisterSchema.map((inputItem) => (
                      <Grid
                        item
                        key={inputItem.key}
                        xs={12}
                        sm={12}
                        md={
                          inputItem?.name === "country"
                            ? 12
                            : inputItem?.name === "website"
                            ? 12
                            : 6
                        }
                        lg={
                          inputItem?.name === "country"
                            ? 6
                            : inputItem?.name === "website"
                            ? 12
                            : 6
                        }
                      >
                        <Field name={inputItem.name} key={inputItem.key}>
                          {(props) => {
                            if (inputItem.type === "select") {
                              return (
                                <FormControl
                                  sx={{
                                    marginTop: 2,
                                  }}
                                  required
                                  fullWidth
                                  margin="none"
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
                                      <MenuItem
                                        value={option.value}
                                        key={option.key}
                                      >
                                        {option?.phone && (
                                          <img
                                            loading="lazy"
                                            width="20"
                                            src={`https://flagcdn.com/w20/${option.key.toLowerCase()}.png`}
                                            srcSet={`https://flagcdn.com/w40/${option.key.toLowerCase()}.png 2x`}
                                            alt=""
                                            style={{ margin: "0 1vw" }}
                                          />
                                        )}

                                        {option?.phone ? (
                                          <>{`${option.value} (${option.key}) `}</>
                                        ) : (
                                          option.value
                                        )}
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
                              <TextInput
                                key={inputItem.key}
                                name={inputItem?.name}
                                label={inputItem?.label}
                                type={inputItem?.type}
                                startIcon={inputItem?.startIcon}
                              />
                            );
                          }}
                        </Field>
                      </Grid>
                    ))}
                  </Grid>
                  <div style={{ textAlign: "right" }}>
                    <Button sx={{ color: "#662992" }} component={Link} to="/">
                      Back to Home
                    </Button>
                  </div>
                  <div className="place-content-center">
                    <LoadingButton
                      className="mt-1vh gradient"
                      variant="contained"
                      sx={{ color: "snow", textTransform: "none" }}
                      type="submit"
                      disabled={formik.isSubmitting || !formik.isValid}
                      loading={formik.isSubmitting}
                      loadingPosition="start"
                      startIcon={<LoginOutlined />}
                      fullWidth
                    >
                      Let's do it!
                    </LoadingButton>
                  </div>
                </CardContent>
              </Form>
            )}
          </Formik>
          <></>
        </Card>
      </Container>
    </div>
  );
};

export default UniversityRegister;
