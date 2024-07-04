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

const CityDetailsDialog = ({ open, setOpen, cityData }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (open && cityData?.cityName) {
        setLoading(true);
        try {
          const studentsSnapshot = await database.ref(`/NewFairs`) // Update your path here
            .orderByChild('city') // Update your orderByChild condition here
            .equalTo(cityData.cityName)
            .once('value');
          const studentsData = studentsSnapshot.val();

          if (studentsData) {
            const studentsArray = Object.keys(studentsData).map(studentId => ({
              id: studentId,
              ...studentsData[studentId],
            }));

            setStudents(studentsArray);
          } else {
            setStudents([]);
          }
        } catch (error) {
          console.error('Error fetching students data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStudents();
  }, [open, cityData]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>Students Details for {cityData?.cityName}</DialogTitle>
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
                  <TableCell>Student Name</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Area of Interest</TableCell>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.country}</TableCell>
                    <TableCell>{student.city}</TableCell>
                    <TableCell>{student.areaOfInterest}</TableCell>
                    <TableCell>{moment(student.dateOfBirth).format('MMM DD, YYYY')}</TableCell>
                    <TableCell>{moment(student.createdAt).format('lll')}</TableCell>
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
