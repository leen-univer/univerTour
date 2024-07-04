import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
// import ExportCsv from "@material-table/exporters/csv";
import { Cancel, Done } from "@mui/icons-material";
import { Card, CardContent, Chip, Typography } from "@mui/material";
import { SendNotification } from "components/dialog";
import { database } from "configs";
import { BASE_URL } from "configs/api";
import { useAppContext } from "contexts";
import { useRequestedUniversities } from "hooks";
import moment from "moment";
import { useState } from "react";
const RequestedUniversities = () => {
  const { snackBarOpen, sendMail } = useAppContext();
  const { requestedUniversities } = useRequestedUniversities();
  // console.log(requestedUniversities);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const handleBulkDelete = (data) => {
    data.forEach((item) => {
      database.ref(`RequestedUniversities/${item?.id}`).remove();
    });
  };
  const handleBulkReject = (data) => {
    data.forEach((item) => {
      if (item.isAccepted !== "accepted") {
        database
          .ref(`RequestedUniversities/${item?.id}`)
          .update({ isAccepted: "rejected" });
      } else {
        snackBarOpen("Already Accepted", "warning");
      }
    });
  };
  const handleBulkAccept = (data) => {
    data.forEach(async (item) => {
      const respond = await fetch(BASE_URL + "/post-api", {
        method: "POST",
        body: JSON.stringify({
          displayName: item?.displayName,
          email: item?.email?.trim(),
          phoneNumber: item?.phoneNumber,
          password: item?.password?.trim(),
          country: item?.country,
          location: item?.location,
          contactName: item?.contactName,
          website: item?.website,
          role: item?.role,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await respond.json();

      if (respond.status === 200) {
        // database

        //   .ref(`RequestedUniversities/${item?.id}`)
        //   .update({ isAccepted: "accepted" });
        // const notification = {
        // 	title: "Registration Accepted",
        // 	description: `Registration Accepted By Super Admin`,
        // 	read: false,
        // 	timestamp: new Date().toString(),
        // };
        sendMail({
          to: item?.email,
          subject: "Your Account Is Now Active!",
          html: `
													<p>
													We are pleased to inform you that your account has been activated by admin.<br/>
													<br/>
													Please login to your account on collegefairs.ae to ${item?.role === "school"
              ? `add your first college fair`
              : `view college fairs and start recruiting students!.`
            } <br/> 
													<br/>
													Univer Team
													</p>
													`,
        });
        // database.ref(`RequestedUniversities/${item?.id}`).push(notification);
        database.ref(`RequestedUniversities/${item?.id}`).remove();
        snackBarOpen("Accepted All Request", "success");
      } else {
        snackBarOpen(res?.error?.message, "error");
      }
    });
  };
  return (
    <section className="py-2">
      <MaterialTable
        data={requestedUniversities}
        title="Requested Universities"
        columns={[
          {
            title: "#",
            field: "sl",
            width: "10%",
          },
          {
            title: "University / School Name",
            field: "displayName",
          },
          { title: "Role", field: "role" },

          { title: "Email", field: "email", hidden: true, export: true },
          { title: "Password", field: "password", export: true },
          { title: "Phone", field: "phoneNumber" },
          {
            title: "Contact Person",
            field: "contactName",
            hidden: true,
            export: true,
          },
          { title: "Location", field: "location", hidden: true, export: true },

          { title: "Country", field: "country" },
          {
            title: "Status",
            render: ({ isAccepted }) =>
              isAccepted === "accepted" ? (
                <>
                  <Chip
                    label="Accepted"
                    color="success"
                    size="small"
                    variant="outlined"
                    icon={<Done />}
                  />
                </>
              ) : isAccepted === "rejected" ? (
                <>
                  <Chip
                    label="Rejected"
                    color="error"
                    size="small"
                    variant="outlined"
                    icon={<Cancel />}
                  />
                </>
              ) : (
                <Chip
                  label="Pending"
                  color="info"
                  size="small"
                  variant="outlined"
                // icon={< />}
                />
              ),
          },

          {
            title: "Created At",
            field: "timestamp",
            customSort: (a, b) =>
              new Date(b?.timestamp) - new Date(a?.timestamp),
            render: ({ timestamp }) =>
              moment(timestamp).format("Do MMM YYYY hh:mm A"),
            headerStyle: {
              textAlign: "center",
            },
            cellStyle: {
              textAlign: "center",
            },
          },
        ]}
        options={{
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
          selection: true,
          actionsColumnIndex: -1,
        }}
        style={{
          boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
          borderRadius: "8px",
        }}
        actions={[
          {
            tooltip: "Accept All Request",
            icon: "done",
            onClick: (evt, data) => handleBulkAccept(data),
          },
          {
            tooltip: "Cancel All Request",
            icon: "cancel",
            onClick: (evt, data) => handleBulkReject(data),
          },
          {
            tooltip: "Delete All University Request",
            icon: "delete",
            onClick: (evt, data) => handleBulkDelete(data),
          },
        ]}
        detailPanel={({ rowData }) => {
          return (
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
          );
        }}
        isLoading={!requestedUniversities}
      />
      <SendNotification
        selectedUsers={selectedUsers}
        handleClose={() => setSelectedUsers([])}
      />
    </section>
  );
};

export default RequestedUniversities;
