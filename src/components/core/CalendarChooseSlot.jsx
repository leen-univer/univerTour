import { Send } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LoadingButton } from '@mui/lab';
import { CardContent, Tooltip } from '@mui/material';
import { database } from 'configs';
import { useAppContext } from 'contexts';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { TextInput } from '.';


function CalendarChooseSlot({ setBookingDate, setBookingTime, handleClose, cityName }) {
    const { snackBarOpen, sendMail } = useAppContext();
    // console.log(cityName, "cityName")
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [showCalendar, setShowCalendar] = useState(true);
    const [showSlotSelection, setShowSlotSelection] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isOtp, setIsOtp] = useState(false);

    const isDisabled = (date) => {
        // Disable Sundays and Saturdays
        if (date.getDay() === 0 || date.getDay() === 6) {
            return true;
        }
        // Disable dates before the current date
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set current date to midnight
        return date < currentDate;
    };

    const handleDateClick = (value) => {
        setDate(value);
        setShowCalendar(false);
        setShowSlotSelection(true);
        setBookingDate(value)
    };
    // console.log(date, "Calendar date")

    const handleSlotSelection = (selectedTime) => {
        setTime(selectedTime);
        setShowSlotSelection(false);
        setShowForm(true);
        setBookingTime(selectedTime)
    };

    const handleBack = () => {
        if (showSlotSelection) {
            setShowSlotSelection(false);
            setShowCalendar(true);
        } else if (showForm) {
            setShowForm(false);
            setShowSlotSelection(true);
        }
    };

    const timeSlots = [
        '10:30 AM', '11:30 AM', '12:30 PM', '01:30 PM',
        '02:30 PM', '03:30 PM', '04:30 PM', '05:30 PM',
        '06:30 PM',
    ];

    const ConfirmBooking = [
        {
            key: "1",
            label: "First Name",
            name: "displayName",
            validationSchema: Yup.string()
                .required("First name is Required"),
            initialValue: "",
        },
        {
            key: "2",
            label: "Last Name",
            name: "lastName",
            validationSchema: Yup.string()
                .required("Last name is Required"),
            initialValue: "",
        },
        {
            key: "3",
            label: "School Name",
            name: "schoolName",
            validationSchema: Yup.string()
                .required("School Name is Required"),
            initialValue: "",
        },
        {
            key: "4",
            label: "Email",
            name: "email",
            type: "email",
            initialValue: "",
            validationSchema: Yup.string().email("Invalid email address").required("Email is Required"),
        },
    ];


    const initialValues = ConfirmBooking.reduce((accumulator, currentValue) => {
        accumulator[currentValue.name] = currentValue.initialValue;
        return accumulator;
    }, {});
    const validationSchema = ConfirmBooking.reduce((accumulator, currentValue) => {
        accumulator[currentValue.name] = currentValue.validationSchema;
        return accumulator;
    }, {});

    // const handleSubmit = (values, { setSubmitting }) => {
    //     const formData = {
    //         ...values,
    //         selectedDate: date,
    //         selectedTimeSlot: time
    //     };
    //     // setBookingDate(formData)

    //     console.log(formData);


    //     setSubmitting(true);
    //     setIsOtp(true);

    //     setTimeout(() => {
    //         setSubmitting(false);
    //     }, 1000);
    // };

    // const nodemailer = require("nodemailer");

    const handleSubmit = async (values, submitProps) => {
        // console.log(values)
        try {
            const moment = require('moment');
            const formData = {
                ...values,
                date: moment(date).format('YYYY-MM-DD'),
                time: time,
                cityName: cityName,
                isAccepted: "pending",
                timestamp: new Date().toString(),
            };
            console.log(formData);
            await database.ref('Bookings').push(formData);


            Swal.fire({
                title: 'Booking Request Received!',
                text: 'We have received your Booking request. We will connect you shortly.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            handleClose()
            //   database.ref(`Notifications/${SUPERADMIN?.uid}`).push(notification);

            snackBarOpen("Request Sent Successfully", "success");

            submitProps.resetForm();
        } catch (error) {
            snackBarOpen(error.message, "error");
            console.log(error);
            submitProps.setSubmitting(false);
        }
    };



    return (
        <>
            <div className=' w-full '>
                <div className='relative'>
                    {
                        showCalendar ? (
                            <>
                            </>
                        ) : (
                            <Tooltip title="Back">
                                <button onClick={handleBack} className='text-red-500 text-sm h-fit p-1 absolute right-0 top-0 bg-red-100 rounded'><ArrowBackIcon /></button>
                            </Tooltip>
                        )
                    }
                </div>
                <div className=' flex justify-center items-center'>
                    {showCalendar && (
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-lg font-semibold text-center'>Select a Date</h2>
                            <Calendar

                                value={date}
                                // onChange={(value) => {
                                //     setBookingDate(prevData => ({ ...prevData, selectedDate: value }));
                                //     handleDateClick(value);
                                // }}
                                onChange={handleDateClick}


                                tileDisabled={({ date }) => isDisabled(date)}
                                // calendarType='ISO 8601'
                                className="custom-calendar"
                            />
                        </div>
                    )}
                    {showSlotSelection && (
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-lg font-medium text-center'>Please Select your preferred slot</h2>
                            <div className='flex flex-col gap-1 items-center h-72 overflow-y-auto overflow-x-hidden example '>
                                {
                                    timeSlots.map((slot, index) => (
                                        <div key={index}>
                                            <button className='px-20 py-2 rounded-3xl border border-[#2552a7] text-lg font-medium hover:text-white hover:bg-[#2552a7]' onClick={() => { handleSlotSelection(slot) }}>{slot}</button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                    }
                    {
                        showForm && (
                            <div className='flex flex-col gap-2'>
                                <h2 className='text-lg font-semibold text-center'>Confirm Booking</h2>
                                <div className=''>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={Yup.object(validationSchema)}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ isSubmitting, isValid, setFieldValue, values, errors }) => (
                                            <Form>
                                                <CardContent>
                                                    {ConfirmBooking.map((inputItem) => (
                                                        <TextInput
                                                            key={inputItem.key}
                                                            name={inputItem.name}
                                                            label={inputItem.label}
                                                            type={inputItem.type}
                                                        />
                                                    ))}

                                                    <div className="place-content-center">
                                                        <LoadingButton
                                                            className="mt-1vh gradient"
                                                            variant="contained"
                                                            type="submit"
                                                            loadingPosition="start"
                                                            startIcon={<Send />}
                                                            fullWidth
                                                            sx={{ color: "snow" }}
                                                        >
                                                            {isOtp ? 'Submit OTP' : 'Book Now'}
                                                        </LoadingButton>
                                                    </div>
                                                    {isOtp && (
                                                        <div>
                                                            {/* Render OTP input field here */}
                                                            <TextInput
                                                                name="otp"
                                                                label="OTP"
                                                                type="text"
                                                            />
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Form>
                                        )}
                                    </Formik>

                                </div>
                            </div>
                        )
                    }

                </div>
            </div>
        </>
    );
}

export default CalendarChooseSlot;
