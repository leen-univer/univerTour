import React, { useState, useEffect } from 'react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { database } from 'configs'; 
import MaterialTable from '@material-table/core';
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';

const StudentFair = () => {
  const [studentData, setStudentData] = useState({
    studentCount: 0,
    maleCount: 0,
    femaleCount: 0,
    countries: [],
    top3Nationalities: [],
    top3NationalitiesOfAreaInterest: [],
    top3AreasOfInterest: [],
  });

  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const snapshot = await database.ref('/NewFairs').once('value');
        const data = snapshot.val();
  
        let totalStudents = 0;
        let maleCount = 0;
        let femaleCount = 0;
        let countries = [];
        let nationalityCounts = {};
        let nationalityOfAreaInterestCounts = {};
        let areaOfInterestCounts = {};
  
        const keys = Object.keys(data).sort((a, b) => b - a);
  
        for (const key of keys) {
          const studentsSnapshot = await database.ref(`/NewFairs/${key}/forms/studentMajorForm/students`).once('value');
          const studentsData = studentsSnapshot.val();
  
          for (const studentId in studentsData) {
            const student = studentsData[studentId];
            totalStudents++;
  
            if (student.gender === 'MALE') {
              maleCount++;
            } else if (student.gender === 'FEMALE') {
              femaleCount++;
            }
  
            if (student.nationality) {
              nationalityCounts[student.nationality] = (nationalityCounts[student.nationality] || 0) + 1;
            }
  
            if (student.nationalityOfAreaInterest) {
              nationalityOfAreaInterestCounts[student.nationalityOfAreaInterest] = (nationalityOfAreaInterestCounts[student.nationalityOfAreaInterest] || 0) + 1;
            }
  
            if (student.areaOfInterest) {
              areaOfInterestCounts[student.areaOfInterest] = (areaOfInterestCounts[student.areaOfInterest] || 0) + 1;
            }
  
            let country = student.country;
            let city = student.city;
  
            try {
              country = atob(country);
              city = atob(city);
            } catch (error) {
              console.error("Error decoding country or city:", error);
            }
  
            countries.push({
              studentId: studentId,
              gender: student.gender,
              nationality: student.nationality,
              areaOfInterest: student.areaOfInterest,
              nationalityOfAreaInterest: student.nationalityOfAreaInterest,
              country: country,
              city: city,
            });
          }
        }
  
        countries.sort((a, b) => a.studentId.localeCompare(b.studentId)); 
        countries = countries.map((country, index) => ({ ...country, sl: index + 1 }));
  
        setStudentData({
          studentCount: totalStudents,
          maleCount: maleCount,
          femaleCount: femaleCount,
          countries: countries,
          top3Nationalities: Object.keys(nationalityCounts).map(nationality => ({
            nationality: nationality,
            count: nationalityCounts[nationality],
          })).sort((a, b) => b.count - a.count).slice(0, 3),
          top3NationalitiesOfAreaInterest: Object.keys(nationalityOfAreaInterestCounts).map(nationality => ({
            nationality: nationality,
            count: nationalityOfAreaInterestCounts[nationality],
          })).sort((a, b) => b.count - a.count).slice(0, 3),
          top3AreasOfInterest: Object.keys(areaOfInterestCounts).map(areaOfInterest => ({
            areaOfInterest: areaOfInterest,
            count: areaOfInterestCounts[areaOfInterest],
          })).sort((a, b) => b.count - a.count).slice(0, 3),
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
  
    fetchStudentData();
  }, []);
  

  const handleShowTable = () => {
    setShowTable(true);
  };

  const handleCloseTable = () => {
    setShowTable(false);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 'auto', padding: '40px' }}>
      <h3 style={{ color: 'black', fontSize: '40px' }}>Your Data</h3>
      <p style={{ padding: '10px', color: 'gray' }}>Results for student pulse form</p>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button onClick={handleShowTable} style={{ padding: '10px 20px', fontSize: '20px', backgroundColor: 'rgb(72 68 187)', color: 'white', border: 'none', cursor: 'pointer' }}>
          Show Details
        </button>
      </div>

      <hr />

      {/* General Demographics Section */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0px 16px 7px', fontSize: '20px', gap: '332px', boxShadow: '#6a1b9a3d 0px 8px 16px 0px', padding: '27px' }}>
        <div>
          <h1 style={{ fontSize: '50px', color: 'red' }}><strong>{studentData.studentCount.toLocaleString()}</strong></h1>
          <p style={{ fontSize: '17px', padding: '0px', color: 'gray' }}>Total Number of Students</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaMale style={{ fontSize: '70px' }} />
              <div style={{ fontSize: '60px', color: 'gray' }}>
                {studentData.maleCount}
              </div>
            </div>
            <div style={{ fontSize: '20px', color: 'gray' }}>Male</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaFemale style={{ fontSize: '70px' }} />
              <div style={{ fontSize: '60px', color: 'gray' }}>
                {studentData.femaleCount}
              </div>
            </div>
            <div style={{ fontSize: '20px', color: 'gray' }}>Female</div>
          </div>
        </div>
      </div>
    
      {/* Top 3 Areas of Interest Section */}
      <div style={{ marginTop: '30px', backgroundColor: '#d8e1f3', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>Top 3 Areas of Interest</h2>
        {studentData.top3AreasOfInterest.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: '1', marginRight: '10px', fontWeight: 'bold', fontSize: '18px', color: '#555' }}>{item.areaOfInterest}</div>
            <div style={{ flex: '3', backgroundColor: '#ddd', height: '20px', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${(item.count / studentData.studentCount) * 100}%`, backgroundColor: '#2196F3', height: '100%', borderRadius: '5px' }}></div>
            </div>
            <span style={{ marginLeft: '10px', fontSize: '18px', color: '#555' }}>{((item.count / studentData.studentCount) * 100).toFixed(2)}% ({item.count} students)</span>
          </div>
        ))}
      </div>
    
      {/* Top 3 Nationalities Section */}
      <div style={{ marginTop: '30px', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>Top 3 Nationalities</h2>
        {studentData.top3Nationalities.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: '1', marginRight: '10px', fontWeight: 'bold', fontSize: '18px', color: '#555' }}>{item.nationality}</div>
            <div style={{ flex: '3', backgroundColor: '#ddd', height: '20px', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${(item.count / studentData.studentCount) * 100}%`, backgroundColor: '#FFC107', height: '100%', borderRadius: '5px' }}></div>
            </div>
            <span style={{ marginLeft: '10px', fontSize: '18px', color: '#555' }}>{((item.count / studentData.studentCount) * 100).toFixed(2)}% ({item.count} students)</span>
          </div>
        ))}
      </div>
    
      {/* Top 3 Nationalities of Area Interest Section */}
      <div style={{ marginTop: '30px', backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>Top 3 Country of Area Interest</h2>
        {studentData.top3NationalitiesOfAreaInterest.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: '1', marginRight: '10px', fontWeight: 'bold', fontSize: '18px', color: '#555' }}>{item.nationality}</div>
            <div style={{ flex: '3', backgroundColor: '#ddd', height: '20px', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${(item.count / studentData.studentCount) * 100}%`, backgroundColor: '#4CAF50', height: '100%', borderRadius: '5px' }}></div>
            </div>
            <span style={{ marginLeft: '10px', fontSize: '18px', color: '#555' }}>{((item.count / studentData.studentCount) * 100).toFixed(2)}% ({item.count} students)</span>
          </div>
        ))}
      </div>
    
      {/* Detailed Student Data Dialog */}
      <Dialog onClose={handleCloseTable} aria-labelledby="customized-dialog-title" open={showTable} maxWidth="xl" fullWidth>
        <DialogTitle id="customized-dialog-title">
          <p className="text-center text-xl font-bold text-theme tracking-wide">
            Detailed Student Data
          </p>
        </DialogTitle>
        <DialogContent dividers>
        <MaterialTable
  data={studentData.countries}
  title="All Students Data"
  columns={[
    { title: '#', field: 'sl', defaultSort: 'asc' }, 
    { title: 'Gender', field: 'gender' },
    { title: 'Nationality', field: 'nationality' },
    { title: 'Country', field: 'country' },         
    { title: 'City', field: 'city' },             
    { title: 'Area Of Interest', field: 'areaOfInterest' },
    { title: 'Country Of Area Interest', field: 'nationalityOfAreaInterest' },
  ]}
  options={{
    exportButton: true,
    filtering: true,
    exportAllData: true,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50],
    customSort: (a, b, field) => {
      if (field === 'sl') {
        return a.sl - b.sl; 
      }
      return 0; 
    },
  }}
/>


        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentFair;
