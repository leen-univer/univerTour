import {
  Container,
  Drawer,
  Grid,
  TextField,
  Typography,
  FormHelperText,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import firebase from "firebase/app";
import "firebase/auth";
import { Fragment } from "react";
import { RegisterSchema } from "schemas";
import { Done } from "@mui/icons-material";

import { useAppContext } from "contexts";
import { LoadingButton } from "@mui/lab";
import { BASE_URL } from "configs/api";
import { database } from "configs";
import Swal from "sweetalert2";

const AddUniversityDrawer = ({ open, setOpenAddUniversityDrawer }) => {
  const { snackBarOpen } = useAppContext();
  const drawerData = open;

  const initialValues = RegisterSchema?.reduce((accumulator, currentValue) => {
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

  const handleSubmit = async (values, submitProps) => {
    console.log(values);
    try {
      const { email, password, ...rest } = values;
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const uid = user.uid;

      const formData = {
        ...values,
        timestamp: new Date().toString(),
      };
      console.log(formData);

      await firebase.database().ref(`Users/${uid}`).set(formData);

      Swal.fire({
        title: "University / School Added Successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      submitProps.resetForm();
    } catch (error) {
      console.log(error);
      submitProps.setSubmitting(false);

      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpenAddUniversityDrawer(false)}
      >
        <Container
          style={{
            width: "40vw",
            marginTop: "12vh",
          }}
        >
          <Typography
            align="center"
            color="text.primary"
            variant="h5"
            style={{
              marginBottom: "2vh",
            }}
          >
            Add New University / School
          </Typography>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={Yup.object(validationSchema)}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form>
                <Grid container spacing={0.5} justifyContent="center">
                  {RegisterSchema?.map((inputItem) => (
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
                          ? 12
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
                            />
                          );
                        }}
                      </Field>
                    </Grid>
                  ))}
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

export default AddUniversityDrawer;
