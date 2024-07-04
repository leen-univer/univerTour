import {
    Dialog,
    DialogContent,
    DialogTitle
} from "@mui/material";

const CounsellorDetailDialog = ({ rowData, handleClose }) => {
    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={rowData}
            maxWidth="sm"
            fullWidth
            className=""
        >
            <DialogTitle className="" id="customized-dialog-title">
                <p className="text-center text-xl font-bold text-theme tracking-wide">
                    VIEW COUNSELLOER DETAILS
                </p>
            </DialogTitle>
            <hr />

            <DialogContent className="app-scrollbar" sx={{ p: 2 }}>
                <div className="md:w-full md:px-4 px-2 tracking-wide">
                    <div className="flex flex-col gap-2 bg-blue-50 p-3 rounded-md">
                        <p className="flex gap-2 ">
                            <span className="">
                                Name :
                            </span>
                            <span className="!text-theme font-semibold">

                                Univer Info
                            </span>
                        </p>
                        <p className="flex gap-2 ">
                            <span className="">
                                Email :
                            </span>
                            <span className="!text-theme font-semibold">
                                counselloer@12@gmail.com
                            </span>
                        </p>
                        <p className="flex gap-2 ">
                            <span className="">
                                Contact Number  :
                            </span>
                            <span className="!text-theme font-semibold">
                                0096264294444
                            </span>
                        </p>
                        <p className="flex gap-2 ">
                            <span className="">
                                Experience :
                            </span>
                            <span className="!text-theme font-semibold">
                                Over 10 years of experience in counseling practice
                            </span>
                        </p>
                        <p>

                        </p>
                        {/* COUNSELLOER */}

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CounsellorDetailDialog;
