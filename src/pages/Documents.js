import { Button, IconButton, Tooltip } from "@mui/material";
import { Add, Delete, Visibility } from "@mui/icons-material";
import { DOCUMENT } from "assets";
import { useAppContext } from "contexts";
import { getArrFromObj } from "@ashirbad/js-core";
import moment from "moment";
import { useState } from "react";
import { AddDocumentDrawer } from "components/drawer";
import Swal from "sweetalert2";
import { database, storage } from "configs";
import { NoDatas } from "components/core";
import { useUniversities } from "hooks";

const Documents = () => {
  const { user, snackBarOpen } = useAppContext();
  const { universities } = useUniversities();

  const docs =
    user?.role === "user"
      ? getArrFromObj(
          universities
            ?.filter((university) => university?.role === "university")
            ?.find((university) => university?.id === user?.universityId)
            ?.documents
        )
      : getArrFromObj(user?.documents);
  const [openAddDocumentDrawer, setOpenAddDocumentDrawer] = useState(false);
  const handleRemove = (doc) => {
    try {
      Swal.fire({
        text: "Are you sure?",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result?.isConfirmed) {
          await database
            .ref(`Users/${user?.uid}/documents/${doc?.id}`)
            .remove();
          const storageRef = storage.ref();
          const fileRef = storageRef.child(`documents/${doc?.docRef}`);
          await fileRef.delete();
          snackBarOpen("Document Deleted Successfully", "success");
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
      {user?.role !== "user" && (
        <div className="md:w-1/6 mb-5 w-full">
          <Button
            fullWidth
            onClick={() => setOpenAddDocumentDrawer(true)}
            className="!bg-theme text-xs md:!text-sm"
            variant="contained"
            startIcon={<Add />}
          >
            ADD DOCUMENT
          </Button>
        </div>
      )}
      <div className="grid md:grid-cols-4 grid-cols-1 gap-4 relative">
        {docs?.length ? (
          docs?.map((item, i) => (
            <div
              key={i}
              className="w-full h-full rounded-lg overflow-hidden shadow-sleek border border-gray-300 shadow-xl"
            >
              <div
                className={`h-28 w-full flex justify-center items-center relative bg-gradient-to-r from-green-300 via-blue-500 to-purple-600`}
              >
                <div className=" px-4 py-1 bg-white absolute right-0 bottom-[-15px] rounded-l-md flex gap-2 items-center">
                  <Tooltip title="View Documents">
                    <IconButton
                      onClick={() => window.open(item?.docURL)}
                      size="small"
                    >
                      <Visibility className="!text-linkedin" />
                    </IconButton>
                  </Tooltip>
                  {user?.role !== "user" && (
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleRemove(item)}
                      >
                        <Delete className="!text-youtube" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
                <img
                  className="h-20 object-contain "
                  src={DOCUMENT}
                  alt="icon"
                />
              </div>
              <div className="bg-white p-4">
                <h1 className="mt-2 text-sm font-semibold">Document Title :</h1>
                <span className="text-sm text-gray-600">{item?.docName}</span>
                <h1 className="mt-2 text-sm font-semibold">Created At :</h1>
                <span className="text-sm text-gray-600">
                  {moment(item?.timestamp).format("lll")}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="absolute w-full m-auto">
            <NoDatas title="No Documents Found..." />
          </p>
        )}
      </div>
    </section>
  );
};

export default Documents;
