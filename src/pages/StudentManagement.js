import React, { useState, useEffect } from "react";
import { Typography, IconButton, Tooltip } from "@mui/material";
import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
import { ContentCopy, Info, Person } from "@mui/icons-material";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { Avatar } from "@mui/material";
import { getArrFromObj } from "@ashirbad/js-core";
import { countries } from "configs";
import ViewStudentPulsDialog from "../components/dialog/ViewStudentPulsDialog";
import ViewRegisterStudentDialog from "../components/dialog/ViewRegisteredStudentDialog";

import { ViewItineraryDialog } from "components/dialog";
import { AddStudentDrawer, EditStudentDrawer } from "components/drawer";
import RequestUniversityDrawer from "components/drawer/RequestUniversityDrawer";
import { database } from "configs";
import { useAppContext } from "contexts";
import { useFetch, useStudents, useUniversities } from "hooks";
import moment from "moment";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { ArrowDropDown } from "@mui/icons-material";

const Leads = () => {
  const [openAddStudentDrawer, setOpenAddStudentDrawer] = useState(false);
  const [openEditStudentDrawer, setOpenEditStudentDrawer] = useState(false);
  const [openRequestUniversityDrawer, setOpenRequestUniversityDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStudent, setOpenStudent] = useState(false);
  const [openStudentS, setOpenStudents] = useState(false);
  const [data, setData] = useState([]);
  const { students } = useStudents();
  const { snackBarOpen } = useAppContext();
  const { sendNotification, sendMail } = useAppContext();
  const { universities } = useUniversities();
  const Universities = universities.filter(university => university?.role === "university");
 
  useEffect(() => {
    const fetchData = async () => {
      try {

        const snapshot = await database.ref(`/NewFairs`).once("value");
        const data = snapshot.val();

        if (data) {
          console.log(data)
          const processedData = await Promise.all(Object.keys(data).map(async (key) => {
            const studentsSnapshot = await database.ref(`/NewFairs/${key}/forms/studentMajorForm/students`).once("value");
            const studentsData = studentsSnapshot.val();
            const studentsSnapshot2 = await database.ref(`/NewFairs/${key}/students`).once("value");
            const studentsData2 = studentsSnapshot2.val();
            const studentsList = studentsData ? Object.values(studentsData) : [];
            const studentsList2 = studentsData2 ? Object.values(studentsData2) : [];
console.log("2",studentsData2);
console.log("1",studentsData);
            
            return {
              ...data[key],
              id: key,
              students: studentsList2,
              studentsleen:studentsList
            };
          }));

          setData(processedData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };

    fetchData();
  }, []);

  const hasEventStarted = (date, time) => {
    const eventStartTime = moment(`${date} ${time}`);
    const currentTime = moment();

    const hoursUntilEvent = eventStartTime.diff(currentTime, "hours");

    return hoursUntilEvent <= 0 || hoursUntilEvent <= 24;
  };

  return (
    
    <section className="py-2">
      <RequestUniversityDrawer
        open={openRequestUniversityDrawer}
        setOpenRequestUniversityDrawer={setOpenRequestUniversityDrawer}
      />
      <AddStudentDrawer
        open={openAddStudentDrawer}
        setOpenAddStudentDrawer={setOpenAddStudentDrawer}
      />
      <EditStudentDrawer
        open={openEditStudentDrawer}
        setOpenEditStudentDrawer={setOpenEditStudentDrawer}
      />
      <ViewItineraryDialog
        rowData={openDialog}
        handleClose={() => setOpenDialog(false)}
      />
 
      <ViewRegisterStudentDialog
        rowData={openStudentS}
        handleClose={() => setOpenStudents(false)}
      />
     <ViewStudentPulsDialog
          rowData={openStudent}
          handleClose={() => setOpenStudent(false)}
      />
      <MaterialTable
        data={data
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
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
        title="Events"
        columns={[
          {
            title: "#",
            field: "sl",
            editable: "never",
            filtering: false,
          },
          {
            title: "Image",
            searchable: true,
            field: "imageURL",
            filtering: false,
            render: ({ imageURL, displayName }) =>
              imageURL ? (
                <Avatar
                  src={imageURL}
                  className="!h-full !w-full"
                  variant="rounded"
                >
                  {displayName?.[0]}
                </Avatar>
              ) : (
                <Avatar
                  src={imageURL}
                  className="!h-24 !w-32"
                  variant="rounded"
                >
                  {displayName?.[0]}
                </Avatar>
              ),
          },
          {
            title: "Name",
            searchable: true,
            field: "displayName",
            filtering: false,
          },
          {
            title: "Fair Type",
            field: "fairType",
            editable: "never",
            emptyValue: "--",
            render: (rowData) => (
              <div
                className={`${
                  rowData?.fairType === "SCHOOL VISIT"
                    ? "bg-teal-400"
                    : rowData?.fairType === "ACTIVITY"
                    ? "bg-lime-400"
                    : "bg-cyan-400"
                } p-[1.7rem] rounded-md text-center text-sm font-semibold`}
              >
                {rowData?.fairType}
              </div>
            ),
          },
          {
            title: "Country",
            searchable: true,
            field: "countryName",
            filtering: false,
            emptyValue: "--",
          },
          {
            title: "City",
            searchable: true,
            field: "cityName",
            filtering: false,
            emptyValue: "--",
          },
          {
            title: "School System",
            field: "schoolName",
            searchable: true,
            filtering: false,
            emptyValue: "--",
          },
          {
            title: "Fair Date",
            searchable: true,
            field: "date",
            filtering: true,
            type: "date",
            editable: "never",
            emptyValue: "--",

            render: (rowData) =>
              rowData?.date ? moment(rowData?.date).format("LL") : "--",
          },
          {
            title: "Start Time",
            field: "time",
            emptyValue: "--",
            filtering: false,
            render: (rowwData) => rowwData?.time,
          },
          {
            title: "End Time",
            field: "endTime",
            emptyValue: "--",
            filtering: false,
          },
          {
            title: "Number of Students",
            searchable: true,
            field: "studentCount",
            type: "numeric",
            filtering: false,
            emptyValue: "--",
          },
          {
            title: "Created At",
            searchable: true,
            field: "timestamp",
            render: ({ timestamp }) =>
              moment(timestamp).format("Do MMM YYYY hh:mm A"),
            customSort: (a, b) =>
              new Date(b?.timestamp) - new Date(a?.timestamp),
            filtering: false,
            editable: "never",
          },

          {
            title: "",
            field: "fairType",
            render: (rowData) =>
              rowData?.fairType === "SCHOOL VISIT" && (
                <div className="flex ">
                  <CloneEvent rowData={rowData} />
                  <div className=" ">
                    <Tooltip title="View Event Details">
                      <IconButton onClick={() => setOpenDialog(rowData)}>
                        <Info />
                      </IconButton>
                    </Tooltip>
                  </div>
                  {rowData?.students?.length ? (
                    <div className="">
                      <Tooltip title="View Registered Student">
                        <IconButton onClick={() => setOpenStudents(rowData)}>
                          <Person />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ) : null}  
                  {rowData?.studentsleen?.length ? (
                    <div className="">
                      <Tooltip title="View Students Pulse">
                        <IconButton onClick={() => setOpenStudent(rowData)}>
                          <FactCheckIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ) : null}             
           </div>
              ),
          },
        ]}
        options={{
          detailPanelColumnAlignment: "right",
          filtering: false,
          sorting: true,
          exportAllData: true,
          exportMenu: [
            {
              label: "Export Events Data In CSV",
              exportFunc: (cols, data) => ExportCsv(cols, data),
            },
          ],
          actionsColumnIndex: -1,
        }}
        style={{
          boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
          borderRadius: "8px",
        }}
        editable={{
          onRowDelete: async (oldData) => {
            try {
              const usersRef = database.ref("Users");
              const snapshot = await usersRef.once("value");
              const usersData = snapshot.val();
              for (const uid in usersData) {
                const user = usersData[uid];

                if (user.upcomingFairs && user.upcomingFairs[oldData?.id]) {
                  await usersRef
                    .child(`${uid}/upcomingFairs/${oldData?.id}`)
                    .remove();
                }
              }
              await database.ref(`NewFairs/${oldData.id}`).remove();
              snackBarOpen(
                `Fair  ${oldData.displayName} Deleted Successfully`,
                "success"
              );
            } catch (error) {
              snackBarOpen(error.message, "error");
              console.log(error);
            }
          },
        }}
        actions={[
          {
            icon: "add",
            tooltip: <strong>{"Add New Fair"}</strong>,
            isFreeAction: true,
            onClick: (evt, rowData) => setOpenAddStudentDrawer(true),
          },
          {
            icon: "edit",
            tooltip: <strong>{"Edit Fair"}</strong>,
            onClick: (evt, rowData) => setOpenEditStudentDrawer(rowData),
          },
        ]}
        isLoading={!students}
      />
    </section>
  );
};

export default Leads;

const CloneEvent = ({ rowData }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAppContext();
  const fairId = new Date().getTime();

  const handleCloneEvent = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to clone this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clone it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { value: text } = await Swal.fire({
            title: "Enter Fair Date",
            text: "Please provide date as given format.",
            icon: "warning",
            input: "text",
            inputPlaceholder: "YYYY-MM-DD",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Proceed",
          });

          if (text) {
            setLoading(true);
            await database.ref(`NewFairs/${fairId}`).update({
              cityName: rowData?.cityName,
              city: rowData?.city || "",
              fairType: "SCHOOL VISIT",
              imageURL: rowData?.imageURL || "",
              country: rowData?.country || "",
              countryName: rowData?.countryName || "",
              createdBy: user?.role,
              date: text || rowData?.date,
              displayName: rowData?.displayName || "",
              studentCount: rowData?.studentCount || 0,
              endTime: rowData?.endTime || "",
              time: rowData?.time || "",
              timestamp: new Date().toString(),
              createdSchoolName: user?.displayName,
              schoolName: rowData?.schoolName || "",
              creatorId: user?.uid,
              link: rowData?.link || "",
              notes: rowData?.notes || "",
              regLink: `https://www.univertours.com/admin/${rowData?.displayName}/${user?.uid}/${fairId}`,
              MajorUrl: `https://www.univertours.com/StudentMajorReg/${rowData.displayName}/${fairId}/${rowData.cityName}/${rowData.countryName}`,
            });

            setLoading(false);
            Swal.fire({
              title: "Created!",
              text: "Event clone created successfully.",
              icon: "success",
            });
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className=" ">
      <Tooltip title="Clone this event?">
        <IconButton onClick={handleCloneEvent}>
          <ContentCopy />
        </IconButton>
      </Tooltip>
    </div>
  );
};
