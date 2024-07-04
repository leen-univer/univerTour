import { Add } from "@mui/icons-material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DeleteIcon from "@mui/icons-material/Delete";
import PanoramaIcon from "@mui/icons-material/Panorama";
import { Button, TextField } from "@mui/material";
import { TextInput } from "components/core";
import LightBox from "components/core/LightBox";
import { AddImageDrawer } from "components/drawer";
import { database } from "configs";
import { useAppContext } from "contexts";
import { ErrorMessage, Form, Formik } from "formik";
import { useFetch } from "hooks";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
// import { Form } from "react-router-dom";
const PhotoWall = () => {
  const [images] = useFetch(`Images`);
  const [folderData] = useFetch(`Folder`);

  // console.log(images)
  const [filterText, setFilterText] = useState("");
  const { user, snackBarOpen } = useAppContext();

  // console.log(user);
  // const [open, setOpen] = useState(false);
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [openAddDocumentDrawer, setOpenAddDocumentDrawer] = useState(false);
  const [openAddImageDrawer, setOpenAddImageDrawer] = useState(false);
  // const handleRemove = (doc) => {
  //   try {
  //     Swal.fire({
  //       text: "Are you sure?",
  //       icon: "warning",
  //       confirmButtonText: "OK",
  //     }).then(async (result) => {
  //       if (result?.isConfirmed) {
  //         await database.ref(`Images/${doc?.id}`).remove();
  //         const storageRef = storage.ref();
  //         const fileRef = storageRef.child(`images/${doc?.imageRef}`);
  //         await fileRef.delete();
  //         snackBarOpen("Photo Deleted Successfully", "success");
  //       }
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const handleUnarchive = () => {
  //   try {
  //     console.log("");
  //   } catch (error) { }
  // };
  const handleRemove = (item) => {
    try {
      console.log(item);
      Swal.fire({
        text: "Are you sure?",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result?.isConfirmed) {
          await database.ref(`Folder/${item?.id}`).remove();
          // await storage.ref(`Folder/${item?.id}`).delete();
          snackBarOpen("Folder Deleted Successfully", "success");
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  const [folders, setFolders] = useState([]);
  // const [folderName, setFolderName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showFolderInputs, setShowFolderInputs] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleCreateFolderClick = () => {
    setShowFolderInputs(true);
  };
  const handleCreateFolder = async (values, actions) => {
    const folderName = values.folderName;

    try {
      const isDuplicate = folders.some((folder) => folder.name === folderName);
      if (isDuplicate) {
        actions.setErrorMessage("Folder with the same name already exists.");
        actions.setSubmitting(false);
        return;
      }

      const foldersRef = database.ref(`Folder`);
      await foldersRef.push().set({
        folderName: folderName,
      });

      const newFolder = { name: folderName };
      setFolders([...folders, newFolder]);

      console.log("Folder created successfully in Firebase!");

      actions.resetForm();
    } catch (error) {
      console.error("Error creating folder in Firebase:", error);
    }
  };

  return (
    <section className="py-2">
      <AddImageDrawer
        open={openAddImageDrawer}
        setOpenAddImageDrawer={setOpenAddImageDrawer}
      />
      <div className=" w-full flex justify-between items-center mb-8">
        <div className="flex gap-3 items-center">
          {user?.role === "superadmin" && (
            <div className="w-40">
              <Button
                fullWidth
                onClick={() => setOpenAddImageDrawer(true)}
                className="!bg-theme text-xs md:!text-sm p-2"
                variant="contained"
                startIcon={<Add />}
              >
                ADD PHOTOS
              </Button>
            </div>
          )}
          <div>
            {showFolderInputs && (
              <div className="flex gap-2 items-center">
                <Formik
                  initialValues={{ folderName: "" }}
                  onSubmit={handleCreateFolder}
                >
                  {({ isSubmitting }) => (
                    <Form className="flex flex-col gap-1">
                      <div className="flex gap-2 items-center h-fit">
                        <TextInput
                          name="folderName"
                          label="Folder Name"
                          type="text"
                          startIcon={<CreateNewFolderIcon />}
                        />
                        <button
                          type="submit"
                          className="!bg-theme text-xs md:!text-sm p-2 text-white rounded-md whitespace-nowrap"
                          disabled={isSubmitting}
                        >
                          Create Folder
                        </button>
                      </div>
                      <ErrorMessage
                        name="folderName"
                        component="div"
                        className="text-red-500"
                      />
                    </Form>
                  )}
                </Formik>
              </div>
            )}
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}

            {!showFolderInputs && user?.role === "superadmin" && (
              <Button
                fullWidth
                onClick={handleCreateFolderClick}
                className="!bg-theme text-xs md:!text-sm"
                variant="contained"
                startIcon={<Add />}
              >
                Add Folder
              </Button>
            )}
          </div>
        </div>
        <div className="w-80">
          <TextField
            fullWidth
            size="small"
            placeholder="Search by tags"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>
      <hr />
      <div className="grid xl:grid-cols-12 gap-5 lg:grid-cols-9 md:grid-cols-6 grid-cols-3 pb-10 pt-10">
        {folderData?.map((folder, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center  relative hover:opacity-80"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {hoveredIndex === index && (

              <div className="absolute flex duration-500 gap-4 transition-all">
                {
                  user?.role === "superadmin" ? (
                    <Link to={`/photo-wall/${folder.id}`}>
                      <button className=" text-indigo-500 cursor-pointer ">
                        <PanoramaIcon />
                      </button>
                    </Link>
                  ) : (
                    <Link to={`/photos/${folder.id}`}>
                      <button className=" text-indigo-500 cursor-pointer">
                        <PanoramaIcon />
                      </button>
                    </Link>
                  )
                }

                {
                  user?.role === "superadmin" ? (
                    <button
                      className=" text-red-500 cursor-pointer"
                      onClick={() => handleRemove(folder)}
                    >
                      <DeleteIcon />
                    </button>
                  ) : null
                }

              </div>
            )}

            <img
              src="folder.png"
              alt={folder.folderName}
              className="w-20 h-20"
            />
            <Link>
              <p className="text-center">{folder.folderName}</p>
            </Link>
          </div>
        ))}
      </div>
      {/* <div className="grid xl:grid-cols-12 gap-5 lg:grid-cols-9 md:grid-cols-6 grid-cols-3 pb-10 pt-10">
        {folderData?.map((folder, index) => (
          <div className="flex flex-col justify-center items-center cursor-pointer relative">
            <button className="absolute -right-3 -top-4 text-red-500 opacity-0 hover:opacity-100">
              <DeleteIcon /></button>
            <Link to={`/photo-wall/${folder.folderName}`} key={index}>
              <img
                src="folder.png"
                alt={folder.folderName}
                className="w-20 h-20"
              />
              <p className="">{folder.folderName}</p>
            </Link>
          </div>
        ))}
      </div> */}
      <LightBox
        images={images
          ?.filter((item) => {
            const tag = item?.tag;
            const filter = filterText?.toLowerCase();
            return filter === "" || (tag && tag.includes(filter));
          })
          ?.sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp))}
      />
    </section>
  );
};

export default PhotoWall;
