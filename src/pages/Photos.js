import { getArrFromObj } from "@ashirbad/js-core";
import { Add, Download } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { NoDatas } from "components/core";
import { AddDocumentDrawer, AddImageDrawer } from "components/drawer";
import { database, storage } from "configs";
import { useAppContext } from "contexts";
import moment from "moment";
import { useState } from "react";
import Swal from "sweetalert2";

const Photos = () => {
  const { user, snackBarOpen } = useAppContext();

  const [openAddDocumentDrawer, setOpenAddDocumentDrawer] = useState(false);
  const [openAddImageDrawer, setOpenAddImageDrawer] = useState(false);
  const handleRemove = (doc) => {
    try {
      Swal.fire({
        text: "Are you sure?",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result?.isConfirmed) {
          await database.ref(`Users/${user?.uid}/images/${doc?.id}`).remove();
          const storageRef = storage.ref();
          const fileRef = storageRef.child(`images/${doc?.imageRef}`);
          await fileRef.delete();
          snackBarOpen("Photo Deleted Successfully", "success");
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <section className="py-2">
      <AddDocumentDrawer
        open={openAddDocumentDrawer}
        setOpenAddDocumentDrawer={setOpenAddDocumentDrawer}
      />
      <AddImageDrawer
        open={openAddImageDrawer}
        setOpenAddImageDrawer={setOpenAddImageDrawer}
      />{" "}
      <div className="md:w-1/6 mb-5 !w-full">
        <Button
          fullWidth
          onClick={() => setOpenAddImageDrawer(true)}
          className="!bg-theme text-xs md:!text-sm !w-full"
          variant="contained"
          startIcon={<Add />}
        >
          ADD PHOTOS
        </Button>
      </div>
      <div className="grid md:grid-cols-4 grid-cols-1 gap-4 relative">
        {getArrFromObj(user?.images)?.length ? (
          getArrFromObj(user?.images)
            ?.slice()
            ?.sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp))
            ?.map((item, i) => (
              <div
                key={i}
                className="w-full h-full rounded-lg overflow-hidden shadow-sleek border border-gray-300 shadow-xl"
              >
                <div
                  className={`h-28 w-full flex justify-center items-center relative bg-gradient-to-r from-rose-200 to-teal-100`}
                >
                  <div className=" px-4 py-1 bg-white absolute right-0 bottom-[-20px] rounded-l-md flex gap-2 items-center">
                    <Tooltip title="Download Image">
                      <IconButton
                        onClick={() => window.open(item?.imageURL)}
                        size="small"
                      >
                        <Download className="!text-linkedin" />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleRemove(item)}
                      >
                        <Delete className="!text-youtube" />
                      </IconButton>
                    </Tooltip> */}
                  </div>
                  <img
                    className="h-16 mb-1 object-contain rounded-md"
                    src={item?.imageURL}
                    alt="icon"
                  />
                </div>
                <div className="bg-white p-4">
                  <h1 className="mt-2 text-sm font-semibold">Created At :</h1>
                  <span className="text-sm text-gray-600">
                    {moment(item?.timestamp).format("lll")}
                  </span>
                </div>
              </div>
            ))
        ) : (
          <p className="absolute w-full m-auto">
            <NoDatas title="No Photos Found..." />
          </p>
        )}
      </div>
    </section>
  );
};

export default Photos;
