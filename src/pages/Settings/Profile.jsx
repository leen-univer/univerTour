import { CloudUpload, Done } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import * as yup from "yup";

import { PhotoUpload, TextInput } from "components/core";
import FileUpload from "components/core/FileUpload";
import { auth, database, storage } from "configs";
import { useAppContext } from "contexts";
import { Field, Form, Formik, useFormik } from "formik";
import { useRef, useState } from "react";
import { EditProfileSchema } from "schemas";
import * as Yup from "yup";

const Profile = () => {
  const { snackBarOpen, user } = useAppContext();
  const [] = useState(false)

  const [image, setImage] = useState(user?.image);
  const [file, setFile] = useState();
  const initialValues = EditProfileSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.initialValue;
      return accumulator;
    },
    {}
  );
  const validationSchema = EditProfileSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.validationSchema;
      return accumulator;
    },
    {}
  );

  const handleRegister = async (values, submitProps) => {
    try {
      if (values.image) {
        const imageRef = storage
          .ref()
          .child(`users/${auth?.currentUser?.uid}/profile.jpg`);
        await imageRef.put(values?.image);
        const imageUrl = await imageRef.getDownloadURL();
        await database.ref(`Users/${auth?.currentUser?.uid}`).update({
          ...values,
          image: imageUrl, // Update the image URL in the database
          updated_at: new Date().toString(),
        });
      } else {
        await database.ref(`Users/${auth?.currentUser?.uid}`).update({
          ...values,
          updated_at: new Date().toString(),
        });
      }

      snackBarOpen("Data Updated Successfully", "success");
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
        <Formik
          enableReinitialize
          initialValues={
            user?.email
              ? {
                displayName: user?.displayName,
                phoneNumber: user?.phoneNumber,
                email: user?.email,
                location: user?.location,
                contactName: user?.contactName,
                website: user?.website,
                country: user?.country,
                designation: user?.designation,
                intro: user?.intro,
              }
              : initialValues
          }
          validationSchema={Yup.object(validationSchema)}
          onSubmit={handleRegister}
        >
          {(formik) => (
            <Form>
              <CardContent>
                <Grid container spacing={2} justifyContent="center">
                  {EditProfileSchema.map((inputItem) => (
                    <Grid
                      item
                      key={inputItem.key}
                      xs={12}
                      sm={12}
                      md={inputItem?.name === "country" ? 12 : 6}
                      lg={
                        inputItem?.name === "intro"
                          ? 12
                          : inputItem?.name === "image"
                            ? 12
                            : inputItem?.name === "doc" ? 12 : inputItem?.name === "addDocument" ? 12 : 6
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
                          if (inputItem.name === "image") {
                            return (
                              <div className="w-full flex !justify-center mt-2 mb-3 border border-gray-400 rounded">
                                <PhotoUpload
                                  variant={"square"}
                                  value={image}
                                  onChange={(e) => {
                                    formik?.setFieldValue(
                                      "image",
                                      e.target.files[0]
                                    );
                                    setImage(e);
                                  }}
                                  width={150}
                                  height={150}
                                />
                              </div>
                            );
                          }
                          if (inputItem.name === "doc") {
                            return (
                              <div className="w-full flex !justify-center p-3 mt-2 mb-3 border border-gray-400 rounded">
                                <FileUpload
                                  value={file}
                                  onChange={(e) => {
                                    formik?.setFieldValue(
                                      "doc",
                                      e.target.files[0]
                                    );
                                    setFile(e);
                                  }}
                                  variant="square"
                                  width={150}
                                  height={150}
                                  txtName="Upload Document"
                                />
                              </div>
                            );
                          }

                          <UploadPhoto />

                          return (
                            <TextInput
                              key={inputItem.key}
                              name={inputItem?.name}
                              label={inputItem?.label}
                              disabled={inputItem.name === "email"}
                              type={inputItem?.type}
                              startIcon={inputItem?.startIcon}
                              multiline={inputItem.multiLine}
                              rows={inputItem.rows}
                            />
                          );
                        }}
                      </Field>
                    </Grid>
                  ))}
                </Grid>
                <div className="place-content-center">
                  <LoadingButton
                    className="mt-1vh gradient"
                    variant="contained"
                    sx={{ color: "snow" }}
                    type="submit"
                    disabled={formik.isSubmitting || !formik.isValid}
                    loading={formik.isSubmitting}
                    loadingPosition="start"
                    startIcon={<Done />}
                    fullWidth
                  >
                    Save
                  </LoadingButton>
                </div>
              </CardContent>
            </Form>
          )}
        </Formik>
        <></>
      </Container>
    </div>
  );
};

export default Profile;

