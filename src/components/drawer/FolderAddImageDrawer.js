import { Cancel, CloudUpload, Done } from "@mui/icons-material";
import {
    Button,
    CircularProgress,
    Container,
    Drawer,
    IconButton,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useRef, useState } from "react";

import { database, storage } from "configs";
import { useAppContext } from "contexts";
import * as yup from "yup";

const FolderAddImageDrawer = ({ open, setOpenAddImageDrawer, folderId }) => {
    const theme = useTheme();
    // const { snackBarOpen } = useAppContext();
    // const [setLoading] = useState(false);
    // const [image, setImage] = useState();
    // const { user } = useAppContext();

    // const handleSubmit = async (values) => {
    //     try {
    //         // Get the uploaded image from the image state
    //         const uploadedImage = image?.target?.files[0];

    //         // Check if an image is uploaded
    //         if (!uploadedImage) {
    //             snackBarOpen("Please upload an image.", "error");
    //             return;
    //         }

    //         // Set loading state to show the progress indicator
    //         setLoading(true);

    //         // Upload the image to Firebase Storage
    //         const storageRef = storage.ref();
    //         const ID = new Date().getTime();
    //         const fileRef = storageRef.child(`images/${uploadedImage.name}`);
    //         const uploadTask = fileRef.put(uploadedImage);
    //         console.log(fileRef);
    //         console.log(ID);
    //         // Get the download URL of the uploaded image
    //         uploadTask.on(
    //             "state_changed",
    //             null,
    //             (error) => {
    //                 console.log("Error uploading image:", error);
    //                 setLoading(false);
    //                 snackBarOpen("An error occurred while uploading the image.", "error");
    //             },
    //             () => {
    //                 uploadTask.snapshot.ref
    //                     .getDownloadURL()
    //                     .then((downloadURL) => {
    //                         // Store the image link in the Realtime Database
    //                         const imageData = {
    //                             imageRef: uploadedImage.name,
    //                             imageURL: downloadURL,
    //                         };
    //                         database

    //                             .ref(
    //                                 user?.role === "university"
    //                                     ? `Users/${user?.uid}/images`
    //                                     : `Images`
    //                             )
    //                             .push({ ...imageData, timestamp: new Date().toString() });

    //                         // Reset the uploaded image state
    //                         setImage(null);

    //                         // Close the drawer after successful submission
    //                         setOpenAddImageDrawer(false);

    //                         // Set loading state to false after successful upload
    //                         setLoading(false);

    //                         // Show success message in the snackbar
    //                         snackBarOpen("Image uploaded successfully!", "success");
    //                     })
    //                     .catch((error) => {
    //                         console.log("Error getting image download URL:", error);
    //                         setLoading(false);
    //                         snackBarOpen(
    //                             "An error occurred while uploading the image.",
    //                             "error"
    //                         );
    //                     });
    //             }
    //         );
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return (
        <>
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpenAddImageDrawer(false)}
            >
                <Container
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
                            onClick={() => setOpenAddImageDrawer(false)}
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
                        Upload Images
                    </Typography>
                    <FolderUploadPhoto setOpenAddImageDrawer={setOpenAddImageDrawer} folderId={folderId} />
                </Container>
            </Drawer>
        </>
    );
};

export default FolderAddImageDrawer;

const FolderUploadPhoto = ({ setOpenAddImageDrawer, folderId }) => {
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
            // console.log(values, "FolderDetails");
            const formData = {
                ...values,
                tags: tags.filter((tag) => tag.trim() !== ""), // Remove empty tags
            };
            // console.log(formData, "Values");

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
                    const folderDataId = database.ref().child(`Folder/${folderId}`).push().key;
                    const fileRef = storageRef.child(`Folder/${folderId}/${folderDataId}`);
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
                                            folderId,
                                            imageURL: downloadURL,
                                            timestamp: new Date().toString(),
                                            tags: formData.tags,
                                        };
                                        database
                                            .ref(
                                                user?.role === "university"
                                                    ? `Users/${user?.uid}/images`
                                                    : `Folder/${folderId}`
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
                        setOpenAddImageDrawer(false);

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
                                        className="bg-red-500 text-white"
                                    >
                                        CLEAR ALL
                                    </Button>
                                </div>
                            </div>
                        )}
                </div>
                {tags.map((tag, index) => (
                    <TextField
                        key={index}
                        fullWidth
                        placeholder="Add tag for images"
                        className="!mt-4"
                        name={`tag-${index}`}
                        value={tag}
                        onChange={(event) => handleTagChange(index, event)}
                    />
                ))}
                {/* Button to add more tag input fields */}
                <div className="flex justify-center lg:py-4 py-2">
                    <Button
                        variant="contained"
                        // color="primary"
                        className="!bg-theme"
                        onClick={handleAddTag}
                    >
                        Add Tag
                    </Button>
                </div>
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
