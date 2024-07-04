import { getArrFromObj } from "@ashirbad/js-core";
import MaterialTable from "@material-table/core";
import { Cancel, Close } from "@mui/icons-material";
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { CLOUD, CONTACTIMG } from "assets";
import { PhotoUpload } from "components/core";
import { database, storage } from "configs";
import { useAppContext } from "contexts";
import moment from "moment";
import { useEffect, useState } from "react";

const KeyInfoDialog = ({ mainId, openDialog, setOpenDialog }) => {
  const { snackBarOpen, snackBarClose } = useAppContext();

  const [uploading, setUploading] = useState(false);
  const [keyInfoData, setKeyInfoData] = useState(
    getArrFromObj(openDialog?.keyInfos) || []
  );

  useEffect(() => {
    // Update keyInfoData state whenever openDialog changes
    setKeyInfoData(getArrFromObj(openDialog?.keyInfos) || []);
  }, [openDialog]);

  const handleImageUpload = async (imageFile) => {
    try {
      if (imageFile) {
        setUploading(true);

        const imageRef = storage.ref().child(`keyInfoImages/${Date.now()}`);
        await imageRef.put(imageFile);
        const imageUrl = await imageRef.getDownloadURL();

        setUploading(false);
        return imageUrl;
      }
    } catch (error) {
      snackBarOpen(error.message, "error");
      console.log(error);
      setUploading(false);
    }
  };
  const handleImageDelete = async (imageUrl) => {
    try {
      if (imageUrl) {
        const imageRef = storage.refFromURL(imageUrl);
        await imageRef.delete();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRowAdd = async (newData) => {
    try {
      const image = newData.image?.target?.files[0]; // Check if image is present
      const imageUrl = image ? await handleImageUpload(image) : ""; // Handle if image is not present

      const newKeyInfoData = {
        ...newData,
        image: imageUrl,
        timestamp: new Date().toString(),
      };

      // If there's no image, remove the 'image' property from the new data
      if (!image) {
        delete newKeyInfoData.image;
      }

      const newKeyInfoRef = await database
        .ref(`Countries/${mainId}/cities/${openDialog?.id}/keyInfos`)
        .push(newKeyInfoData);

      // Update the keyInfoData state with the new entry
      setKeyInfoData((prevData) => [
        ...prevData,
        {
          ...newKeyInfoData,
          id: newKeyInfoRef.key,
        },
      ]);

      snackBarOpen("Key Info Created Successfully", "success");
    } catch (error) {
      snackBarOpen(error.message, "error");
      console.log(error);
    }
  };

  const handleRowUpdate = async (newData, oldData) => {
    try {
      let updatedData = { ...newData }; // Create a copy of newData to modify

      // Check if an image is being uploaded
      if (
        newData.image &&
        newData.image.target &&
        newData.image.target.files[0]
      ) {
        const image = newData.image.target.files[0];
        delete updatedData.image; // Remove the imageFile property before updating

        const imageUrl = await handleImageUpload(image);
        updatedData = {
          ...updatedData,
          image: imageUrl, // Update the image URL in the data
        };
      } else {
        // Keep the existing image if no new image is provided
        updatedData.image = oldData.image;
      }

      // Check if the timestamp property is defined in newData
      if (!updatedData.timestamp) {
        updatedData.timestamp = new Date().toString();
      }

      // Update the other data fields
      await database
        .ref(
          `Countries/${mainId}/cities/${openDialog?.id}/keyInfos/${oldData.id}`
        )
        .update({ ...updatedData, tableData: {} });

      // Update the keyInfoData state with the updated entry
      setKeyInfoData((prevData) =>
        prevData.map((item) =>
          item.id === oldData.id ? { ...updatedData, id: oldData.id } : item
        )
      );

      snackBarOpen("Key Info Updated Successfully", "success");
    } catch (error) {
      snackBarOpen(error.message, "error");
      console.log(error);
    }
  };

  const handleRowDelete = async (oldData) => {
    try {
      const imageUrl = oldData.image;
      await handleImageDelete(imageUrl);

      await database
        .ref(
          `Countries/${mainId}/cities/${openDialog?.id}/keyInfos/${oldData.id}`
        )
        .remove();

      // Manually update the keyInfoData state after successful delete
      setKeyInfoData((prevData) =>
        prevData.filter((item) => item.id !== oldData.id)
      );

      snackBarOpen("Key Info Deleted Successfully", "success");
    } catch (error) {
      snackBarOpen(error.message, "error");
      console.log(error);
    }
  };
  return (
    <Dialog
      onClose={() => setOpenDialog(false)}
      aria-labelledby="customized-dialog-title"
      open={openDialog?.id}
      maxWidth="lg"
      fullWidth
      className=""
    >
      <DialogTitle className="!mb-5" id="customized-dialog-title">
        {/* <p className="text-center text-xl font-bold text-theme tracking-wide">
          Key info of {openDialog?.cityName?.toLowerCase()}
        </p> */}
        <IconButton
          className="!text-red-600 "
          aria-label="close"
          onClick={() => setOpenDialog(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Avatar
            variant="rounded"
            sx={{ width: 28, height: 28 }}
            className="!bg-red-600"
          >
            {" "}
            <Close className="!text-red=600" />
          </Avatar>
        </IconButton>
      </DialogTitle>
      <DialogContent className="app-scrollbar" sx={{ p: 2 }}>
        <div className="md:w-full tracking-wide">
          <MaterialTable
            data={keyInfoData
              ?.sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp))
              .map((item, i) => ({ ...item, sl: i + 1 }))}
            title={`Key info-${openDialog?.cityName} `}
            localization={{
              header: {
                actions: " ",
              },
            }}
            columns={[
              {
                title: "",
                field: "sl",
                editable: "never",
                width: "2%",
              },
              {
                title: "",
                field: "image",
                render: (rowData) => (
                  <img
                    src={rowData.image || CLOUD} // Replace with your actual image source
                    alt="Key Info"
                    style={{ width: 100, height: 100 }}
                  />
                ),
                editComponent: (props) => {
                  const imgURL = props?.value?.target?.files?.[0]
                    ? URL.createObjectURL(props.value.target.files[0])
                    : props.value;
                  // console.log(imgURL);
                  return (
                    <PhotoUpload
                      className="object-contain"
                      value={imgURL}
                      onChange={(e) => props.onChange(e)}
                    />
                  );
                },
              },
              {
                title: "",
                field: "info",
                searchable: true,
                validate: (value) => {
                  if (
                    value?.info?.length <= 0 ||
                    value?.info?.length === undefined ||
                    value?.info?.length === null
                  ) {
                    return "Required";
                  }
                  return true;
                },
              },

              {
                title: "Created At",
                editable: "never",
                field: "timestamp",
                hidden: true,
                filtering: false,
                render: ({ timestamp }) =>
                  moment(new Date(timestamp)).format("lll"),
              },
            ]}
            options={{
              detailPanelColumnAlignment: "right",
              exportAllData: true,
              selection: false,
              search: false,
              addRowPosition: "first",

              exportMenu: [
                // {
                //   label: "Export Users Data In CSV",
                //   exportFunc: (cols, data) => ExportCsv(cols, data),
                // },
                // {
                //   label: "Export Users Data In PDF",
                //   exportFunc: (cols, data) => ExportPdf(cols, data),
                // },
              ],
              // selection: true,
              actionsColumnIndex: -1,
            }}
            style={{
              boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
              borderRadius: "8px",
            }}
            editable={{
              onRowAdd: mainId
                ? async (newData) => {
                    await handleRowAdd(newData);
                  }
                : null,
              onRowUpdate: mainId
                ? async (newData, oldData) => {
                    await handleRowUpdate(newData, oldData);
                  }
                : null,
              onRowDelete: mainId
                ? async (oldData) => {
                    await handleRowDelete(oldData);
                  }
                : null,
              localization: {
                header: {
                  actions: "Alexa", // Replace with your desired text
                },
              },
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyInfoDialog;
