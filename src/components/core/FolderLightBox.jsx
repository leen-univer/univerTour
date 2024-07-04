import {
    Archive,
    Close,
    Delete,
    Download,
    Unarchive,
    Visibility,
} from "@mui/icons-material";
import { Checkbox, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { database, storage } from "configs";
import { useAppContext } from "contexts";
import { useFetch } from "hooks";
import { useState } from "react";
import Swal from "sweetalert2";

const FolderLightBox = ({ images, folderIdData }) => {
    console.log(images, "images")
    const [loading, setLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isSelect, setIsSelect] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [click, setClick] = useState(0);
    const [imageURL, setImageURL] = useState("");
    const [archives] = useFetch(`Archive`);
    function leftSide() {
        setClick((prev) => (prev > 0 ? prev - 1 : 0));
    }
    function rightSide() {
        setClick((prev) =>
            images.length - 1 > prev ? prev + 1 : images.length - 1
        );
    }
    const handelClose = (e) => {
        if (e.target.dataset.close) {
            document.body.style.overflowY = "auto";
            setIsShow(false);
        }
    };
    const { user, snackBarOpen } = useAppContext();
    const handleRemove = (image) => {
        try {
            Swal.fire({
                text: "Are you sure?",
                icon: "warning",
                confirmButtonText: "OK",
            }).then(async (result) => {
                if (result?.isConfirmed) {
                    await database.ref(`Folder/${folderIdData}/${image}`).remove();
                    await storage.ref(`Folder/${folderIdData}/${image}`).delete();
                    snackBarOpen("Photo Deleted Successfully", "success");
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    // const handleRemove = (doc) => {
    //     console.log(doc)
    //     try {
    //         Swal.fire({
    //             text: "Are you sure?",
    //             icon: "warning",
    //             confirmButtonText: "OK",
    //         }).then(async (result) => {
    //             if (result?.isConfirmed) {
    //                 await database.ref(`Folder/${folderId}/${doc?.id}`).remove();
    //                 await storage.ref(`Folder/${folderId}/${doc?.id}`).delete()
    //                 snackBarOpen("Photo Deleted Successfully", "success");
    //             }
    //         });
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };
    const RemovePhotos = async (doc) => {
        try {
            await database.ref(`Folder/${folderIdData}/${doc}`).remove();
            const storageRef = storage.ref();
            const fileRef = storageRef.child(`Folder/${folderIdData}/${doc}`);
            await fileRef.delete();
            // snackBarOpen("Photo Deleted Successfully", "success");
        } catch (e) {
            console.log(e);
        }
    };
    const handleArchive = async (item) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to add into archive?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, archive!",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    console.log(item);
                    await database.ref(`Archive`).push({
                        imageURL: item?.imageURL,
                        imageId: item?.id,
                        timestamp: new Date().toString(),
                    });
                    Swal.fire({
                        title: "Added into archive.",
                        text: "Successfully!",
                        icon: "success",
                    });
                }
            });
        } catch (error) {
            console.error(error);
        }
    };
    const handleUnarchive = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to remove from archive?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, remove!",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await database.ref(`Archive/${id}`).remove();
                    Swal.fire({
                        title: "Removed.",
                        text: "Successfully!",
                        icon: "success",
                    });
                    console.log(response);
                }
            });
        } catch (error) {
            console.error(error);
        }
    };
    const handleToggleSelect = (item) => {
        const updatedSelection = [...selectedImages];
        const index = updatedSelection.findIndex(
            (selectedItem) => selectedItem.id === item.id
        );

        if (index === -1) {
            updatedSelection.push(item);
        } else {
            updatedSelection.splice(index, 1);
        }

        setSelectedImages(updatedSelection);
    };

    const handleDeleteSelectedImages = async () => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to delete the selected images!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        setLoading(true); // Set loading to true when starting deletion
                        // Assuming you have a function to delete images by their IDs
                        // Modify this based on your actual data structure and deletion logic
                        for (const item of selectedImages) {
                            await RemovePhotos(item?.id);
                        }
                        // Clear the selected images array
                        setSelectedImages([]);
                        // Show a success message or perform any other actions as needed
                        snackBarOpen("Selected Photos Deleted Successfully", "success");
                        setLoading(false);
                    } catch (error) {
                        setLoading(false);
                    }
                }
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Set loading to false when deletion is complete
        }
    };


    return (
        <div className="">
            {user?.role === "superadmin" && (
                <div className="mb-2 flex gap-2">
                    <button
                        onClick={() => {
                            setIsSelect((prev) => !prev);
                        }}
                        className={`px-4 py-2 rounded-md uppercase ${isSelect ? "bg-theme text-white" : "bg-gray-200 text-black "
                            }`}
                    >
                        Select Photos
                    </button>
                    {selectedImages.length > 0 && isSelect && (
                        <>
                            <button
                                onClick={handleDeleteSelectedImages}
                                className={`px-4 py-2 rounded-md bg-red-600 uppercase text-white `}
                            >
                                {loading ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    "Delete Selected Images"
                                )}
                            </button>
                        </>
                    )}
                </div>
            )}

            <div className="grid md:grid-cols-4 grid-cols-1 gap-4 relative">
                {images?.length ? (
                    images
                        ?.slice()
                        ?.sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp))
                        ?.map((item, i) => (
                            <div
                                key={i}
                                className="relative w-full h-60 rounded-lg overflow-hidden shadow-sleek border border-gray-300 shadow-xl"
                            >
                                <div
                                    className={` w-full flex justify-center items-center relative bg-gradient-to-r from-rose-200 to-teal-100`}
                                >
                                    <img
                                        className="mb-1 w-full h-full object-cover rounded-md"
                                        src={item?.imageURL}
                                        alt="icon"
                                    />
                                    {isSelect && (
                                        <span className="absolute top-3 left-3">
                                            <Checkbox
                                                checked={selectedImages.some(
                                                    (selectedItem) => selectedItem.id === item.id
                                                )}
                                                onChange={() => handleToggleSelect(item)}
                                            />
                                        </span>
                                    )}
                                </div>
                                <>
                                    <div className="bg-white absolute bottom-0 right-0 py-1 rounded-l-md flex gap-2 !justify-end">
                                        <Tooltip title="Download Image">
                                            <IconButton
                                                onClick={() => window.open(item?.imageURL)}
                                                size="small"
                                            >
                                                <Download className="!text-linkedin" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="View Image">
                                            <IconButton
                                                onClick={() => {
                                                    setIsShow(!isShow);
                                                    setClick(i);
                                                    setImageURL(imageURL);
                                                    document.body.style.overflowY = "hidden";
                                                }}
                                                size="small"
                                            >
                                                <Visibility className="!text-linkedin" />
                                            </IconButton>
                                        </Tooltip>
                                        {user?.role === "superadmin" && (
                                            <div>
                                                {archives?.find((i) => i?.imageId === item?.id)
                                                    ?.imageURL?.length ? (
                                                    <Tooltip title="Unarchive">
                                                        <IconButton
                                                            onClick={() => {
                                                                handleUnarchive(
                                                                    archives?.find(
                                                                        (data) => data?.imageId === item?.id
                                                                    )?.id
                                                                );
                                                            }}
                                                            size="small"
                                                        >
                                                            <Unarchive className="!text-youtube" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Archive">
                                                        <IconButton
                                                            onClick={() => {
                                                                handleArchive(item);
                                                            }}
                                                            size="small"
                                                        >
                                                            <Archive className="!text-green-500" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemove(item?.id)}
                                                    >
                                                        <Delete className="!text-youtube" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </div>
                                </>
                            </div>
                        ))
                ) : (
                    <p className="absolute w-full m-auto">
                        {/* <NoDatas title="No Photos Found..." /> */}
                    </p>
                )}
            </div>
            {isShow ? (
                <div className="bg-black/75 h-screen w-screen absolute top-0 left-0 cursor-pointer z-50">
                    <nav className="flex h-[2.5rem] w-[100%] items-center justify-between justify-items-center bg-black">
                        <IconButton>
                            <Close
                                onClick={(e) => {
                                    setIsShow(false);
                                    document.body.style.overflowY = "auto";
                                }}
                            ></Close>
                        </IconButton>
                    </nav>
                    <div
                        data-close
                        className="slider_style relative flex h-full w-full items-center justify-center"
                        onClick={handelClose}
                    >
                        <div className="indivisual_gallery_div absolute z-50 cursor-pointer">
                            <div className="relative overflow-hidden">
                                <img
                                    layout="fill"
                                    objectFit="cover"
                                    unoptimized
                                    src={imageURL}
                                    alt="logo"
                                    className="h-[70vh] object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        className="absolute left-0 flex h-[2rem]
            w-[2rem] cursor-pointer items-center justify-center justify-items-center rounded-lg bg-white"
                    >
                        <span className="">
                            <i onClick={leftSide} className="fa-solid fa-arrow-left"></i>
                        </span>
                    </div>
                    <div
                        className="absolute right-0 flex h-[2rem]
            w-[2rem] cursor-pointer items-center justify-center justify-items-center rounded-lg bg-white"
                    >
                        <span className="">
                            <i onClick={rightSide} className="fa-solid fa-arrow-right"></i>
                        </span>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default FolderLightBox;
