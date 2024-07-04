import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
// import ExportCsv from "@material-table/exporters/csv";
import { Cancel, Done } from "@mui/icons-material";
import { Button, Chip } from "@mui/material";
import { ParticipationCreditDialog } from "components/dialog";
import { AddStudentDrawer, EditStudentDrawer } from "components/drawer";
import RequestUniversityDrawer from "components/drawer/RequestUniversityDrawer";
import { database } from "configs";
import { useAppContext } from "contexts";
import { useFetch, useNestedRequestFairs } from "hooks";
import moment from "moment";
import { useState } from "react";
import Swal from "sweetalert2";

const SchoolFairRequests = () => {
  const [openAddStudentDrawer, setOpenAddStudentDrawer] = useState(false);
  const [openEditStudentDrawer, setOpenEditStudentDrawer] = useState(false);
  const [openRequestUniversityDrawer, setOpenRequestUniversityDrawer] =
    useState(false);
  const { requestFairs } = useNestedRequestFairs();
  const [bookings] = useFetch(`/Bookings`);
  console.log(bookings);

  const upcomingEvents = requestFairs?.filter(
    (item) => new Date(item?.date) >= new Date()
  );

  const { snackBarOpen } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);

  const handleSendReply = async (openDialog) => {
    try {
      await database.ref(`Bookings/${openDialog?.id}`).set({
        ...openDialog,
        timestamp: new Date().toString(),
        tableData: {},
        isAccepted: "accepted",
      });
      await database.ref(`/NewFairs/${openDialog?.id}`).set({
        ...openDialog,
        timestamp: new Date().toString(),
        tableData: {},
        isAccepted: "accepted",
      });

      // await database.ref(`Bookings/${openDialog?.id}`).remove();
      const notification = {
        title: "School visit Approved",
        description: `${openDialog?.displayName} fair is approved by Univer Team`,
        read: false,
        timestamp: new Date().toString(),
      };
      database.ref(`Notifications/${openDialog?.creatorId}`).push(notification);
      snackBarOpen("Fair Request Accepted", "success");
    } catch (error) {
      snackBarOpen(error.message, "error");
      console.log(error);
    }
  };

  const handleReject = async (row) => {
    try {
      Swal.fire({
        text: "Are you sure?",
        icon: "warning",

        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result?.isConfirmed) {
          await database.ref(`Bookings/${row?.id}`).update({
            isAccepted: "rejected",
          });
          snackBarOpen("Fair Rejected Successfully", "success");
        }
      });
    } catch (error) {
      snackBarOpen(error.message, "error");
      console.log(error);
    }
  };

  return (
    <section className="py-2">
      <ParticipationCreditDialog
        openDialog={openDialog}
        handleClose={() => setOpenDialog(false)}
      />
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
      <MaterialTable
        data={bookings
          ?.filter(
            (student) =>
              student.isAccepted === "pending" ||
              student.isAccepted === "rejected"
          )
          ?.map((student, i) => ({ ...student, sl: i + 1 }))}
        title="Fair Requests"
        columns={[
          {
            title: "#",
            field: "sl",
            editable: "never",
            filtering: false,
          },
          {
            title: "School Name",
            searchable: true,
            field: "schoolName",
            filtering: false,
          },
          {
            title: "Name",
            field: "firstName",
            searchable: true,
            hideFilterIcon: true,
            render: ({ firstName, lastName }) => {
              return (
                <>
                  <h1>{firstName}</h1>
                  <h2>{lastName}</h2>
                </>
              );
            },
          },
          {
            title: "City",
            searchable: true,
            field: "cityName",
          },
          {
            title: "Email",
            searchable: true,
            field: "email",
          },
          {
            title: "Date",
            searchable: true,
            field: "selectedDate",
            filtering: false,
            editable: "never",
            headerStyle: {
              textAlign: "center",
            },
            cellStyle: {
              textAlign: "center",
            },
            render: (rowData) => moment(rowData?.selectedDate).format("LL"),
          },
          {
            title: "Time",
            searchable: true,
            field: "time",
          },
          {
            title: "Status",
            render: ({ isAccepted }) =>
              isAccepted === "accepted" ? (
                <Chip
                  label="Accepted"
                  color="success"
                  size="small"
                  variant="outlined"
                  icon={<Done />}
                />
              ) : isAccepted === "rejected" ? (
                <Chip
                  label="Rejected"
                  color="error"
                  size="small"
                  variant="outlined"
                  icon={<Cancel />}
                />
              ) : (
                <Chip
                  label="Pending"
                  color="info"
                  size="small"
                  variant="outlined"
                />
              ),
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
            headerStyle: {
              textAlign: "center",
            },
            cellStyle: {
              textAlign: "center",
            },
          },
          {
            render: (row) => (
              <div style={{ display: "flex", gap: 5 }}>

                {
                  row?.isAccepted === "pending" ?
                    (
                      <p className="flex gap-2">
                        <Button
                          // color="success"
                          className="bg-green-500 text-white p-2 "
                          variant="contained"
                          size="small"
                          // disabled={row?.isAccepted === "rejected"}
                          startIcon={<Done />}

                          onClick={() => handleSendReply(row)}
                        >
                          Accept
                        </Button>
                        <Button
                          // color="error"
                          className="p-2 bg-red-500 text-white"
                          variant="contained"
                          size="small"
                          startIcon={<Cancel />}
                          onClick={() => handleReject(row)}
                        // disabled={row?.isAccepted === "rejected"}
                        >
                          Reject
                        </Button>
                      </p>) : row?.isAccepted === "rejected" ? <Button
                        // color="error"
                        className="p-3 bg-red-500 text-white w-full"
                        variant="contained"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => handleReject(row)}
                        disabled={row?.isAccepted === "rejected"}
                      >
                        Reject
                      </Button> : <Button
                        // color="success"
                        className="bg-green-500 text-white p-3 w-full "
                        variant="contained"
                        size="small"
                        disabled={row?.isAccepted === "rejected"}
                        startIcon={<Done />}

                        onClick={() => handleSendReply(row)}
                      >
                      Accept
                    </Button>

                }
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
              label: "Export Users Data In CSV",
              exportFunc: (cols, data) => ExportCsv(cols, data),
            },
            // {
            //   label: "Export Users Data In PDF",
            //   exportFunc: (cols, data) => ExportPdf(cols, data),
            // },
          ],
          actionsColumnIndex: -1,
        }}
        style={{
          boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
          borderRadius: "8px",
        }}
        
        isLoading={!requestFairs}
      />
    </section>
  );
};

export default SchoolFairRequests;
