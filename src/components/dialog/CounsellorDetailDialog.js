import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { database } from "configs"; 

const CounsellorDetailDialog = ({ handleClose, rowData }) => {
    const [schoolCounsellors, setSchoolCounsellors] = useState([]);

    useEffect(() => {
        const fetchSchoolCounsellors = async () => {
            try {
                const snapshot = await database.ref('/Users').get();
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    const filteredUsers = Object.entries(users)
                        .filter(([, userData]) => userData.role === 'school' && userData.displayName === rowData.displayName)
                        .map(([key, userData]) => ({ uid: key, ...userData }));

                    setSchoolCounsellors(filteredUsers);
                    console.log("Filtered school users:", filteredUsers); 
                } else {
                    console.log("No data available in /Users");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchSchoolCounsellors();
    }, [rowData.displayName]);

    const handleDialogClose = () => {
        handleClose();
    };

    return (
        <Dialog
            onClose={handleDialogClose}
            aria-labelledby="customized-dialog-title"
            open={Boolean(rowData)}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="customized-dialog-title">
                <p className="text-center text-xl font-bold text-theme tracking-wide">
                    VIEW SCHOOL COUNSELLORS
                </p>
            </DialogTitle>
            <hr />
            <DialogContent className="app-scrollbar" sx={{ p: 2 }} onClick={(e) => e.stopPropagation()}>
                <div className="md:w-full md:px-4 px-2 tracking-wide">
                    {schoolCounsellors.length > 0 ? (
                        schoolCounsellors.map((counsellor) => (
                            <div key={counsellor.uid} className="flex flex-col gap-2 bg-blue-50 p-3 rounded-md mb-4">
                                <p className="flex gap-2">
                                    <span>Name:</span>
                                    <span className="!text-theme font-semibold">
                                        {counsellor.contactName || 'N/A'}
                                    </span>
                                </p>
                                <p className="flex gap-2">
                                    <span>Email:</span>
                                    <span className="!text-theme font-semibold">
                                        {counsellor.email || 'N/A'}
                                    </span>
                                </p>
                                <p className="flex gap-2">
                                    <span>Contact Number:</span>
                                    <span className="!text-theme font-semibold">
                                        {counsellor.phoneNumber || 'N/A'}
                                    </span>
                                </p>
                                <p className="flex gap-2">
                                    <span>Country:</span>
                                    <span className="!text-theme font-semibold">
                                        {counsellor.country || 'N/A'}
                                    </span>
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No school counsellors found.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CounsellorDetailDialog;
