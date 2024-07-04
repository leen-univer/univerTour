import React from "react";
import {
  Typography,
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Box,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import FlagIcon from "@mui/icons-material/Flag";
import InterestsIcon from "@mui/icons-material/Interests";
import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
import { getArrFromObj } from "@ashirbad/js-core";
import moment from "moment";

const ViewStudentpulsDialog = ({ rowData, handleClose }) => {
  const students = getArrFromObj(rowData?.students) || [];
  const totalStudents = students.length;
  const maleStudents = students.filter((student) => student.gender === "MALE").length;
  const femaleStudents = students.filter((student) => student.gender === "FEMALE").length;

  const countryCount = students.reduce((acc, student) => {
    acc[student.nationality] = (acc[student.nationality] || 0) + 1;
    return acc;
  }, {});

  const topCountries = Object.entries(countryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([country, count]) => ({ country, count }));

  const areaOfInterestCount = students.reduce((acc, student) => {
    acc[student.areaOfInterest] = (acc[student.areaOfInterest] || 0) + 1;
    return acc;
  }, {});

  const topAreasOfInterest = Object.entries(areaOfInterestCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([area, count]) => ({ area, count }));

  const nationalityOfAreaInterestCount = students.reduce((acc, student) => {
    acc[student.nationalityOfAreaInterest] = (acc[student.nationalityOfAreaInterest] || 0) + 1;
    return acc;
  }, {});

  const topNationalitiesOfAreaInterest = Object.entries(nationalityOfAreaInterestCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([nationality, count]) => ({ nationality, count }));

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={Boolean(rowData)} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
          <Typography variant="h6" sx={{ marginRight: 1 }}>Details Of Student Pulse /</Typography>
          <Typography variant="h6" color="textSecondary">{rowData?.displayName} / </Typography>
          <Typography variant="h6" color="textSecondary">{rowData?.countryName} / </Typography>
          <Typography variant="h6" color="textSecondary">{rowData?.cityName} </Typography>
        </Box>
      </DialogTitle>
      <DialogContent className="app-scrollbar" sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
        <CardContent>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: "#e0f7fa" }}>
                <CardHeader
                  avatar={<Avatar sx={{ backgroundColor: "#00796b" }}><SchoolIcon /></Avatar>}
                  title={<Typography variant="h6" sx={{ fontSize: "1rem" }}>Total Students</Typography>}
                  subheader={<Typography variant="h4" sx={{ fontSize: "1.5rem" }}>{totalStudents}</Typography>}
                />
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: "#fff3e0" }}>
                <CardHeader
                  avatar={<Avatar sx={{ backgroundColor: "#f57c00" }}><MaleIcon /></Avatar>}
                  title={<Typography variant="h6" sx={{ fontSize: "1rem" }}>Male Students</Typography>}
                  subheader={<Typography variant="h4" sx={{ fontSize: "1.5rem" }}>{maleStudents}</Typography>}
                />
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: "#f3e5f5" }}>
                <CardHeader
                  avatar={<Avatar sx={{ backgroundColor: "#8e24aa" }}><FemaleIcon /></Avatar>}
                  title={<Typography variant="h6" sx={{ fontSize: "1rem" }}>Female Students</Typography>}
                  subheader={<Typography variant="h4" sx={{ fontSize: "1.5rem" }}>{femaleStudents}</Typography>}
                />
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: "#ffebee" }}>
                <CardHeader
                  avatar={<Avatar sx={{ backgroundColor: "#d32f2f" }}><FlagIcon /></Avatar>}
                  title={<Typography variant="h6" sx={{ fontSize: "1rem" }}>Top 3 Nationalities</Typography>}
                />
                <CardContent>
                  {topCountries.map((countryInfo) => (
                    <Box key={countryInfo.country} display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="subtitle1">{countryInfo.country}</Typography>
                      <Typography variant="body1" color="textSecondary">{countryInfo.count} Students</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: "#e8f5e9" }}>
                <CardHeader
                  avatar={<Avatar sx={{ backgroundColor: "#388e3c" }}><InterestsIcon /></Avatar>}
                  title={<Typography variant="h6" sx={{ fontSize: "1rem" }}>Top 3 Areas of Interest</Typography>}
                />
                <CardContent>
                  {topAreasOfInterest.map((areaInfo) => (
                    <Box key={areaInfo.area} display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="subtitle1">{areaInfo.area}</Typography>
                      <Typography variant="body1" color="textSecondary">{areaInfo.count} Students</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: "#f1f8e9" }}>
                <CardHeader
                  avatar={<Avatar sx={{ backgroundColor: "#afb42b" }}><FlagIcon /></Avatar>}
                  title={<Typography variant="h6" sx={{ fontSize: "1rem" }}>Top 3 Country of Area Interest</Typography>}
                />
                <CardContent>
                  {topNationalitiesOfAreaInterest.map((nationalityInfo) => (
                    <Box key={nationalityInfo.nationality} display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="subtitle1">{nationalityInfo.nationality}</Typography>
                      <Typography variant="body1" color="textSecondary">{nationalityInfo.count} Students</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <div style={{ margin: "auto", backgroundColor: "#eef5f9" }}>
            <MaterialTable
              data={students.map((item, i) => ({
                ...item,
                sl: i + 1,
              }))}
              title="Details"
              columns={[
                { title: "#", field: "id", filtering: false },
                { title: "Gender", field: "gender", export: true },
                { title: "Nationality", field: "nationality", export: true },
                { title: "Area Of Interest", field: "areaOfInterest", export: true },
                { title: "Country Of Area Interest", field: "nationalityOfAreaInterest", export: true },
              ]}
              options={{
                detailPanelColumnAlignment: "right",
                exportAllData: true,
                selection: false,
                exportMenu: [
                  { label: "Export Users Data In CSV", exportFunc: (cols, data) => ExportCsv(cols, data) },
                ],
                actionsColumnIndex: -1,
              }}
              style={{ boxShadow: "#6a1b9a3d 0px 0px 0px 0px", borderRadius: "8px" }}
            />
          </div>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStudentpulsDialog;
