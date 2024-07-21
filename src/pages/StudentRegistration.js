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
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { StudentRegisterSchema } from "schemas";
import { LoginOutlined } from "@mui/icons-material";
import { TextInput } from "components/core";
import { LOGO } from "assets";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "contexts";
import { database } from "configs";
import { useNestedSchoolFairs, useStudents } from "hooks";
import moment from "moment";
import Swal from "sweetalert2";

const StudentRegistration = () => {
  const { snackBarOpen } = useAppContext();
  const { students } = useStudents();
  const { schoolFairs } = useNestedSchoolFairs();
  // console.log(schoolFairs);
  const params = useParams();
  const { sendMail } = useAppContext();
  const fairData =
    params?.schoolName === "admin"
      ? students?.find((student) => student?.id === params?.fairId)
      : schoolFairs?.find((student) => student?.id === params?.fairId);
  const startDate = new Date(
    new Date(fairData?.date).getFullYear(),
    new Date(fairData?.date).getMonth(),
    new Date(fairData?.date).getDate(),
    +fairData?.time?.split(":")[0],
    +fairData?.time?.split(":")[1]
  );
  const endDate = new Date(
    new Date(fairData?.date).getFullYear(),
    new Date(fairData?.date).getMonth(),
    new Date(fairData?.date).getDate(),
    +fairData?.endTime?.split(":")[0],
    +fairData?.endTime?.split(":")[1]
  );
  // console.log(fairData);
  const initialValues = StudentRegisterSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.initialValue;
      return accumulator;
    },
    {}
  );
  const validationSchema = StudentRegisterSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.validationSchema;
      return accumulator;
    },
    {}
  );
  const handleRegister = async (values, submitProps) => {
  
    try {
      if (params?.schoolName === "admin") {
        const studentID = new Date().getTime();
        await database
          .ref(`NewFairs/${params?.fairId}/students/${studentID}`)
          .set({
            ...values,
            timestamp: new Date().toString(),
          });
        const usersSnapshot = await database.ref("Users").once("value");
        usersSnapshot.forEach((userSnapshot) => {
          const user = userSnapshot.val();
          if (
            user?.upcomingFairs &&
            user?.upcomingFairs[params?.fairId] &&
            user?.uid !== params?.userId
          ) {
            database
              .ref(
                `Users/${user?.uid}/upcomingFairs/${params?.fairId}/students/${studentID}`
              )
              .set({
                ...values,
                timestamp: new Date().toString(),
                // Add any other relevant fields from 'values' that you want to store in the 'students' collection of 'upcomingFairs'
                // For example: field1: values.field1, field2: values.field2, ...
              });
          }
        });
        sendMail({
          to: values?.email,
          subject: `${params?.fairName} Registration ID`,
          html: `
              <p>Hey ${values?.name}</p>
        
             <p>Your registration id for fair ${params?.fairName} is ${studentID}</p>
             
             <p>We look forward to having you at the fair!if you have any questions, please contact your College/Career Counsellor</p>
            
             <p>Univer Team</p>
              `,
        });
        Swal.fire({
          text: `Your registration id for fair
          ${params?.fairName} is ${studentID}`,
          icon: "success",
        });
      } else {
        const studentID = new Date().getTime();
        await database
          .ref(
            `SchoolFairs/${params?.schoolId}/${params?.fairId}/students/${studentID}`
          )
          .set({
            ...values,
            timestamp: new Date().toString(),
          });
        const usersSnapshot = await database.ref("Users").once("value");
        usersSnapshot.forEach((userSnapshot) => {
          const user = userSnapshot.val();
          if (
            user?.upcomingFairs &&
            user?.upcomingFairs[params?.fairId] &&
            user?.uid !== params?.userId
          ) {
            database
              .ref(
                `Users/${user?.uid}/upcomingFairs/${params?.fairId}/students/${studentID}`
              )
              .set({
                ...values,
                timestamp: new Date().toString(),
                // Add any other relevant fields from 'values' that you want to store in the 'students' collection of 'upcomingFairs'
                // For example: field1: values.field1, field2: values.field2, ...
              });
          }
        });
        sendMail({
          to: values?.email,
          subject: `${params?.fairName} Registration ID`,
          html: `
            <p>Hey ${values?.name}</p>
      
          <p>Your registration id for fair ${params?.fairName} is ${studentID}</p>

          <p>We look forward to having you at the fair!if you have any questions, please contact your College/Career Counsellor</p>
          
          <p>Univer Team</p>
            `,
        });
        Swal.fire({
          text: `Your registration id for fair ${params?.fairName} is ${studentID}`,
          icon: "success",
        });
      }

      // snackBarOpen("Registered Successfully", "success");
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
          <div style={{ textAlign: "center", marginTop: "2vh" }}>
            <img src={LOGO} width="150" alt="" />
          </div>

          <CardHeader
            title={`${
              params?.schoolName === "admin" ? "" : params?.schoolName
            } Student Registration`}
            subheader={`Please Register Here For Fair ${
              params?.fairName ? params?.fairName : ""
            }`}
            titleTypographyProps={{
              gutterBottom: true,
              align: "center",
            }}
            subheaderTypographyProps={{
              gutterBottom: true,
              align: "center",
            }}
          />
          <Typography
            sx={{
              textAlign: "center",
            }}
          >
            Event Timing:-{" "}
            {`${moment(startDate).format("lll")} - ${moment(endDate).format(
              "lll"
            )}`}
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object(validationSchema)}
            onSubmit={handleRegister}
          >
            {(formik) => (
              <Form>
                <CardContent>
                  <Grid container spacing={2}>
                    {StudentRegisterSchema?.map((inputItem) => (
                      <Grid
                        item
                        key={inputItem.key}
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
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
                                    {inputItem?.options?.map((option) => (
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
                                          option?.label
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

export default StudentRegistration;
