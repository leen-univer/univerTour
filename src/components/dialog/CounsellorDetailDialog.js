import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { database } from "configs"; // تأكد من أنك استوردت إعدادات Firebase بشكل صحيح

const CounsellorDetailDialog = ({ rowData, handleClose }) => {
    const [counsellorDetails, setCounsellorDetails] = useState(null);

    useEffect(() => {
        const fetchCounsellorDetails = async () => {
            if (rowData) {
                try {
                    const snapshot = await database.ref(`/Users/${rowData.id}`).get();
                    if (snapshot.exists()) {
                        setCounsellorDetails(snapshot.val());
                    } else {
                        console.log("No data available");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchCounsellorDetails();
    }, [rowData]);

    if (!counsellorDetails) return null;

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={Boolean(rowData)}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="customized-dialog-title">
                <p className="text-center text-xl font-bold text-theme tracking-wide">
                    VIEW COUNSELLOERييييي DETAILS
                </p>
            </DialogTitle>
            <hr />
            <DialogContent className="app-scrollbar" sx={{ p: 2 }}>
                <div className="md:w-full md:px-4 px-2 tracking-wide">
                    <div className="flex flex-col gap-2 bg-blue-50 p-3 rounded-md">
                        <p className="flex gap-2">
                            <span>Name:</span>
                            <span className="!text-theme font-semibold">
                                {counsellorDetails.name || 'N/A'}
                            </span>
                        </p>
                        <p className="flex gap-2">
                            <span>Email:</span>
                            <span className="!text-theme font-semibold">
                                {counsellorDetails.email || 'N/A'}
                            </span>
                        </p>
                        <p className="flex gap-2">
                            <span>Contact Number:</span>
                            <span className="!text-theme font-semibold">
                                {counsellorDetails.contactNumber || 'N/A'}
                            </span>
                        </p>
                        <p className="flex gap-2">
                            <span>Experience:</span>
                            <span className="!text-theme font-semibold">
                                {counsellorDetails.experience || 'N/A'}
                            </span>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CounsellorDetailDialog;
