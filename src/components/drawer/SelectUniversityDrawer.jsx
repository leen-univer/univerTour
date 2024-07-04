import { Download } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Container,
  Drawer,
  TextField,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useFetch, useStudents } from "hooks";
import moment from "moment";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import * as yup from "yup";

const SelectUniversityDrawer = ({ open, handleClose }) => {
  const theme = useTheme();
  const [currentCity, setCurrentCity] = useState("");
  const [allUniversities, setAllUniversities] = useState([]);
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
  console.log(upcomingEvents);

  useEffect(() => {
    setAllCities(
      countries?.flatMap((country) => Object.values(country.cities))
    );
  }, [countries?.length]);

  const headers = [
    { label: "Fair Name", key: "displayName" },
    { label: "City", key: "cityName" },
    { label: "Fair Date", key: "date" },
    { label: "Start Time", key: "startDate" },
    { label: "End Time", key: "endDate" },
    { label: "Number Of Students", key: "studentCount" },
  ];
  const formik = useFormik({
    initialValues: { university: "" },
    validationSchema: yup.object({
      city: yup.string().required("University is required!"),
    }),
    onSubmit: (values) => {
      const reqData = upcomingEvents
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
        }))
        ?.filter((data) => data?.cityName === values?.city);
      console.log(reqData);
    },
  });
  return (
    <>
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <Container
          className="!90vw !mt-12vh  "
          sx={{
            // width: "50vw",
            marginTop: "10vh",
            [theme.breakpoints.up("sm")]: {
              maxWidth: "50vw",
            },
            [theme.breakpoints.up("md")]: {
              maxWidth: "80vw",
            },
            [theme.breakpoints.up("lg")]: {
              maxWidth: "30vw",
            },
          }}
        >
          <form onSubmit={formik.handleSubmit} className="w-[18rem]">
            <h1 className="my-4">Select university </h1>
            <Autocomplete
              disablePortal
              fullWidth
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
                setCurrentCity(r?.label);
                formik.setFieldValue("university", r?.label);
              }}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select a university"
                  name="university"
                  onBlur={formik.handleBlur}
                  error={formik.touched.university && formik.errors?.university}
                  helperText={
                    formik.touched?.university && formik.errors.university
                  }
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
              <CSVLink
                filename="registered-student.csv"
                headers={headers}
                data={
                  upcomingEvents
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
                        const timeA = new Date(
                          `1970/01/01 ${a.time}`
                        ).getTime();
                        const timeB = new Date(
                          `1970/01/01 ${b.time}`
                        ).getTime();
                        return timeA - timeB;
                      }
                    })
                    ?.map((student, i) => ({
                      ...student,
                      sl: i + 1,
                      fairDate: student?.date
                        ? moment(student?.date).format("LL")
                        : "--",
                      startDate: student?.date
                        ? moment(student?.startDate).format("HH:MM A")
                        : "--",
                      endDate: student?.date
                        ? moment(student?.endDate).format("HH:MM A")
                        : "--",
                    }))
                    ?.filter((data) => data?.cityName === currentCity) || []
                }
              >
                <Button
                  // type="submit"
                  className="!bg-theme"
                  sx={{
                    marginTop: "10px",
                  }}
                  startIcon={<Download />}
                  variant="contained"
                >
                  Download
                </Button>
              </CSVLink>
            </div>
          </form>
        </Container>
      </Drawer>
    </>
  );
};

export default SelectUniversityDrawer;