const UploadPhoto = () => {
  const { snackBarOpen } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const [tags, setTags] = useState([""]);
  // console.log(tags)
  const { user } = useAppContext();
  const fileInputRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      images: [],
    },
    validationSchema: yup.object({
      tag: yup?.string().optional(),
      images: yup.array().min(1, "Please select at least one image."),

    }),

    onSubmit: (values) => {
      console.log(values, "values");
      const formData = {
        ...values,
        tags: tags.filter((tag) => tag.trim() !== ""), // Remove empty tags
      };
      console.log(formData, "Values");

      try {
        // Get the uploaded images from the formik state
        const uploadedImages = formData.images;

        // Check if images are uploaded
        if (!uploadedImages || uploadedImages.length === 0) {
          snackBarOpen("Please upload at least one image.", "error");
          return;
        }

        // Set loading state to show the progress indicator
        setLoading(true);

        // Upload each image to Firebase Storage and store in Realtime Database
        const storageRef = storage.ref();
        const imagePromises = uploadedImages.map((uploadedImage) => {
          const imageId = database.ref().child("Images").push().key;
          const fileRef = storageRef.child(`images/${imageId}`);
          const uploadTask = fileRef.put(uploadedImage);

          return new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              null,
              (error) => {
                console.log("Error uploading image:", error);
                reject(error);
              },
              () => {
                fileRef
                  .getDownloadURL()
                  .then((downloadURL) => {
                    const imageInfo = {
                      imageId,
                      imageURL: downloadURL,
                      timestamp: new Date().toString(),
                      tags: formData.tags,
                    };
                    database
                      .ref(
                        user?.role === "university"
                          ? `Users/${user?.uid}/images`
                          : `Images`
                      )
                      .push(imageInfo)
                      .then(() => {
                        resolve();
                      })
                      .catch((error) => {
                        console.log("Error storing image in database:", error);
                        reject(error);
                      });
                  })
                  .catch((error) => {
                    console.log("Error getting image download URL:", error);
                    reject(error);
                  });
              }
            );
          });
        });

        // Wait for all the image uploads and database operations to complete
        Promise.all(imagePromises)
          .then(() => {
            // Reset the uploaded image state
            setImage(null);

            // Close the drawer after successful submission
            // setOpenAddImageDrawer(false);

            // Set loading state to false after successful upload
            setLoading(false);

            // Show success message in the snackbar
            snackBarOpen("Images uploaded successfully!", "success");
          })
          .catch((error) => {
            console.log("Error uploading images:", error);
            setLoading(false);
            snackBarOpen(
              "An error occurred while uploading the images.",
              "error"
            );
          });
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleFileChange = (event) => {
    formik.setFieldValue("images", Array.from(event.currentTarget.files));
  };
  const handleDivClick = () => {
    // Trigger the click event on the file input when the div is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleAddTag = () => {
    setTags([...tags, ""]);
  };

  const handleTagChange = (index, event) => {
    const newTags = [...tags];

    newTags[index] = event.target.value;
    setTags(newTags);
  };

  return (
    <section className="w-[22rem]">
      <form onSubmit={formik.handleSubmit}>
        <div className="border rounded-md p-4 border-theme cursor-pointer">
          {!formik.values.images.length && (
            <div
              onClick={handleDivClick}
              className="flex flex-col items-center gap-4"
            >
              <h1>Upload Images</h1>
              <CloudUpload fontSize="large" />
            </div>
          )}

          <div>
            <input
              id="images"
              ref={fileInputRef}
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {formik.touched.images && formik.errors.images ? (
              <div className="text-red-500">{formik.errors.images}</div>
            ) : null}
          </div>

          {Array.isArray(formik.values.images) &&
            formik.values.images.length > 0 && (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  {formik.values.images.map((image, index) => (
                    <div key={index} className="w-full relative ">
                      {/* <span className="absolute right-0 top-0 z-[999]">
                        <IconButton
                          onClick={() => handleDivClick(index)}
                          color="warning"
                          size="small"
                        >
                          <Close fontSize="small" className="!text-red-600" />
                        </IconButton>
                      </span> */}
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full object-contain drop-shadow-md"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={() => {
                      formik.setFieldValue("images", []);
                    }}
                    variant="contained"
                    color="warning"
                    className=""
                  >
                    CLEAR ALL
                  </Button>
                </div>
              </div>
            )}
        </div>
        {/* {tags.map((tag, index) => (
          <TextField
            key={index}
            fullWidth
            placeholder="Add tag for images"
            className="!mt-4"
            name={`tag-${index}`}
            value={tag}
            onChange={(event) => handleTagChange(index, event)}
          />
        ))} */}
        {/* Button to add more tag input fields */}
        {/* <div className="flex justify-center lg:py-4 py-2">
          <Button
            variant="contained"
            // color="primary"
            className="!bg-theme"
            onClick={handleAddTag}
          >
            Add Tag
          </Button>
        </div> */}
        {/* <TextField
          fullWidth
          placeholder="Add tag for images"
          className="!mt-4"
          name="tag"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.tag && formik.errors.tag}
          helperText={formik.touched.tag && formik.errors.tag}
        /> */}
        <div className="flex justify-center lg:py-4 py-2">
          <Button
            type="submit"
            variant="contained"
            className="!bg-theme"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="warning" />
              ) : (
                <Done />
              )
            }
          >
            Submit
          </Button>
        </div>
      </form>
    </section>
  );
};
