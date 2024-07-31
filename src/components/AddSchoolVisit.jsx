import { useEffect } from "react";

import { getArrFromObj } from "@ashirbad/js-core";
import { Check, Person } from "@mui/icons-material";
import { Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import { auth, database, storage } from "configs";
import { useAppContext } from "contexts";
import { useFormik } from "formik";
import { useFetch } from "hooks";
import moment from "moment";
import * as Yup from "yup";
import { number } from "yup";
import { PhotoUpload } from "./core";
import { useState } from 'react'; 



const url_regex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const AddSchoolVisit = ({ open, setOpenDrawer }) => {
  console.log(open?.id);
  const { user, snackBarOpen } = useAppContext();
  const [countries] = useFetch(`/Countries`, {
    needArray: true,
  });

  useEffect(() => {
    const fetchEventNames = async () => {
      const usersRef = database.ref('/Users');
      usersRef.once('value', (snapshot) => {
        const users = snapshot.val();
        if (users) {
          const eventNamesData = Object.values(users).map(user => ({
            displayName: user.displayName,
            role: user.role,
          }));
          setEventNames(eventNamesData);
        }
      });
    };
    fetchEventNames();
  }, []);

  const [eventNames, setEventNames] = useState([]);

  const [cities, setCities] = useState([]);
  const [image, setImage] = useState(open?.imageURL);
  const handleCountryChange = (selectedCountry) => {
    // Here, you would fetch cities based on the selectedCountry from the API (similar to useFetch)
    // For demonstration purposes, let's assume cities are fetched based on the selected country
    const citiesForSelectedCountry = getArrFromObj(
      countries?.filter((country) => country?.id === selectedCountry)?.[0]
        ?.cities
    );
    // console.log(citiesForSelectedCountry);
    setCities(citiesForSelectedCountry);
  };

  const addFairSchema = [
    {
      key: "2xs",
      label: "Image",
      name: "image",
      initialValue: "",
      // validationSchema: Yup.string().required("Image is Required"),
    },
    {
      key: "2",
      label: "Event Name",
      name: "displayName",
      placeholder: user?.role === "school" ? "Usually your school name" : "",
      validationSchema: Yup.string()
        .required("Name is Required")
        .min(3, "Name must be at least 3 characters")
        .max(250, "Name must be less than 250 characters"),
      initialValue: "",
      startIcon: <Person />,
    },
    {
      key: "1",
      label: "Country",
      name: "country",
      validationSchema: Yup.string().required("Country is Required"),
      initialValue: "",
      type: "select",
    },
    {
      key: "7",
      label: "City",
      name: "city",
      validationSchema: Yup.string().required("City Name Is Required"),
      initialValue: "",
      type: "select",
      startIcon: <Person />,
    },

    {
      key: "6",
      label: "School System",
      name: "schoolName",
      validationSchema: Yup.string()
        .required("School Name is Required")
        .min(3, "School Name must be at least 3 characters")
        .max(50, "School Name must be less than 150 characters"),
      initialValue: "",
      startIcon: <Person />,
    },

    {
      key: "5",
      label: "Date",
      name: "date",
      type: "date",
      validationSchema: Yup.date()
        .nullable()
        .required("Start Date is required"),
      // .min(new Date(), "Start Date must be later than today"),
      min: new Date().toISOString().split("T")[0],
      initialValue: "",
      startIcon: <Person />,
    },

    {
      key: "8",
      label: "Start Time",
      name: "time",
      type: "time",
      validationSchema: Yup.string().required("Start Time is Required"),
      initialValue: "",
      startIcon: <Person />,
    },
    {
      key: "8.1",
      label: "End Time",
      name: "endTime",
      type: "time",
      validationSchema: Yup.string().required("End Time is Required"),
      initialValue: "",
      startIcon: <Person />,
    },
    // {
    //   key: "11",
    //   label: "Participation Credits",
    //   name: "credits",
    //   type: "number",
    //   validationSchema: Yup.string().required("Time is Required"),
    //   initialValue: "",
    //   startIcon: <Person />,
    // },
    {
      key: "15",
      label: "Number Of Students",
      name: "studentCount",
      type: number,
      validationSchema: Yup.number().required("This field is required"),
      initialValue: "",
      startIcon: <Person />,
    },
    {
      key: "10",
      label: "Location Link",
      name: "link",
      type: "url",
      validationSchema: Yup.string()
        .matches(url_regex, "URL is not valid")
        .required("Location Link Is Required"),
      initialValue: "",
      startIcon: <Person />,
    },

    {
      key: "9",
      label: "Notes",
      name: "notes",
      validationSchema: Yup.string()
        .required("Notes is Required")
        .min(3, "Univer Notes must be at least 3 characters")
        .max(250, "Univer Notes must be less than 250 characters"),
      initialValue: "",
      multiline: true,
      rows: 1,
      type: "text",
      startIcon: <Person />,
    },
  ];
  const initialValues = addFairSchema.reduce((acc, schemaItem) => {
    acc[schemaItem.name] = schemaItem.initialValue;
    return acc;
  }, {});

  const validationSchema = addFairSchema.reduce((acc, schemaItem) => {
    acc[schemaItem.name] = schemaItem.validationSchema;
    return acc;
  }, {});
  const checkUpdateAvailability = () => {
    // const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    // const currentTime = new Date().getTime();
    // const eventTime = new Date(formik.values.date).getTime(); // Use the correct field for event date
    const eventStartTime = new Date(
      moment(`${formik.values.date} ${formik.values.time}`).toDate()
    );

    // Calculate the time difference between current time and event start time
    // const timeDifference = eventStartTime.getTime() - currentTime;

    // if (open?.id && timeDifference < twentyFourHours) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Update Not Allowed",
    //     text: "You can't update the event within 24 hours of its start time.",
    //     timer: 5000, // Display the message for 5 seconds
    //   });
    //   return false;
    // }
    return true;
  };

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      ...open,
      city: open?.city,
      image: open?.imageURL,
    },
    enableReinitialize: true,
    validationSchema: Yup.object(validationSchema),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // if (!checkUpdateAvailability()) {
      //   setOpenDrawer(false);
      //   setSubmitting(false);
      //   return;
      // }
      const timestamp = new Date();
      const schoolId = timestamp.getTime();
      const schoolRegLink = `${window?.location?.origin}/${user?.displayName}/${values?.displayName}/${user?.uid}/${schoolId}`;
      const fairId = open?.id ? open?.id : new Date().getTime();

      try {
        if (values.image) {
          const imageFile = values.image;
          const imageFileName = `fair_${fairId}_${imageFile.name}`;
          console.log(imageFileName);
          if (open?.imageURL !== values.image) {
            // Upload the image to Firebase Storage
            const storageRef = storage
              .ref()
              .child(
                open?.id && open?.imageRef
                  ? `fairs/${open?.imageRef}`
                  : `fairs/${imageFileName}`
              );
            await storageRef.put(imageFile);

            // Get the download URL of the uploaded image
            const downloadURL = await storageRef.getDownloadURL();

            // Save the image download URL in the form values
            values.imageURL = downloadURL;
          }
          // Save the form values to the Realtime Database

          if (open?.id) {
            console.log("zzz");

            await database
              .ref(
                user?.role === "school"
                  ? `SchoolFairs/${user?.uid}/${open?.id}`
                  : `NewFairs/${open?.id}`
              )
              .update({
                ...values,
                fairType: "SCHOOL VISIT",
                imageRef:
                  open?.id && open?.imageRef ? open?.imageRef : imageFileName,
                country: values?.country,
                cityName: cities?.find((city) => city?.id === values?.city)
                  .cityName,
                countryName: countries?.find(
                  (country) => country?.id === values?.country
                ).countryName,
                createdBy: user?.role,
                timestamp: new Date().toString(),
                createdSchoolName: user?.displayName,
                creatorId: auth?.currentUser?.uid,
                regLink:
                  user?.role === "school"
                    ? schoolRegLink
                    : `${window?.location?.origin}/admin/${values?.displayName}/${user?.uid}/${fairId}`,
                    fairId: open?.id ? open?.id : new Date().getTime(),
              });
          } else {
            console.log("eee");

            await database
              .ref(
                user?.role === "school"
                  ? `FairRequests/${user?.uid}/${schoolId}`
                  : `NewFairs/${fairId}`
              )
              .set({
                ...values,
                fairType: "SCHOOL VISIT",
                imageRef: imageFileName,
                country: values?.country,
                cityName: cities?.find((city) => city?.id === values?.city)
                  .cityName,
                countryName: countries?.find(
                  (country) => country?.id === values?.country
                ).countryName,
                createdBy: user?.role,
                timestamp: new Date().toString(),
                createdSchoolName: user?.displayName,
                creatorId: auth?.currentUser?.uid,
                regLink:
                  user?.role === "school"
                    ? schoolRegLink
                    : `${window?.location?.origin}/admin/${values?.displayName}/${user?.uid}/${fairId}`,
                    fairId: open?.id ? open?.id : new Date().getTime(),

              });
          }
        } else {
        

          if (open?.id) {  
  
            await database
              .ref(
                user?.role === "school"
                  ? `SchoolFairs/${user?.uid}/${open?.id}`
                  : `NewFairs/${open?.id}`
              )
              .update({
                ...values,
                fairType: "SCHOOL VISIT",
                image: "",
                tableData: {},
                country: values?.country,
                cityName: cities?.find((city) => city?.id === values?.city)
                  .cityName,
                countryName: countries?.find(
                  (country) => country?.id === values?.country
                ).countryName,
                createdBy: user?.role,
                timestamp: new Date().toString(),
                createdSchoolName: user?.displayName,
                creatorId: auth?.currentUser?.uid,
                regLink:
                  user?.role === "school"
                    ? schoolRegLink
                    : `https://univertours.com/admin/${values?.displayName}/${user?.uid}/${fairId}`,
                    fairId: open?.id ? open?.id : new Date().getTime(),
                    MajorUrl: `https://univertours.com/StudentMajorReg/${values.displayName}/${fairId}/${values.cityName}/${values.countryName}`,

              });
          } else {
            await database
              .ref(
                user?.role === "school"
                  ? `FairRequests/${user?.uid}/${schoolId}`
                  : `NewFairs/${fairId}`
              )
              .set({
                ...values,
                image: "",
                fairType: "SCHOOL VISIT",
                country: values?.country,
                cityName: cities?.find((city) => city?.id === values?.city)?.cityName || "",
                countryName: countries?.find(
                  (country) => country?.id === values?.country
                )?.countryName || "",
                createdBy: user?.role || "",
                timestamp: new Date().toString(),
                createdSchoolName: user?.displayName || "",
                creatorId: auth?.currentUser?.uid || "",
                regLink:
                  user?.role === "school"
                    ? schoolRegLink
                    : `${window?.location?.origin}/admin/${values?.displayName}/${user?.uid}/${fairId}`,
                fairId: open?.id ? open?.id : new Date().getTime(),
                MajorUrl: `https://univertours.com/StudentMajorReg/${values?.displayName}/${fairId}/${cities?.find((city) => city?.id === values?.city)?.cityName || ""}/${countries?.find((country) => country?.id === values?.country)?.countryName || ""}`,
              });
              
              
              
          }
        }

        // Reset form submission state and display success message
        setSubmitting(false);
        user?.role === "superadmin" && setOpenDrawer(false);
        snackBarOpen(
          open?.id
            ? "Fair updated successfully!"
            : "Fair created successfully!",
          "success"
        );
        resetForm();
      } catch (error) {
        console.log(error);
        console.error(error);
        setSubmitting(false);
        snackBarOpen("Form submission failed.", "error");
      }
    },
  });

  // useEffect(() => {
  //   // Fetch the initial cities based on the initial selected country (if any)
  //   // For demonstration purposes, let's assume cities are fetched for the first country in the list
  //   if (countries?.length > 0) {
  //     handleCountryChange(countries[0].id);
  //     console.log(countries[0].id);
  //   }
  // }, [formik.values?.country]);
  useEffect(() => {
    // Fetch the initial cities based on the initial selected country (if any)
    // For demonstration purposes, let's assume cities are fetched for the first country in the list
    if (!open?.country || !countries?.length) return;
    handleCountryChange(open?.country);
  }, [open?.country, countries?.length]);
  return (
    <form onSubmit={formik.handleSubmit}>
      {addFairSchema?.map((schemaItem) => (
        <div key={schemaItem.key} className="w-full">
          {schemaItem?.name === "image" ? (
            <div className="w-full flex flex-col items-center !justify-center mt-2 mb-3">
              <PhotoUpload
                variant={"square"}
                value={image}
                onChange={(e) => {
                  formik?.setFieldValue("image", e.target.files[0]);
                  setImage(e);
                }}
              // className="!w-full !h-full"
              // width={"100%"}
              // className={"!object-contain"}
              />
              <p className="mt-1 text-red-600">
                {formik.touched.image && typeof formik.errors.image === "string"
                  ? formik.errors.image
                  : ""}
              </p>
            </div>
              ): schemaItem?.name === "displayName" ? (
                <TextField
                  id={schemaItem?.name}
                  name={schemaItem?.name}
                  label={schemaItem?.label}
                  select
                  value={formik.values.displayName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched[schemaItem?.name] &&
                    Boolean(formik.errors[schemaItem?.name])
                  }
                  helperText={
                    formik.touched[schemaItem?.name] &&
                    formik.errors[schemaItem?.name]
                  }
                  fullWidth
                  margin="normal"
                >
                  {eventNames
                    .filter((eventName) => eventName.role === "school")
                    .map((eventName, idx) => (
                      <MenuItem key={idx} value={eventName.displayName}>
                        {eventName.displayName}
                      </MenuItem>
                    ))}
                </TextField>
          ) : schemaItem?.name === "country" ? (
            <TextField
              select
              variant="outlined"
              fullWidth
              margin="normal"
              label="Country"
              {...formik.getFieldProps("country")}
              onChange={(event) => {
                formik.setFieldValue("country", event.target.value);
                handleCountryChange(
                  event.target.value || formik.values?.country
                );
              }}
              error={formik.touched.country && formik.errors.country}
              helperText={formik.touched.country && formik.errors.country}
              InputLabelProps={{ shrink: true }}
            >
              {countries?.length > 0 ? (
                countries.map((country) => (
                  <MenuItem key={country?.id} value={country?.id}>
                    {country?.countryName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No countries available
                </MenuItem>
              )}
            </TextField>
          ) : schemaItem?.name === "city" ? (
            <TextField
              select
              variant="outlined"
              fullWidth
              margin="normal"
              label="City"
              {...formik.getFieldProps("city")}
              defaultValue={formik.values.city || " "}
              value={formik.values.city || " "}
              error={formik.touched.city && formik.errors.city}
              helperText={formik.touched.city && formik.errors.city}
              InputLabelProps={{ shrink: true }}
            >
              {cities?.length > 0 ? (
                cities.map((city) => (
                  <MenuItem key={city?.id} value={city?.id}>
                    {city?.cityName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No cities available
                </MenuItem>
              )}
            </TextField>
          ) : (
            <TextField
              className="!w-full "
              variant="outlined"
              fullWidth
              inputProps={{
                min: new Date().toISOString().split("T")[0],
              }}
              margin="normal"
              name={schemaItem?.name}
              label={schemaItem.label}
              type={schemaItem.type}
              multiline={schemaItem?.multiline}
              rows={schemaItem?.rows}
              placeholder={schemaItem?.placeholder}
              {...formik.getFieldProps(schemaItem.name)}
              error={
                formik.touched[schemaItem.name] &&
                formik.errors[schemaItem.name]
              }
              helperText={
                formik.touched[schemaItem.name] &&
                formik.errors[schemaItem.name]
              }
              InputLabelProps={{ shrink: true }}
            />
          )}
        </div>
      ))}

      <Button
        variant="contained"
        // color="primary"
        type="submit"
        loading={formik.isSubmitting}
        disabled={formik.isSubmitting || !formik.isValid}
        className="!w-full !mt-3 !bg-theme"
        startIcon={
          formik?.isSubmitting ? (
            <CircularProgress color="secondary" size={20} />
          ) : (
            <Check size={20} />
          )
        }
      >
        Submit
      </Button>
    </form>
  );
};

export default AddSchoolVisit;
