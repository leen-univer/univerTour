import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Box,
  Grid,
} from '@mui/material';
import { database } from 'configs';
import { School, Group, AccountCircle } from '@mui/icons-material'; // Import Material-UI icons

const CityDetailsDialog = ({ open, setOpen, cityData, fairId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0); // State for total students
  const [topNationalities, setTopNationalities] = useState([]);
  const [topAreasOfInterest, setTopAreasOfInterest] = useState([]);
  const [topCountriesOfAreaInterest, setTopCountriesOfAreaInterest] = useState([]);
  const cityName = open.cityName;

  useEffect(() => {
    const fetchStudents = async () => {
      if (open) {
        setLoading(true);
        try {
          const studentsArray = [];
          let maleCountTemp = 0;
          let femaleCountTemp = 0;
          const nationalityCounts = {};
          const areaOfInterestCounts = {};
          const countryOfAreaInterestCounts = {};

          const fairsSnapshot = await database.ref(`/NewFairs`).once('value');
          const fairsData = fairsSnapshot.val();

          if (fairsData) {
            for (const fairId in fairsData) {
              const studentsSnapshot = await database.ref(`/NewFairs/${fairId}/forms/studentMajorForm/students`).once('value');
              const students = studentsSnapshot.val();

              if (students) {
                for (const studentId in students) {
                  const student = students[studentId];
                  if (fairsData[fairId].cityName === cityName) {
                    studentsArray.push(student);
                    if (student.gender === 'MALE') {
                      maleCountTemp++;
                    } else if (student.gender === 'FEMALE') {
                      femaleCountTemp++;
                    }
                    if (student.nationality) {
                      if (nationalityCounts[student.nationality]) {
                        nationalityCounts[student.nationality]++;
                      } else {
                        nationalityCounts[student.nationality] = 1;
                      }
                    }
                    if (student.areaOfInterest) {
                      if (areaOfInterestCounts[student.areaOfInterest]) {
                        areaOfInterestCounts[student.areaOfInterest]++;
                      } else {
                        areaOfInterestCounts[student.areaOfInterest] = 1;
                      }
                    }
                    if (student.nationalityOfAreaInterest) {
                      if (countryOfAreaInterestCounts[student.nationalityOfAreaInterest]) {
                        countryOfAreaInterestCounts[student.nationalityOfAreaInterest]++;
                      } else {
                        countryOfAreaInterestCounts[student.nationalityOfAreaInterest] = 1;
                      }
                    }
                  } else {
                    console.warn(`Student ${studentId} has no country field`);
                  }
                }
              }
            }
          }

          setStudents(studentsArray);
          setMaleCount(maleCountTemp);
          setFemaleCount(femaleCountTemp);

          // Calculate total students
          const totalStudentsCount = maleCountTemp + femaleCountTemp;
          setTotalStudents(totalStudentsCount);

          // Calculate top 3 nationalities
          const sortedNationalities = Object.entries(nationalityCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([nationality, count]) => ({ nationality, count }));
          setTopNationalities(sortedNationalities);

          // Calculate top 3 areas of interest
          const sortedAreasOfInterest = Object.entries(areaOfInterestCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([areaOfInterest, count]) => ({ areaOfInterest, count }));
          setTopAreasOfInterest(sortedAreasOfInterest);

          // Calculate top 3 countries of area interest
          const sortedCountriesOfAreaInterest = Object.entries(countryOfAreaInterestCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([countryOfAreaInterest, count]) => ({ countryOfAreaInterest, count }));
          setTopCountriesOfAreaInterest(sortedCountriesOfAreaInterest);

        } catch (error) {
          console.error('Error fetching students data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStudents();
  }, [open, cityData, fairId]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle style={{textAlign:'center'}}>Students Details for {cityName}</DialogTitle>
      <DialogContent>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: "#f3e5f5"}}>
                <CardHeader
                  avatar={<School />}
                  title={<Typography variant="h6">Total Students: {totalStudents}</Typography>}
                />
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: "#e0f7fa"}}>
                <CardHeader
                  avatar={<Group />}
                  title={<Typography variant="h6">Male Students: {maleCount}</Typography>}
                />
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: "#fff3e0"}}>
                <CardHeader
                  avatar={<Group />}
                  title={<Typography variant="h6">Female Students: {femaleCount}</Typography>}
                />
              </Card>
            </Grid>
       
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: "#ffebee" , width: 250, height: 250}}>
                <CardHeader
                  avatar={<AccountCircle />}
                  title={<Typography variant="h6">Top 3 Nationalities:</Typography>}
                />
                <CardContent>
                  <ul>
                    {topNationalities.map((item, index) => (
                      <li key={index}>{item.nationality}: {item.count}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: "#e8f5e9", width: 250, height: 250 }}>
                <CardHeader
                  avatar={<AccountCircle />}
                  title={<Typography variant="h6">Top 3 Areas of Interest:</Typography>}
                />
                <CardContent>
                  <ul>
                    {topAreasOfInterest.map((item, index) => (
                      <li key={index}>{item.areaOfInterest}: {item.count}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: "#e0f2f1" , width: 250, height: 250}}>
                <CardHeader
                  avatar={<AccountCircle />}
                  title={<Typography variant="h6">Top 3 Countries of Area Interest:</Typography>}
                />
                <CardContent>
                  <ul>
                    {topCountriesOfAreaInterest.map((item, index) => (
                      <li key={index}>{item.countryOfAreaInterest}: {item.count}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Area of Interest</TableCell>
                      <TableCell>Nationality</TableCell>
                      <TableCell>Country Of Area Interest</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={student.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell>{student.areaOfInterest}</TableCell>
                        <TableCell>{student.nationality}</TableCell>
                        <TableCell>{student.nationalityOfAreaInterest}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CityDetailsDialog;
