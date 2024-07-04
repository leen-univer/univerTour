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

import { Fragment } from "react";
import { RegisterSchema } from "schemas";
import { Done } from "@mui/icons-material";

import { useAppContext } from "contexts";
import { LoadingButton } from "@mui/lab";
import { BASE_URL } from "configs/api";

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
  const handleSend = async (values, submitProps) => {
    try {
      const respond = await fetch(BASE_URL + "/post-api", {
        method: "POST",
        body: JSON.stringify({ ...values }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await respond.json();
      // console.log(res);
      // console.log(values);
      if (respond.status === 200) {
        snackBarOpen("University Data added Successfully", "success");
      } else {
        snackBarOpen(res?.error?.message, "error");
      }
      submitProps.resetForm();
    } catch (error) {
      snackBarOpen(error.message, "error");
      console.log(error);
    } finally {
      submitProps.setSubmitting(false);
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
            Add New University
          </Typography>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={Yup.object(validationSchema)}
            onSubmit={handleSend}
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
