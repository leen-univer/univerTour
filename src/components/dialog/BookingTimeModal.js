import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
    Dialog,
    Tooltip
} from "@mui/material";
import { CalendarChooseSlot } from 'components/core';
import dayjs from 'dayjs';
import { useState } from 'react';

const BookingTimeModal = ({ openDialog, handleClose, isCity }) => {
    const [bookingDate, setBookingDate] = useState()
    const [bookingTime, setBookingTime] = useState()


    // console.log(isCity, "isCity")
    return (
        <>
            <Dialog
                open={Boolean(openDialog)}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                <div className="p-6 relative flex flex-col gap-2">
                    <div className="absolute left-0 right-0 top-5 w-full h-2 bg-[#4d7cd4]"></div>
                    <div className="flex gap-2 px-2 py-5">
                        <div className="w-1/2 border-r-2 flex flex-col gap-2 justify-start">
                            <p className="text-start text-3xl font-semibold text-gray-600">{isCity?.cityName}</p>
                            <Tooltip title="Booking Duration">
                                <p className="flex gap-1 px-3 py-1 border rounded-3xl w-fit items-center justify-center">
                                    <AccessTimeIcon />
                                    <span className="text-sm">1 hour</span>
                                </p>
                            </Tooltip>
                            <p className="text-lg">Choose a time that works for you.</p>
                            <div className='w-1/2 border rounded-lg flex flex-col gap-1 p-3'>
                                <p className='text-sm'>{dayjs(bookingDate).format('dddd, MMMM DD, YYYY')}</p>
                                <p className='text-sm'>{bookingTime}</p>
                                <hr />
                                <p className="flex gap-1 w-fit items-center justify-center">
                                    <AccessTimeIcon className='text-sm' />
                                    <span className="text-xs">1 hour</span>
                                </p>
                            </div>
                        </div>
                        <div className='w-1/2 flex justify-center items-center'>
                            <CalendarChooseSlot
                                setBookingDate={setBookingDate}
                                setBookingTime={setBookingTime}
                                handleClose={handleClose}
                                cityName={isCity?.cityName}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default BookingTimeModal;
