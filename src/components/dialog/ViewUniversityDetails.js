import { Dialog, DialogContent, DialogTitle, Tooltip } from "@mui/material";

const ViewUniversityDetails = ({ openDialog, handleClose }) => {
  // console.log(openDialog, "openDialog")
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={openDialog}
      maxWidth="sm"
      fullWidth
      className=""
    >
      <DialogTitle className="" id="customized-dialog-title">
        <p className="text-center text-xl p-2 rounded-md font-bold text-white tracking-wide bg-theme">
          VIEW UNIVERSITY DETAILS
        </p>
      </DialogTitle>
      <DialogContent className="app-scrollbar" sx={{ p: 2 }}>
        <div className="md:w-full md:px-4 px-2 tracking-wide">
          <div className="flex justify-center items-center mb-3">
            <img
              className="w-56 object-contain"
              src={openDialog?.image}
              alt=""
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="grid grid-cols-2 font-semibold ">
              <span>University Name</span>
              <span className="text-blue-700">
                :{" "}{openDialog?.displayName}
              </span>
            </p>
            <p className="font-semibold grid grid-cols-2">
              <span>
                Phone Number
              </span>
              <span className="text-blue-700">

                :  {" "}{openDialog?.phoneNumber}
              </span>
            </p>
            <p className="font-semibold grid grid-cols-2">
              <span>
                Email
              </span>
              <span className="text-blue-700">
                :{" "}{openDialog?.email}
              </span>
            </p>
            <p className="font-semibold grid grid-cols-2">
              <span>
                Location
              </span>
              <span className="text-blue-700">
                :{" "}{openDialog?.location}
              </span>
            </p>
            <p className="font-semibold grid grid-cols-2">
              <span>
                Contact Person
              </span>
              <span className="text-blue-700">

                : {" "} {openDialog?.contactName}
              </span>
            </p>
            <p className="font-semibold grid grid-cols-2">

              <span>
                Designation
              </span>
              <span className="font-semibold text-blue-700">
                :{" "}{openDialog?.intro}
              </span>
            </p>
            {/* <p className="font-semibold grid grid-cols-2">
              <span>
                Website URL
              </span>
              <span className=" text-blue-700">
                :{" "}{openDialog?.website}{" "}
              </span>
            </p> */}
            <p className="font-semibold grid grid-cols-2">
              <span>
                Country Name
              </span>
              <span className="text-blue-700">
                :{" "}{openDialog?.country}{" "}
              </span>
            </p>

            <p className="font-semibold grid grid-cols-2">
              <span>
                Intro
              </span>
              <span className="text-blue-700">

                :{" "}{openDialog?.contactDetails}{" "}
              </span>
            </p>
            <Tooltip title="Click here to visit the website">
              <a href={openDialog?.website} className="p-2 hover:bg-blue-100 w-full rounded-md text-center ">
                {openDialog?.website}
              </a>

            </Tooltip>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUniversityDetails;
