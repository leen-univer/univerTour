import { getArrFromObj } from "@ashirbad/js-core";
import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
// import ExportCsv from "@material-table/exporters/csv";
import {
  Delete,
  Description,
  Image,
  InsertDriveFile,
  Visibility,
} from "@mui/icons-material";
import EditNoteIcon from "@mui/icons-material/EditNote";

import {
  Avatar,
  Card,
  CardContent,
  IconButton,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { DOC } from "assets";
import { NoDatas } from "components/core";
import IOSSwitch from "components/core/IOSSwitch";
import { SendNotification } from "components/dialog";
import AddSuperAdminNote from "components/dialog/AddSuperAdminNote";
import {
  AddDocumentDrawer,
  AddImageDrawer,
  AddUniversityDrawer,
  EditUniversityDrawer,
} from "components/drawer";
import { database, storage } from "configs";
import { BASE_URL } from "configs/api";
import { useAppContext } from "contexts";
import { useFetch, useUniversities } from "hooks";
import moment from "moment";
import { useState } from "react";
import Swal from "sweetalert2";
import { toggleStatus } from "utils";

const Universities = () => {
  const { snackBarOpen } = useAppContext();
  const [openAddUniversityDrawer, setOpenAddUniversityDrawer] = useState(false);
  const [openAddDocumentDrawer, setOpenAddDocumentDrawer] = useState(false);
  const [openAddImageDrawer, setOpenAddImageDrawer] = useState(false);
  const [addReview, setAddReview] = useState(false);
  const [openEditUniversityDrawer, setOpenEditUniversityDrawer] =
    useState(false);
  const { universities } = useUniversities();
  const Universities = universities.filter(
    (university) => university?.role === "university"
  );
  console.log(Universities);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [id, setId] = useState();

  const [countries] = useFetch(`/Countries`);
  const AllCities = countries?.flatMap((country) =>
    getArrFromObj(country?.cities)
  );
  // const [allowAccess, setAllowAccess] = useState(false);

  // const () => setAllowAccess((prev) => !prev) = () => {
  //   setAllowAccess((prev) => !prev);
  // };

  return (
    <section className="py-2">
      <AddSuperAdminNote
        handleClose={() => setAddReview(false)}
        addReview={addReview}
        id={id}
      />
      <AddUniversityDrawer
        open={openAddUniversityDrawer}
        setOpenAddUniversityDrawer={setOpenAddUniversityDrawer}
      />
      <AddDocumentDrawer
        open={openAddDocumentDrawer}
        setOpenAddDocumentDrawer={setOpenAddDocumentDrawer}
      />
      <AddImageDrawer
        open={openAddImageDrawer}
        setOpenAddImageDrawer={setOpenAddImageDrawer}
      />
      <EditUniversityDrawer
        open={openEditUniversityDrawer}
        setOpenEditUniversityDrawer={setOpenEditUniversityDrawer}
      />
      <MaterialTable
        data={Universities.map((item, i) => ({ ...item, sl: i + 1 })) || []}
        title="Universities"
        columns={[
          {
            title: "#",
            field: "sl",
            width: "10%",
          },
          {
            title: "University Name",
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
          //   {
          //     title: "Credits",
          //     field: "creditAmount",
          //     headerStyle: {
          //       textAlign: "center",
          //     },
          //     cellStyle: {
          //       textAlign: "center",
          //     },

          //     export: true,
          //   },
          {
            title: "Add Document",
            field: "document",
            render: (data) => {
              return (
                <div className="flex gap-1">
                  <Tooltip title="Upload Document">
                    <Avatar
                      // onClick={() => setOpenAddCustomerDrawer(row)}
                      onClick={() => setOpenAddDocumentDrawer(data)}
                      variant="rounded"
                      className="!mr-0.5 !ml-0.5 !cursor-pointer !bg-[#2552a7] !p-0"
                      sx={{
                        mr: ".1vw",
                        padding: "0px !important",
                        backgroundColor: "Highlight",
                        cursor: "pointer",
                        color: "",
                      }}
                    >
                      <Description sx={{ padding: "0px !important" }} />
                    </Avatar>
                  </Tooltip>
                  <Tooltip title="Add Reviews">
                    <Avatar
                      // onClick={() => setOpenAddCustomerDrawer(row)}
                      onClick={() => {
                        setAddReview(true);
                        setId(data?.id);
                      }}
                      variant="rounded"
                      className="!mr-0.5 !ml-0.5 !cursor-pointer !bg-[#9849d1] !p-0"
                      sx={{
                        mr: ".1vw",
                        padding: "0px !important",
                        backgroundColor: "Highlight",
                        cursor: "pointer",
                        color: "",
                      }}
                    >
                      <EditNoteIcon sx={{ padding: "0px !important" }} />
                    </Avatar>
                  </Tooltip>
                </div>
              );
            },
            export: true,
          },
          {
            title: "Add Image",
            field: "image",
            hidden: true,
            render: (data) => {
              return (
                <div className="flex gap-1">
                  <>
                    <Tooltip title="Upload Image">
                      <Avatar
                        // onClick={() => setOpenAddCustomerDrawer(row)}
                        onClick={() => setOpenAddImageDrawer(data)}
                        variant="rounded"
                        className="!mr-0.5 !ml-0.5 !cursor-pointer !bg-purple-700 !p-0"
                        sx={{
                          mr: ".1vw",
                          padding: "0px !important",
                          backgroundColor: "Highlight",
                          cursor: "pointer",
                          color: "",
                        }}
                      >
                        <Image sx={{ padding: "0px !important" }} />
                      </Avatar>
                    </Tooltip>
                  </>
                </div>
              );
            },
            export: true,
          },
          {
            title: "Created At",
            field: "created_at",
            emptyValue: "--",
            render: ({ created_at }) =>
              moment(created_at).format("Do MMM YYYY hh:mm A"),
            customSort: (a, b) =>
              new Date(b?.timestamp) - new Date(a?.timestamp),
            headerStyle: {
              textAlign: "center",
            },
            cellStyle: {
              textAlign: "center",
            },
          },
        ]}
        detailPanel={[
          {
            tooltip: "View Documents ",
            icon: () => <InsertDriveFile />,
            openIcon: () => <Visibility />,
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
                    minWidth: 900,
                    maxWidth: 950,
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
                    <Typography gutterBottom align="left">
                      Docs :
                      <div className="grid grid-cols-5 gap-2">
                        {getArrFromObj(rowData?.documents)?.length ? (
                          getArrFromObj(rowData?.documents)?.map((item, i) => (
                            <div className="w-full h-full rounded-lg flex flex-col justify-center items-center border border-gray-300 shadow-xl">
                              <div className="bg-white relative p-4" key={i}>
                                <div
                                  className="w-16 cursor-pointer"
                                  onClick={() => window.open(item?.docURL)}
                                >
                                  <img src={DOC} alt="" />
                                </div>
                                <span className="text-sm text-gray-600">
                                  {/* {item?.docName} */}
                                </span>
                                <h1 className="mt-2 text-xs font-semibold">
                                  Document Name :
                                </h1>
                                <span className="text-xs text-gray-600">
                                  {item?.docName}
                                </span>
                                <h1 className="mt-2 text-xs font-semibold">
                                  Created At :
                                </h1>
                                <span className="text-xs text-gray-600">
                                  {moment(item?.timestamp).format("lll")}
                                </span>

                                <Tooltip title="Delete Document">
                                  <div className="absolute top-1 right-0 text-sm bg-red-600 h-7 w-7 rounded-md flex justify-center items-center cursor-pointer">
                                    <IconButton>
                                      <Delete
                                        fontSize="small"
                                        onClick={() => {
                                          try {
                                            Swal.fire({
                                              text: "Are you sure?",
                                              icon: "warning",
                                              confirmButtonText: "OK",
                                            }).then(async (result) => {
                                              if (result?.isConfirmed) {
                                                await database
                                                  .ref(
                                                    `Users/${rowData?.uid}/documents/${item?.id}`
                                                  )
                                                  .remove();
                                                const storageRef =
                                                  storage.ref();
                                                const fileRef =
                                                  storageRef.child(
                                                    `documents/${item?.docRef}`
                                                  );
                                                await fileRef.delete();
                                                snackBarOpen(
                                                  "Document Deleted Successfully",
                                                  "success"
                                                );
                                              }
                                            });
                                          } catch (e) {
                                            console.log(e);
                                          }
                                        }}
                                        className="!text-white"
                                      />
                                    </IconButton>
                                  </div>
                                </Tooltip>
                              </div>
                            </div>
                          ))
                        ) : (
                          <NoDatas title="No Documents Found" />
                        )}
                      </div>
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ),
          },
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
                    <Typography variant="body1" gutterBottom align="left">
                      Allow or Access the school information :{" "}
                      <IOSSwitch
                        checked={rowData?.isAccepted}
                        isBlocked={rowData?.isAccepted}
                        onChange={() =>
                          toggleStatus(
                            `Users/${rowData?.id}`,
                            !rowData?.isAccepted
                          )
                        }
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ),
          },

          {
            icon: "location_city",
            openIcon: "visibility",
            tooltip: "View  Cities",
            render: ({ rowData }) => (
              <div
                style={{
                  padding: "4vh",
                  margin: "auto",
                  backgroundColor: "#eef5f9",
                }}
              >
                <MaterialTable
                  data={AllCities?.filter((city) =>
                    rowData?.cities?.includes(city?.id)
                  )?.map((item, i) => ({
                    ...item,
                    sl: i + 1,
                  }))}
                  title={`Cities`}
                  columns={[
                    {
                      title: "#",
                      field: "sl",
                      //   width: "2%",
                    },
                    {
                      title: "City Name",
                      field: "cityName",
                      searchable: true,
                    },

                    // {
                    //   title: "City",
                    //   searchable: true,
                    //   field: "city",
                    // },
                    // {
                    //   title: "School System",
                    //   field: "schoolName",
                    //   searchable: true,
                    //   filtering: false,
                    // },
                    // {
                    //   title: "Fair Date",
                    //   searchable: true,
                    //   field: "date",
                    //   filtering: false,
                    //   editable: "never",
                    //   headerStyle: {
                    //     textAlign: "center",
                    //   },
                    //   cellStyle: {
                    //     textAlign: "center",
                    //   },
                    //   render: (rowData) => moment(rowData?.date).format("LL"),
                    // },
                    // { title: "Start Time", field: "time", emptyValue: "--" },
                    // {
                    //   title: "End Time",
                    //   field: "endTime",
                    //   // headerStyle: {
                    //   //   textAlign: "center",
                    //   // },
                    //   // cellStyle: {
                    //   //   textAlign: "center",
                    //   // },
                    //   emptyValue: "--",
                    // },
                    // {
                    //   title: "Number of Students",
                    //   searchable: true,
                    //   field: "studentCount",
                    //   type: "numeric",
                    //   filtering: false,
                    //   headerStyle: {
                    //     textAlign: "center",
                    //   },
                    //   cellStyle: {
                    //     textAlign: "center",
                    //   },
                    // },
                    // {
                    //   title: "Participation Credit",
                    //   searchable: true,
                    //   field: "credits",
                    //   type: "numeric",
                    //   filtering: false,
                    //   headerStyle: {
                    //     textAlign: "center",
                    //   },
                    //   cellStyle: {
                    //     textAlign: "center",
                    //   },
                    // },
                    // {
                    //   title: "Created At",
                    //   searchable: true,
                    //   field: "timestamp",
                    //   render: ({ timestamp }) =>
                    //     moment(timestamp).format("Do MMM YYYY hh:mm A"),
                    //   customSort: (a, b) =>
                    //     new Date(b?.timestamp) - new Date(a?.timestamp),
                    //   filtering: false,
                    //   editable: "never",
                    //   headerStyle: {
                    //     textAlign: "center",
                    //   },
                    //   cellStyle: {
                    //     textAlign: "center",
                    //   },
                    // },
                  ]}
                  options={{
                    detailPanelColumnAlignment: "right",
                    exportAllData: true,
                    selection: false,
                    headerStyle: {
                      backgroundColor: "#f2f2f2", // Header background color
                      color: "#333", // Header text color
                      fontWeight: "bold", // Header font weight
                      fontSize: "14px", // Header font size
                      // ... (other styles)
                    },

                    exportMenu: [
                      {
                        label: "Export Users Data In CSV",
                        exportFunc: (cols, data) =>
                          ExportCsv(
                            cols,
                            data,
                            `${rowData?.displayName} Participated Fairs`
                          ),
                      },
                    ],
                    // selection: true,
                    actionsColumnIndex: -1,
                  }}
                  style={{
                    boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
                    borderRadius: "8px",
                  }}
                />
              </div>
            ),
          },
        ]}
        options={{
          detailPanelColumnAlignment: "right",
          exportAllData: true,
          selection: true,
          headerStyle: {
            backgroundColor: "#f2f2f2", // Header background color
            color: "#333", // Header text color
            fontWeight: "bold", // Header font weight
            fontSize: "14px", // Header font size
            // ... (other styles)
          },

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
            const respond = await fetch(BASE_URL + "/delete-api", {
              method: "POST",
              body: JSON.stringify({ uidS: [oldData.uid] }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const res = await respond.json();
            console.log(res);
            if (respond.status === 200) {
              snackBarOpen("University Deleted Successfully", "success");
            } else {
              snackBarOpen(res?.error?.message, "error");
            }
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

export default Universities;
