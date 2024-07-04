import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Dialog, Tooltip } from "@mui/material";
import { database } from "configs";
import { useAppContext } from "contexts";
import dayjs from "dayjs";
import { useFetch } from "hooks";
import { useState } from "react";
import Swal from "sweetalert2";
import NoteDailog from "./NoteDailog";

const AddSuperAdminNote = ({ handleClose, addReview, id }) => {
  const { user } = useAppContext();
  console.log(user, "user");
  console.log(id);
  const [data] = useFetch(`Users/${id}/Reviews`);
  console.log(data, "Note");
  const [open, isOpen] = useState(false);
  //   const [review, setReview] = useState();
  // State to store submitted notes

  //   const handleNoteSubmit = (values) => {
  //     setNotes((prevNotes) => [...prevNotes, values]); // Add the new note to the notes array
  //     setNoteValues(null); // Reset noteValues state
  //     isOpen(false); // Close the dialog after form submission
  //   };
  const handleNoteSubmit = async (values) => {
    console.log(values?.review);
    try {
      const reviewData = {
        review: values?.review,
        timestamp: new Date().toString(),
        noteBy: user?.displayName,
        noteId: user?.uid,
      };

      const response = await database
        .ref(`Users/${id}/Reviews`)
        .push(reviewData);
      handleClose();
      Swal.fire("Success", "Review Submitted Successfully", "success");
    } catch (error) {
      Swal.fire("Failure", "Review Not Submitted", "warning");
    }
  };

  // const handleEdit = () => { };
  const handleDelete = async (data) => {
    try {
      await database.ref(`Users/${id}/Reviews/${data}`).remove();
      handleClose();
      Swal.fire("Success", "Review Deleted Successfully", "success");
    } catch (e) {
      Swal.fire("Failure", "Review Not Deleted", "warning");
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={addReview}
      maxWidth="sm"
      fullWidth
      className=""
    >
      <section className="p-5 flex flex-col gap-5 h-[25rem]">
        <div className="flex justify-between items-center">
          <h1 className="text-center text-xl font-bold text-theme tracking-wide">
            Add Review
          </h1>
          <button
            className="bg-theme text-white p-2 rounded-md text-sm flex items-center"
            onClick={() => isOpen((prev) => !prev)}
          >
            <AddIcon className="text-xs" />
            Add New Note
          </button>
        </div>
        <hr />

        <NoteDailog
          handleClose={() => isOpen(false)}
          addReview={open}
          onSubmit={handleNoteSubmit}
        />

        {data?.length > 0 && (
          <div className="w-full flex flex-col gap-2 h-80 overflow-y-scroll example">
            {data?.map((note, index) => (
              <div
                key={index}
                className=" rounded  px-3 py-2  bg-purple-50 flex flex-col gap-2 h-28 border-l-4  border-purple-400"
              >
                <div className="flex justify-between ">
                  <h2 className="flex gap-2 items-center text-sm">
                    <span className="font-semibold text-gray-500">
                      Note by :
                    </span>
                    <span className="font-semibold text-gray-500">
                      {note?.noteBy}
                    </span>
                  </h2>
                  <p className="text-xs font-semibold text-gray-400">
                    {dayjs(note?.timestamp).format("DD MMM YYYY")}
                  </p>
                </div>
                <div className="w-full border-2 border-b border-dotted border-purple-500"></div>
                <div className="flex justify-between gap-1 text-sm ">
                  <p className="text-gray-500">{note.review}</p>
                  {user?.uid === note?.noteId ? (
                    <Tooltip title="Delete">
                      <div
                        className="cursor-pointer text-xs pt-9"
                        onClick={() => handleDelete(note?.id)}
                      >
                        <DeleteIcon className="text-xs" />
                      </div>
                    </Tooltip>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Dialog>
  );
};

export default AddSuperAdminNote;
