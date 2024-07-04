import { getArrFromObj } from "@ashirbad/js-core";
import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
import {
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle
} from "@mui/material";
import moment from "moment";

const ViewRegisterStudentDialog = ({ rowData, handleClose }) => {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={rowData}
      maxWidth="xl"
      fullWidth
      className=""
    >
      <DialogTitle className="" id="customized-dialog-title">
        <p className="text-center text-xl font-bold text-theme tracking-wide">
          Student Registrations
        </p>
      </DialogTitle>
      <DialogContent className="app-scrollbar" sx={{ p: 2 }}>
        <div className="md:w-full md:px-4 px-2 tracking-wide">
          <div
            style={{
              padding: "2px",
              margin: "auto",
              backgroundColor: "#eef5f9",
            }}
          >
            <CardContent>
              <div
                style={{
                  margin: "auto",
                  backgroundColor: "#eef5f9",
                }}
              >
                <MaterialTable
                  data={getArrFromObj(rowData?.students)
                    ?.sort(
                      (a, b) => new Date(b?.timestamp) - new Date(a?.timestamp)
                    )
                    .map((item, i) => ({ ...item, sl: i + 1 }))}
                  title="Registered Students"
                  columns={[
                    {
                      title: "#",
                      field: "sl",
                      width: "2%",
                    },
                    {
                      title: "Student Id",
                      searchable: true,
                      field: "id",
                      filtering: false,
                    },
                    {
                      title: "Name",
                      field: "name",
                      searchable: true,
                
                    },
                    {
                      title: "Email",
                      field: "email",
                      export: true,
                      searchable: true,
                  
                    },
                    {
                      title: "Phone",
                      field: "phoneNumber",
                      searchable: true,
                    
                    },
                    {
                      title: "Age",
                      field: "age",
                      export: true,
                  
                    },
                    {
                      title: "Gender",
                      field: "gender",
                      export: true,
              
                    },
                    {
                      title: "Nationality",
                      field: "nationality",
                      export: true,
                
                    },
                    {
                      title: "Area Of Interest",
                      field: "areaOfInterest",
                      export: true,
            
                    },
                    {
                      title: "Created At",
                      field: "timestamp",
                      editable: "never",
                      emptyValue: "--",
                      render: ({ timestamp }) =>
                        moment(timestamp).format("Do MMM YYYY hh:mm A"),
                    },

            
                  ]}
                  options={{
                    detailPanelColumnAlignment: "right",
                    exportAllData: true,
                    selection: false,
                    // toolbar: false,
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
                    boxShadow: "#6a1b9a3d 0px 0px 0px 0px",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </CardContent>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRegisterStudentDialog;
