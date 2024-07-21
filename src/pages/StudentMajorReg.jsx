import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
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
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import StudentMajorRegSchema from 'schemas/StudentMajorRegSchema';
import { LoginOutlined } from '@mui/icons-material';
import { TextInput } from 'components/core';
import { LOGO } from 'assets';
import { Link, useParams } from 'react-router-dom';
import { useAppContext } from 'contexts';
import { database } from 'configs';

const StudentMajorReg = () => {
  const { snackBarOpen } = useAppContext();
  const { displayName, city, country, fairId, fairName } = useParams(); // Extracting parameters from URL
  const [students, setStudents] = useState([]); // State for managing fetched data

  const initialValues = StudentMajorRegSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.initialValue;
    return accumulator;
  }, {});

  const validationSchema = StudentMajorRegSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.validationSchema;
    return accumulator;
  }, {});

  const handleMajorRegister = async (values, submitProps) => {
    try {
      const studentID = new Date().getTime();
      const formName = 'studentMajorForm'; 

      // Removing name and email from the values to be stored
      const { name, email, ...valuesToStore } = values;

      // Encode city and country before storing
      const encodedCity = btoa(city);
      const encodedCountry = btoa(country);

      // Include displayName, encoded city, and encoded country in the stored data
      const dataToStore = { ...valuesToStore, displayName, city: encodedCity, country: encodedCountry, formName, studentID };

      // Check for undefined values
      if (!displayName || !city || !country) {
        throw new Error('Some required URL parameters are missing');
      }

      // Store data in Firebase Realtime Database
      await database.ref(`/NewFairs/${fairId}/forms/${formName}/students/${studentID}`).set(dataToStore);
      console.log("Data stored successfully:", dataToStore); 

      Swal.fire({
        text: `Your registration id is ${studentID}`,
        icon: 'success',
      });

      submitProps.resetForm();
      fetchStudentsData(); 

    } catch (error) {
      console.error(error);
      snackBarOpen(error.message, 'error');
      submitProps.setSubmitting(false);
    }
  };

  const fetchStudentsData = async () => {
    try {
      const snapshot = await database.ref(`/NewFairs/${fairId}/forms/studentMajorForm/students`).once("value");
      const data = snapshot.val();
      console.log("Fetched Data:", data); 
      if (data) {
        const studentsList = Object.values(data).map(student => ({
          ...student,
          city: student.city ? atob(student.city) : '',
          country: student.country ? atob(student.country) : '',
        }));
        setStudents(studentsList);
      }
    } catch (error) {
      console.error("Error fetching students data:", error);
    }
  };

  useEffect(() => {
    if (fairId) { 
      fetchStudentsData();
    }
  }, [fairId]);

  return (
    <div className="auth-page">
      <Container maxWidth="md" className="place-content-center place-items-center">
        <Card sx={{ marginTop: '2vh' }}>
          <div style={{ textAlign: 'center', marginTop: '2vh' }}>
            <img src={LOGO} width="150" alt="" />
          </div>
         
          <CardHeader
            title={`The Student Pulse`}
            titleTypographyProps={{
              align: 'center',
            }}
            subheaderTypographyProps={{
              align: 'center',
            }}
          />
          <CardHeader
            subheader={`Please Register Here For ${displayName ? displayName : ""}`}
            titleTypographyProps={{
              align: "center",
              style: { marginBottom: 0 }
            }}
            subheaderTypographyProps={{
              align: "center",
            }}
          />

          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object(validationSchema)}
            onSubmit={handleMajorRegister}
          >
            {(formik) => (
              <Form>
                <CardContent>
                  <Grid container spacing={2}>
                    {StudentMajorRegSchema?.map((inputItem) => (
                      <Grid item key={inputItem.key} xs={12} sm={12} md={12} lg={12}>
                        <Field name={inputItem.name} key={inputItem.key}>
                          {(props) => {
                            if (inputItem.type === 'select') {
                              return (
                                <FormControl
                                  sx={{ marginTop: 2 }}
                                  required
                                  fullWidth
                                  margin="none"
                                  error={Boolean(props.meta.touched && props.meta.error)}
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
                                      <MenuItem value={option.value} key={option.key}>
                                        {option?.phone && (
                                          <img
                                            loading="lazy"
                                            width="20"
                                            src={`https://flagcdn.com/w20/${option.key.toLowerCase()}.png`}
                                            srcSet={`https://flagcdn.com/w40/${option.key.toLowerCase()}.png 2x`}
                                            alt=""
                                            style={{ margin: '0 1vw' }}
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
                                  <FormHelperText>{props.meta.touched && props.meta.error}</FormHelperText>
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
                  <div style={{ textAlign: 'right' }}>
                    <Button sx={{ color: '#662992' }} component={Link} to="/">
                      Back to Home
                    </Button>
                  </div>
                  <div className="place-content-center">
                    <LoadingButton
                      className="mt-1vh gradient"
                      variant="contained"
                      sx={{ color: 'snow', textTransform: 'none' }}
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

        </Card>
      </Container>
    </div>
  );
};

export default StudentMajorReg;
