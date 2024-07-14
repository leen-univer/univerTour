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
} from '@mui/material';
import { database } from 'configs';
import moment from 'moment';

const CityDetailsDialog = ({ open, setOpen, cityData, fairId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
const cityName= open.cityName;
  useEffect(() => {
    const fetchStudents = async () => {
      if (open) {
        setLoading(true);
        try {
          const studentsArray= [];
          const fairsSnapshot = await database.ref(`/NewFairs`).once('value');
          const fairsData = fairsSnapshot.val();
          if (fairsData) {

            for (const fairId in fairsData) {
             
              const studentsSnapshot = await database.ref(`/NewFairs/${fairId}/forms/studentMajorForm/students`).once('value');
              const students = studentsSnapshot.val();
             
              if (students) {
                for (const studentId in students) {
                  const student = students[studentId];
                  if (fairsData[fairId].cityName==cityName) {
                    studentsArray.push(student)
                  } else {
                    console.warn(`Student ${studentId} has no country field`);
                  }
                }
              }
            }

          }



        //     const studentsSnapshot = await database.ref(`/NewFairs/${fairId}/forms/studentMajorForm/students`).once('value');
        //     const studentsData = studentsSnapshot.val();
        //     console.log(studentsData,"hi");

        //     // console.log(/NewFairs/${key}/forms/studentMajorForm/students);
        //     for (const studentId in studentsData) {
        //       const students=studentsData[studentId];

        //   if (students) {

        //     const studentsArray1 = Object.keys(studentsData).map(studentId => ({
        //       id: studentId,
              
        //       ...studentsData[studentId],
        //     }));
        //     studentsArray.push(studentsArray1);
        //   } else {
        //     setStudents([]);
        //   }
        // }

      
        setStudents(studentsArray);

        } catch (error) {
          console.error('Error fetching students data:', error);
        } finally {
          setLoading(false);
        }
      }
      // else{

      // }
    };

    fetchStudents();
  }, [open, cityData, fairId]);

  return (

    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>Students Details for {cityName}</DialogTitle>
      <DialogContent>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </div>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Area of Interest</TableCell>
                  <TableCell>nationality</TableCell>
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