import {
  Button,
  CircularProgress,
  Container,
  Drawer,
  IconButton,
  InputLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { Cancel, Done } from "@mui/icons-material";
import { useState } from "react";

import { DocumentUpload } from "components/core";

import { useAppContext } from "contexts";
import { database, storage } from "configs";
import { useUniversities } from "hooks";
// const useStyles = makeStyles((theme) => ({
//   container: {
//     width: "100vw",
//     [theme.breakpoints.up("sm")]: {
//       maxWidth: "50vw",
//     },
//     [theme.breakpoints.up("md")]: {
//       maxWidth: "80vw",
//     },
//     [theme.breakpoints.up("lg")]: {
//       maxWidth: "30vw",
//     },
//   },
// }));
const AddDocumentDrawer = ({ open, setOpenAddDocumentDrawer }) => {
  const { universities } = useUniversities();
  const SUPERADMIN = universities?.filter(
    (university) => university?.role === "superadmin"
  )[0];
  const theme = useTheme();
  const { user } = useAppContext();
  const { snackBarOpen, sendMail, sendNotification } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const validationSchema = Yup.object().shape({
    docName: Yup.string().required("Document name is required !"),
  });
  const initialValues = {
    docName: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // console.log(values);
      // Get the uploaded document from the image state
      const uploadedDocument = image?.target?.files[0];

      // Check if a document is uploaded
      if (!uploadedDocument) {
        snackBarOpen("Please upload a document.", "error");
        return;
      }

      // Set loading state to show the progress indicator
      setLoading(true);

      // Upload the document to Firebase Storage
      const storageRef = storage.ref();
      const ID = new Date().getTime();
      const fileRef = storageRef.child(
        `documents/${uploadedDocument?.name + ID}`
      );
      const uploadTask = fileRef.put(uploadedDocument);

      // Get the download URL of the uploaded document
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.log("Error uploading document:", error);
          setLoading(false);
          snackBarOpen(
            "An error occurred while uploading the document.",
            "error"
          );
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(async (downloadURL) => {
              // Store the document link in the Realtime Database
              const docData = {
                docName: values.docName,
                docURL: downloadURL,
                docRef: uploadedDocument?.name + ID,
              };
              await database
                .ref(
                  user?.role === "university"
                    ? `Users/${user?.uid}/documents`
                    : `Users/${open?.id}/documents`
                )
                .push({
                  ...docData,
                  addedBy: user?.role,
                  timestamp: new Date().toString(),
                });

              // Send email to the superadmin
              await sendMail({
                to: SUPERADMIN?.email,
                subject: "New document added.",
                html: `
                <p>
                  New document added by Superadmin<br/>
                  <br/>
                  I wanted to inform you that a new document has been added into your list by Superadmin.</strong><br/>
                  <br/>
                  Please review it at your earliest convenience.<br/>
                  <br/>
                  Univer Team
                </p>
              `,
              });

              // Send notification to the superadmin
              const notification = {
                title: "New document added.",
                description: `${user?.displayName} has added ${values?.docName} document.`,
                read: false,
                timestamp: new Date().toString(),
              };
              await sendNotification({
                notification: {
                  title: "New document added.",
                  body: `${user?.displayName} has added ${values?.docName} document.`,
                },
                FCMToken: SUPERADMIN?.fcmToken,
              });
              await database
                .ref(`Notifications/${SUPERADMIN?.uid}`)
                .push(notification);
              resetForm();
              setImage(null);
              setOpenAddDocumentDrawer(false);
              setLoading(false);
              snackBarOpen("Document uploaded successfully!", "success");
            })

            .catch((error) => {
              console.log("Error getting document download URL:", error);
              setLoading(false);
              snackBarOpen({
                message: "An error occurred while uploading the document.",
                severity: "error",
              });
            });
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpenAddDocumentDrawer(false)}
      >
        <Container
          // sx={{
          //   width: "100%",
          //   [theme.breakpoints.up("sm")]: {
          //     maxWidth: "50vw",
          //   },
          //   [theme.breakpoints.up("md")]: {
          //     maxWidth: "80vw",
          //   },
          //   [theme.breakpoints.up("lg")]: {
          //     maxWidth: "30vw",
          //   },
          // }}
          // className="!90vw"
          className="!90vw !mt-12vh  "
          sx={{
            // width: "50vw",
            marginTop: "10vh",
            [theme.breakpoints.up("sm")]: {
              maxWidth: "50vw",
            },
            [theme.breakpoints.up("md")]: {
              maxWidth: "80vw",
            },
            [theme.breakpoints.up("lg")]: {
              maxWidth: "30vw",
            },
          }}
        >
          <div className="!flex !justify-end">
            <IconButton
              onClick={() => setOpenAddDocumentDrawer(false)}
              className="!text-red-500"
            >
              <Cancel />
            </IconButton>
          </div>
          <Typography
            align="center"
            color="text.primary"
            variant="h5"
            style={{
              marginBottom: "2vh",
            }}
          >
            Upload Document
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
            }) => (
              <Form>
                <div className="grid lg:grid-cols-1 text-red-700">
                  <div className="lg:px-4 lg:py-2 py-1 ">
                    <div className="lg:py-2 py-1">
                      <InputLabel htmlFor="Igst">
                        Document Name <span className="text-red-600">*</span>
                      </InputLabel>
                    </div>
                    <TextField
                      fullWidth
                      size="small"
                      id="docName"
                      // placeholder="% for basic salary"
                      name="docName"
                      value={values.docName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.docName && !!errors.docName}
                      helperText={touched.docName && errors.docName}
                    />
                  </div>
                  <div className="md:col-span-2 col-span-1 py-3 w-full ">
                    <p className="text-gray-500 mb-2 ml-2 ">
                      Upload Docs <span className="text-red-600">*</span>
                    </p>
                    <div className="mt-4 flex justify-center text-center ">
                      <DocumentUpload
                        variant={"square"}
                        value={image}
                        onChange={setImage}
                        width={350}
                        height={150}
                      />
                    </div>
                  </div>
                </div>
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
              </Form>
            )}
          </Formik>
        </Container>
      </Drawer>
    </>
  );
};

export default AddDocumentDrawer;
