import { Download } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useFetch, useStudents } from "hooks";
import moment from "moment";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

const SelectCityDialogue = ({ open, handleClose }) => {
  const [allCities, setAllCities] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [countries, loading] = useFetch(`/Countries`, {
    needNested: false,
    needArray: true,
  });
  const { students } = useStudents();
  const upcomingEvents = [
    ...students?.filter((item) => item?.fairType === "SCHOOL VISIT"),
    ...students?.filter(
      (item) => item?.fairType === "ACTIVITY" || item?.fairType === "INFO"
    ),
  ];
  useEffect(() => {
    const reqdata = upcomingEvents
      ?.map((student, i) => ({
        ...student,
        startDate: new Date(
          new Date(student?.date).getFullYear(),
          new Date(student?.date).getMonth(),
          new Date(student?.date).getDate(),
          +student?.time?.split(":")[0],
          +student?.time?.split(":")[1]
        ),
        endDate: new Date(
          new Date(student?.date).getFullYear(),
          new Date(student?.date).getMonth(),
          new Date(student?.date).getDate(),
          +student?.endTime?.split(":")[0],
          +student?.endTime?.split(":")[1]
        ),
      }))
      .slice()
      ?.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (dateA < dateB) {
          return -1;
        } else if (dateA > dateB) {
          return 1;
        } else {
          // If dates are equal, compare the times
          const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
          const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
          return timeA - timeB;
        }
      })
      ?.map((student, i) => ({
        ...student,
        sl: i + 1,
        fairDate: student?.date ? moment(student?.date).format("LL") : "--",
      }));
    setStudentData(reqdata);
  }, [upcomingEvents?.length]);

  useEffect(() => {
    setAllCities(
      countries?.flatMap((country) => Object.values(country.cities))
    );
  }, [countries?.length]);

  console.log(allCities);

  const headers = [
    { label: "Fair Name", key: "fairName" },
    { label: "Student Id", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phoneNumber" },
    { label: "Age", key: "age" },
    { label: "Gender", key: "gender" },
    { label: "Nationality", key: "nationality" },
    { label: "Area Of Interest", key: "areaOfInterest" },
    { label: "Timestamp", key: "timestamp" },
  ];
  const formik = useFormik({
    initialValues: { city: "" },
    validationSchema: yup.object({
      city: yup.string().required("City is required!"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <Dialog open={Boolean(open)} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select City</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit} className="py-20">
          <Autocomplete
            disablePortal
            name="city"
            options={
              allCities?.length
                ? allCities
                    ?.map((data) => {
                      return { label: data?.cityName };
                    })
                    .filter((data) => data?.label)
                : []
            }
            onChange={(e, r) => {
              formik.setFieldValue("city", r?.label);
            }}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a city"
                name="city"
                onBlur={formik.handleBlur}
                error={formik.touched.city && formik.errors?.city}
                helperText={formik.touched?.city && formik.errors.city}
              />
            )}
          />
          <div className="flex justify-end">
            {/* <CSVLink
              filename="registered-student.csv"
              headers={headers}
              data={
                ([
                  ...students
                    ?.filter((student) => student?.students)
                    ?.flatMap((student) => getArrFromObj(student?.students)),
                  ...schoolFairs
                    ?.filter((student) => student?.students)
                    ?.flatMap((student) => getArrFromObj(student?.students)),
                ]?.length &&
                  [
                    ...students
                      ?.filter((fair) => fair?.students)
                      ?.flatMap((fair) =>
                        getArrFromObj({ ...fair?.students })?.map((item) => ({
                          ...item,
                          fairName: fair?.displayName,
                        }))
                      ),
                    ...schoolFairs
                      ?.filter((student) => student?.students)
                      ?.flatMap((fair) =>
                        getArrFromObj({ ...fair?.students })?.map((item) => ({
                          ...item,
                          fairName: fair?.displayName,
                        }))
                      ),
                  ]?.map((student) => {
                    return {
                      ...student,
                      Name: student?.name,
                      timestamp: moment(student?.timestamp).format("LLL"),
                    };
                  })) ||
                []
              }
            >
              <Button
                type="submit"
                className="!bg-theme"
                sx={{
                  marginTop: "10px",
                }}
                startIcon={<Download />}
                variant="contained"
              >
                Download
              </Button>
            </CSVLink> */}
            {/* <Button
              type="submit"
              className="!bg-theme"
              sx={{
                marginTop: "10px",
              }}
              startIcon={<Download />}
              variant="contained"
            >
              Download
            </Button> */}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SelectCityDialogue;
