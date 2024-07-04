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

export default Schools;
