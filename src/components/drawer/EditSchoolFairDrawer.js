import { Done } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Checkbox,
  Container,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { database } from "configs";
import { useAppContext } from "contexts";
import { Field, Form, Formik } from "formik";
import { useUniversities } from "hooks";
import moment from "moment";
import { useEffect, useState } from "react";
import { AddSchoolFairSchema } from "schemas";
import * as Yup from "yup";

const Edit = ({ open, setOpenEditStudentDrawer }) => {
  const { snackBarOpen } = useAppContext();
  const { sendNotification, sendMail } = useAppContext();
  const { user } = useAppContext();
  const drawerData = open;
  // console.log(drawerData);
  // console.log(open);
  const [bookedValue, setBookedValue] = useState(false);
  const { universities } = useUniversities();
  const Universities = universities.filter(
    (university) => university?.role === "university"
  );

  // console.log(Universities);
  const initialValues = AddSchoolFairSchema?.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.initialValue;
      return accumulator;
    },
    {}
  );
  const validationSchema = AddSchoolFairSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.validationSchema;
      return accumulator;
    },
    {}
  );

  const handleSend = async (values, submitProps) => {
    // console.log(values);
    try {
      if (user?.role === "school") {
        await database.ref(`SchoolFairs/${user?.uid}/${open?.id}`).update({
          displayName: values?.displayName,
          city: values?.city,
          schoolName: values?.schoolName,
          date: values?.date,
          time: values?.time,
          endTime: values?.endTime,
          credits: values?.credits,
          link: values?.link,
          notes: "t",
          MajorLin:"urlMajor",
          studentCount: values?.studentCount,
          isBooked: values?.isBooked || "",
        });
        const startDate = new Date(
          new Date(drawerData?.date).getFullYear(),
          new Date(drawerData?.date).getMonth(),
          new Date(drawerData?.date).getDate(),
          +drawerData?.time?.split(":")[0],
          +drawerData?.time?.split(":")[1]
        );
        const endDate = new Date(
          new Date(drawerData?.date).getFullYear(),
          new Date(drawerData?.date).getMonth(),
          new Date(drawerData?.date).getDate(),
          +drawerData?.endTime?.split(":")[0],
          +drawerData?.endTime?.split(":")[1]
        );
        const newStartDate = new Date(
          new Date(values?.date).getFullYear(),
          new Date(values?.date).getMonth(),
          new Date(values?.date).getDate(),
          +values?.time?.split(":")[0],
          +values?.time?.split(":")[1]
        );
        const newEndDate = new Date(
          new Date(values?.date).getFullYear(),
          new Date(values?.date).getMonth(),
          new Date(values?.date).getDate(),
          +values?.endTime?.split(":")[0],
          +values?.endTime?.split(":")[1]
        );
        const notification = {
          title: "Fair Updated",
          description: `Fair ${values.displayName} Updated By SuperAdmin`,
          read: false,
          timestamp: new Date().toString(),
        };
        Universities?.forEach(async (item) => {
          return (
            sendNotification({
              notification: {
                title: "Fair Updated",
                body: `Fair ${values.displayName} Updated By SuperAdmin`,
              },
              FCMToken: item?.fcmToken,
            }),
            sendMail({
              to: item?.email,
              subject: "Please Read! We Have An Important Update",
              html: `
                                              <p>
                                               We have got an important update on the below college fair<br/>
                                              <br/>
                                              Fair Name: <strong>${values.displayName
                }</strong> <br/>										
                                              <br/>  
                            Fair Date: <strong>${values?.date !== drawerData?.date
                  ? `Changed from ${drawerData?.date} to ${values.date}`
                  : `${drawerData?.date}`
                }</strong> <br/>	
                          <br/>  
                            Fair Start Time: <strong>${values?.time !== drawerData?.time
                  ? `Changed from ${moment(startDate).format(
                    "hh:mm a"
                  )} to ${moment(newStartDate).format(
                    "hh:mm a"
                  )}`
                  : `${moment(startDate).format("hh:mm a")}`
                }</strong> <br/>		
                          <br/>  
                            Fair End Time: <strong>${values?.endTime !== drawerData?.endTime
                  ? `Changed from ${moment(endDate).format(
                    "hh:mm a"
                  )} to ${moment(newEndDate).format("hh:mm a")}`
                  : `${moment(endDate).format("hh:mm a")}`
                }</strong> <br/>								
                                              <br/>               
                                              Please login to your account on collegefairs.ae to view the changes.<br/> 
                                              <br/>
                                              Univer Team
                                              </p>
                                              `,
            }),
            database.ref(`Notifications/${item?.uid}`).push(notification)
          );
        });
      } else {
        await database.ref(`NewFairs/${open?.id}`).update({
          displayName: values?.displayName,
          city: values?.city,
          schoolName: values?.schoolName,
          date: values?.date,
          time: values?.time,
          endTime: values?.endTime,
          credits: values?.credits,
          link: values?.link,
          notes: "hh",
          MajorLin:"urlMajor",
          studentCount: values?.studentCount,
          isBooked: values?.isBooked || "",
        });
        // console.log(values);
        const startDate = new Date(
          new Date(drawerData?.date).getFullYear(),
          new Date(drawerData?.date).getMonth(),
          new Date(drawerData?.date).getDate(),
          +drawerData?.time?.split(":")[0],
          +drawerData?.time?.split(":")[1]
        );
        const endDate = new Date(
          new Date(drawerData?.date).getFullYear(),
          new Date(drawerData?.date).getMonth(),
          new Date(drawerData?.date).getDate(),
          +drawerData?.endTime?.split(":")[0],
          +drawerData?.endTime?.split(":")[1]
        );
        const newStartDate = new Date(
          new Date(values?.date).getFullYear(),
          new Date(values?.date).getMonth(),
          new Date(values?.date).getDate(),
          +values?.time?.split(":")[0],
          +values?.time?.split(":")[1]
        );
        const newEndDate = new Date(
          new Date(values?.date).getFullYear(),
          new Date(values?.date).getMonth(),
          new Date(values?.date).getDate(),
          +values?.endTime?.split(":")[0],
          +values?.endTime?.split(":")[1]
        );
        const notification = {
          title: "Fair Updated",
          description: `Fair ${values.displayName} Updated By SuperAdmin`,
          read: false,
          timestamp: new Date().toString(),
        };
        Universities?.forEach(async (item) => {
          return (
            sendNotification({
              notification: {
                title: "Fair Updated",
                body: `Fair ${values.displayName} Updated By SuperAdmin`,
              },
              FCMToken: item?.fcmToken,
            }),
            sendMail({
              to: item?.email,
              subject: "Please Read! We Have An Important Update",
              html: `
                                              <p>
                                               We have got an important update on the below college fair<br/>
                                              <br/>
                                              Fair Name: <strong>${values.displayName
                }</strong> <br/>										
                                              <br/>  
                            Fair Date: <strong>${values?.date !== drawerData?.date
                  ? `Changed from ${drawerData?.date} to ${values.date}`
                  : `${drawerData?.date}`
                }</strong> <br/>	
                          <br/>  
                            Fair Start Time: <strong>${values?.time !== drawerData?.time
                  ? `Changed from ${moment(startDate).format(
                    "hh:mm a"
                  )} to ${moment(newStartDate).format(
                    "hh:mm a"
                  )}`
                  : `${moment(startDate).format("hh:mm a")}`
                }</strong> <br/>		
                          <br/>  
                            Fair End Time: <strong>${values?.endTime !== drawerData?.endTime
                  ? `Changed from ${moment(endDate).format(
                    "hh:mm a"
                  )} to ${moment(newEndDate).format("hh:mm a")}`
                  : `${moment(endDate).format("hh:mm a")}`
                }</strong> <br/>								
                                              <br/>               
                                              Please login to your account on collegefairs.ae to view the changes.<br/> 
                                              <br/>
                                              Univer Team
                                              </p>
                                              `,
            }),
            database.ref(`Notifications/${item?.uid}`).push(notification)
          );
        });
      }

      setOpenEditStudentDrawer(false);
      snackBarOpen(
        `Fair ${values.displayName} updated Successfully`,
        "success"
      );
    } catch (error) {
      snackBarOpen(error.message, "error");
      console.log(error);
    } finally {
      submitProps.setSubmitting(false);
    }
  };
  useEffect(() => {
    if (open?.id) {
      setBookedValue(open?.isBooked);
    }
    return () => { };
  }, [open]);

  // console.log(bookedValue);
  // console.log(open?.isBooked);
  // const startDate = new Date(
  //   new Date(drawerData?.date).getFullYear(),
  //   new Date(drawerData?.date).getMonth(),
  //   new Date(drawerData?.date).getDate(),
  //   +drawerData?.time?.split(":")[0],
  //   +drawerData?.time?.split(":")[1]
  // );

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpenEditStudentDrawer(false)}
      >
        <Container
          style={{
            width: "40vw",
            marginTop: "12vh",
          }}
        >
          <Typography align="center" color="text.primary" variant="h5">
            Update Fair
          </Typography>

          <Formik
            enableReinitialize
            initialValues={
              drawerData?.displayName
                ? {
                  displayName: drawerData?.displayName,
                  city: drawerData?.city,
                  schoolName: drawerData?.schoolName,
                  date: drawerData?.date,
                  time: drawerData?.time,
                  endTime: drawerData?.endTime,
                  credits: drawerData?.credits,
                  link: drawerData?.link,
                  notes: drawerData?.notes,
                  studentCount: drawerData?.studentCount,
                  isBooked: drawerData?.isBooked,
                }
                : initialValues
            }
            validationSchema={Yup.object(validationSchema)}
            onSubmit={handleSend}
          >
            {(formik) => (
              <Form>
                <Grid container spacing={0.5} justifyContent="center">
                  {AddSchoolFairSchema?.map((inputItem) => (
                    <Grid
                      item
                      key={inputItem.key}
                      xs={12}
                      sm={12}
                      md={inputItem?.name === "univerNotes" ? 12 : 6}
                      lg={inputItem?.name === "univerNotes" ? 12 : 6}
                    >
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
                                        <>{`${option.value} (${option.key}) +${option.phone} `}</>
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
                                helperText={
                                  props.meta.touched && props.meta.error
                                }
                                {...props.field}
                                InputLabelProps={{ shrink: true }}
                              />
                            </div>
                          );
                        }}
                      </Field>
                    </Grid>
                  ))}
                  <Grid item lg={6} md={6}>
                    <FormControlLabel
                      sx={{ m: 2 }}
                      control={
                        <Checkbox
                          name="isBooked"
                          checked={bookedValue}
                          onChange={(e) => {
                            setBookedValue(open?.isBooked ? false : true);
                            formik?.setFieldValue(
                              "isBooked",
                              open?.isBooked ? false : true
                            );
                          }}
                        />
                      }
                      label="Fully Booked"
                    />
                  </Grid>
                </Grid>
                <div>
                  <div style={{ marginTop: "4px", marginBottom: "2vh" }}>
                    <LoadingButton
                      className="mt-1vh gradient"
                      variant="contained"
                      sx={{ color: "snow" }}
                      type="submit"
                      fullWidth
                      disabled={formik.isSubmitting || !formik.isValid}
                      loading={formik.isSubmitting}
                      loadingPosition="start"
                      startIcon={<Done sx={{ color: "snow" }} />}
                    >
                      Save
                    </LoadingButton>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Container>
      </Drawer>
    </>
  );
};

export default Edit;
