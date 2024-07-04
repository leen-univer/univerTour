import { getArrFromObj } from "@ashirbad/js-core";
import { Check, Person } from "@mui/icons-material";
import { Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import { auth, database, storage } from "configs";
import { useAppContext } from "contexts";
import { useFormik } from "formik";
import { useFetch } from "hooks";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { PhotoUpload } from "./core";

const AddInfo = ({ setOpenDrawer, open }) => {
  const { user, snackBarOpen } = useAppContext();
  const [countries] = useFetch(`/Countries`);
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

  const addInfoSchema = [
    {
      key: "2xs",
      label: "Image",
      name: "image",
      initialValue: "",
      // validationSchema: Yup.string().required("Image is Required"),
    },
    {
      key: "2",
      label: "Title",
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
  ];
  const initialValues = addInfoSchema.reduce((acc, schemaItem) => {
    acc[schemaItem.name] = schemaItem.initialValue;
    return acc;
  }, {});

  const validationSchema = addInfoSchema.reduce((acc, schemaItem) => {
    acc[schemaItem.name] = schemaItem.validationSchema;
    return acc;
  }, {});

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
      const fairId = open?.id ? open?.id : new Date().getTime();
      try {
        // Upload the image to Firebase Storage
        const imageFile = values.image && values.image;
        const imageFileName =
          values.image && `fair_${fairId}_${imageFile.name}`;
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
        if (open?.id) {
          await database.ref(`NewFairs/${open?.id}`).update({
            ...values,

            fairType: "INFO",
            image: values.image ? values?.image : "",
            imageRef:
              open?.id && open?.imageRef ? open?.imageRef : imageFileName || "",
            country: values?.country,
            cityName: cities?.find((city) => city?.id === values?.city)
              ?.cityName,
            countryName: countries?.find(
              (country) => country?.id === values?.country
            ).countryName,
            createdBy: user?.role,
            timestamp: new Date().toString(),
            createdSchoolName: user?.displayName,
            creatorId: auth?.currentUser?.uid,
          });
        } else {
          await database.ref(`NewFairs/${fairId}`).set({
            ...values,
            fairType: "INFO",
            image: values.image ? values?.image : "",
            imageRef: imageFileName || "",
            country: values?.country,
            cityName: cities?.find((city) => city?.id === values?.city)
              ?.cityName,
            countryName: countries?.find(
              (country) => country?.id === values?.country
            ).countryName,
            createdBy: user?.role,
            timestamp: new Date().toString(),
            createdSchoolName: user?.displayName,
            creatorId: auth?.currentUser?.uid,
          });
        }

        // Reset form submission state and display success message
        setSubmitting(false);
        user?.role === "superadmin" && setOpenDrawer(false);
        snackBarOpen("Fair created successfully!", "success");
        resetForm();
      } catch (error) {
        console.log(error);
        console.error(error);
        setSubmitting(false);
        snackBarOpen("Form submission failed.", "error");
      }
    },
  });

  useEffect(() => {
    // Fetch the initial cities based on the initial selected country (if any)
    // For demonstration purposes, let's assume cities are fetched for the first country in the list
    if (!open?.country || !countries?.length) return;
    handleCountryChange(open?.country);
  }, [open?.country, countries?.length]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {addInfoSchema?.map((schemaItem) => (
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
              // width={350}
              // height={150}
              />
              <p className="mt-1 text-red-600">
                {formik.touched.image && typeof formik.errors.image === "string"
                  ? formik.errors.image
                  : ""}
              </p>
            </div>
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
                handleCountryChange(event.target.value);
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

export default AddInfo;
