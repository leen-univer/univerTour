import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
// import ExportCsv from "@material-table/exporters/csv";
import {
  Card,
  CardContent,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { SendNotification } from "components/dialog";
import { AddUniversityDrawer, EditUniversityDrawer } from "components/drawer";
import { database } from "configs";
import { BASE_URL } from "configs/api";
import { useAppContext } from "contexts";
import { useUniversities } from "hooks";
import moment from "moment";
import { useState } from "react";
import Swal from "sweetalert2";

const Schools = () => {
  const { snackBarOpen } = useAppContext();
  const [openAddUniversityDrawer, setOpenAddUniversityDrawer] = useState(false);
  const [openEditUniversityDrawer, setOpenEditUniversityDrawer] =
    useState(false);
  const { universities } = useUniversities();
  const Universities = universities.filter(
    (university) => university?.role === "school"
  );
  const [selectedUsers, setSelectedUsers] = useState([]);

  return (
    <section className="py-2">
      <AddUniversityDrawer
        open={openAddUniversityDrawer}
        setOpenAddUniversityDrawer={setOpenAddUniversityDrawer}
      />
      <EditUniversityDrawer
        open={openEditUniversityDrawer}
        setOpenEditUniversityDrawer={setOpenEditUniversityDrawer}
      />
      <MaterialTable
        data={Universities?.map((item, i) => ({ ...item, sl: i + 1 })) || []}
        title="Schools"
        columns={[
          {
            title: "#",
            field: "sl",
            // width: "10%",
          },
          {
            title: "School Name",
            field: "displayName",
            render: ({ displayName, email, picture }) => (
              <>
                <ListItem>
                  <ListItemText primary={displayName} secondary={`${email}`} />
                </ListItem>
              </>
            ),
          },
          { title: "Email", field: "email", export: true },
          { title: "Password", field: "password", export: true },
          { title: "Phone", field: "phoneNumber" },
          {
            title: "Contact Person",
            field: "contactName",
            hidden: true,
            export: true,
          },
          { title: "Location", field: "location", hidden: true, export: true },
          { title: "Country", field: "country", hidden: true, export: true },
          // {
          //   title: "Credits",
          //   field: "creditAmount",
          //   headerStyle: {
          //     textAlign: "center",
          //   },
          //   cellStyle: {
          //     textAlign: "center",
          //   },

          //   export: true,
          // },

          {
            title: "Created At",
            searchable: true,
            field: "timestamp",
            render: (rowData) =>
              moment(rowData?.timestamp).format("Do MMM YYYY hh:mm A"),
            filtering: false,
            editable: "never",
          },
        ]}
        detailPanel={[
          {
            tooltip: "University Info",
            icon: "info",
            render: ({ rowData }) => (
              <div
                style={{
                  padding: "20px",
                  margin: "auto",
                  backgroundColor: "#eef5f9",
                }}
              >
                <Card
                  sx={{
                    minWidth: 400,
                    maxWidth: 450,
                    transition: "0.3s",
                    margin: "auto",
                    borderRadius: "10px",
                    // fontFamily: italic,
                    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                    "&:hover": {
                      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body1"
                      component="p"
                      gutterBottom
                      align="left"
                    >
                      Location:{" "}
                      <span
                        style={{
                          color: "rgb(30, 136, 229)",
                          fontSize: "15px",
                        }}
                      >
                        {rowData?.location}
                      </span>
                    </Typography>

                    <Typography
                      variant="body1"
                      component="p"
                      gutterBottom
                      align="left"
                    >
                      Contact Person:{" "}
                      <span
                        style={{ color: "rgb(30, 136, 229)", fontSize: "15px" }}
                      >
                        {rowData?.contactName}
                      </span>
                    </Typography>
                    <Typography variant="body1" gutterBottom align="left">
                      Website:{" "}
                      <a
                        href={`${rowData?.website}`}
                        style={{ textDecoration: "none" }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {rowData?.website}{" "}
                      </a>
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ),
          },

          // {
          //   icon: "school",
          //   openIcon: "visibility",
          //   tooltip: "View Participated Fairs",
          //   render: ({ rowData }) => (
          //     <div
          //       style={{
          //         padding: "4vh",
          //         margin: "auto",
          //         backgroundColor: "#eef5f9",
          //       }}
          //     >
          //       <MaterialTable
          //         data={getArrFromObj(rowData?.upcomingFairs)
          //           .map((student, i) => ({
          //             ...student,
          //             startDate: new Date(
          //               new Date(student?.date).getFullYear(),
          //               new Date(student?.date).getMonth(),
          //               new Date(student?.date).getDate(),
          //               +student?.time?.split(":")[0],
          //               +student?.time?.split(":")[1]
          //             ),
          //             endDate: new Date(
          //               new Date(student?.date).getFullYear(),
          //               new Date(student?.date).getMonth(),
          //               new Date(student?.date).getDate(),
          //               +student?.endTime?.split(":")[0],
          //               +student?.endTime?.split(":")[1]
          //             ),
          //           }))
          //           .slice()
          //           ?.sort(
          //             (a, b) => new Date(a?.startDate) - new Date(b?.startDate)
          //           )
          //           .map((item, i) => ({ ...item, sl: i + 1 }))}
          //         title={`${rowData?.displayName} Participated Fairs`}
          //         columns={[
          //           {
          //             title: "#",
          //             field: "sl",
          //             width: "2%",
          //           },
          //           {
          //             title: "Fair Name",
          //             field: "displayName",
          //             searchable: true,
          //             render: ({ displayName }) => (
          //               <>
          //                 <ListItem>
          //                   <ListItemText
          //                     primary={displayName}
          //                     // secondary={`${email}`}
          //                   />
          //                 </ListItem>
          //               </>
          //             ),
          //           },
          //           {
          //             title: "City",
          //             searchable: true,
          //             field: "city",
          //           },
          //           {
          //             title: "School System",
          //             field: "schoolName",
          //             searchable: true,
          //             filtering: false,
          //           },
          //           {
          //             title: "Fair Date",
          //             searchable: true,
          //             field: "date",
          //             filtering: false,
          //             editable: "never",
          //             headerStyle: {
          //               textAlign: "center",
          //             },
          //             cellStyle: {
          //               textAlign: "center",
          //             },
          //             render: (rowData) => moment(rowData?.date).format("LL"),
          //           },
          //           { title: "Start Time", field: "time", emptyValue: "--" },
          //           {
          //             title: "End Time",
          //             field: "endTime",
          //             // headerStyle: {
          //             //   textAlign: "center",
          //             // },
          //             // cellStyle: {
          //             //   textAlign: "center",
          //             // },
          //             emptyValue: "--",
          //           },
          //           {
          //             title: "Number of Students",
          //             searchable: true,
          //             field: "studentCount",
          //             type: "numeric",
          //             filtering: false,
          //             headerStyle: {
          //               textAlign: "center",
          //             },
          //             cellStyle: {
          //               textAlign: "center",
          //             },
          //           },
          //           {
          //             title: "Participation Credit",
          //             searchable: true,
          //             field: "credits",
          //             type: "numeric",
          //             filtering: false,
          //             headerStyle: {
          //               textAlign: "center",
          //             },
          //             cellStyle: {
          //               textAlign: "center",
          //             },
          //           },
          //           {
          //             title: "Created At",
          //             searchable: true,
          //             field: "timestamp",
          //             render: ({ timestamp }) =>
          //               moment(timestamp).format("Do MMM YYYY hh:mm A"),
          //             customSort: (a, b) =>
          //               new Date(b?.timestamp) - new Date(a?.timestamp),
          //             filtering: false,
          //             editable: "never",
          //             headerStyle: {
          //               textAlign: "center",
          //             },
          //             cellStyle: {
          //               textAlign: "center",
          //             },
          //           },
          //         ]}
          //         options={{
          //           detailPanelColumnAlignment: "right",
          //           exportAllData: true,
          //           selection: false,
          //           exportMenu: [
          //             {
          //               label: "Export Users Data In CSV",
          //               exportFunc: (cols, data) =>
          //                 ExportCsv(
          //                   cols,
          //                   data,
          //                   `${rowData?.displayName} Participated Fairs`
          //                 ),
          //             },
          //             {
          //               label: "Export Users Data In PDF",
          //               exportFunc: (cols, data) =>
          //                 ExportPdf(
          //                   cols,
          //                   data,
          //                   `${rowData?.displayName} Participated Fairs`
          //                 ),
          //             },
          //           ],
          //           // selection: true,
          //           actionsColumnIndex: -1,
          //         }}
          //         style={{
          //           boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
          //           borderRadius: "8px",
          //         }}
          //       />
          //     </div>
          //   ),
          // },
        ]}
        options={{
          detailPanelColumnAlignment: "right",
          exportAllData: true,
          selection: true,
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
          // selection: true,
          actionsColumnIndex: -1,
        }}
        style={{
          boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
          borderRadius: "8px",
        }}
        editable={{
          onRowDelete: async (oldData) => {
            await database.ref(`Users/${oldData.id}`).remove();
            Swal.fire("Success!", "School Deleted Successfully", "success");
          },
        }}
        actions={[
          {
            tooltip: "Send notification to all selected users",
            icon: "send",
            onClick: (evt, data) => setSelectedUsers(data),
          },
          {
            tooltip: "Add University",
            icon: "add",
            isFreeAction: true,
            onClick: (evt, data) => setOpenAddUniversityDrawer(true),
          },
          {
            tooltip: "Edit University",
            icon: "edit",
            onClick: (evt, rowData) => {
              if (rowData.length > 1) {
                Swal.fire({
                  text: "Please Select One University",
                  icon: "warning",
                });
              } else {
                setOpenEditUniversityDrawer(rowData);
              }
            },
          },
        ]}
        isLoading={!Universities}
      />
      <SendNotification
        selectedUsers={selectedUsers}
        handleClose={() => setSelectedUsers([])}
      />
    </section>
  );
};

export default Schools;
