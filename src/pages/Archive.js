import { Delete, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { database } from "configs";
import { useFetch } from "hooks";
import React from "react";
import Swal from "sweetalert2";

const Archive = () => {
  const [archives] = useFetch(`Archive`);
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
          await database.ref(`Archive/${id}`).remove();
          Swal.fire({
            title: "Removed.",
            text: "Successfully!",
            icon: "success",
          });
        }
        return;
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="p-8">
      <h3 className="text-theme font-semibold">Archive Photos</h3>
      <section className="grid md:grid-cols-4 grid-cols-1 mt-8 gap-4">
        {!archives?.length ? (
          <div className="h-80 w-full justify-center items-center">
            <h3>No photos in archive...</h3>
          </div>
        ) : null}

        {archives?.map((data) => (
          <div
            key={data?.id}
            className="h-80 w-full bg-slate-400 rounded-md overflow-hidden drop-shadow-md relative"
          >
            <div className="absolute right-[15px] bottom-[15px] flex flex-col">
              {/* <Tooltip title="View">
                <IconButton>
                  <Visibility />
                </IconButton>
              </Tooltip> */}
              <Tooltip title="Remove from archive ?">
                <IconButton
                  onClick={() => {
                    handleUnarchive(data?.id);
                  }}
                >
                  <Delete className="!text-red-600" />
                </IconButton>
              </Tooltip>
            </div>
            <img src={data?.imageURL} className="h-full w-full object-cover" />
          </div>
        ))}
      </section>
    </section>
  );
};

export default Archive;

const cards = [
  {
    id: 1,
    image:
      "https://img.freepik.com/free-photo/young-tender-curly-girl-holding-documents_176420-239.jpg?w=2000&t=st=1702963258~exp=1702963858~hmac=df97803fd971786963e6805b009da7099c4a4c03d96ac7bd918771b94f836453",
  },
  {
    id: 2,
    image:
      "https://img.freepik.com/free-photo/young-tender-curly-girl-holding-documents_176420-239.jpg?w=2000&t=st=1702963258~exp=1702963858~hmac=df97803fd971786963e6805b009da7099c4a4c03d96ac7bd918771b94f836453",
  },
  {
    id: 3,
    image:
      "https://img.freepik.com/free-photo/young-tender-curly-girl-holding-documents_176420-239.jpg?w=2000&t=st=1702963258~exp=1702963858~hmac=df97803fd971786963e6805b009da7099c4a4c03d96ac7bd918771b94f836453",
  },
  {
    id: 4,
    image:
      "https://img.freepik.com/free-photo/young-tender-curly-girl-holding-documents_176420-239.jpg?w=2000&t=st=1702963258~exp=1702963858~hmac=df97803fd971786963e6805b009da7099c4a4c03d96ac7bd918771b94f836453",
  },
];
