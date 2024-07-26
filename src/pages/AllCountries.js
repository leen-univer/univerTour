import React, { useState, useEffect } from 'react';
import MaterialTable from '@material-table/core';
import { ExportCsv } from '@material-table/exporters';
import { CopyAll, Info, LocationCity, School } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import moment from 'moment';
import { getArrFromObj } from '@ashirbad/js-core';
import { database } from 'configs';
import { useAppContext } from 'contexts';
import { useFetch, useStudents } from 'hooks';
import AssignUniversityDrawer from 'components/drawer/AssignUniversityDrawer';
import KeyInfoDialog from 'components/dialog/KeyInfoDialog';
import CityDetailsDialog from 'components/dialog/CityDetailsDialog';

const AllCountries = () => {
  const [openAssignUniversity, setOpenAssignUniversity] = useState(false);
  const [countries, loading] = useFetch(`/Countries`, { needNested: false, needArray: true });
  const [studentsCountByCountry, setStudentsCountByCountry] = useState({});
  const [studentsCountByCity, setStudentsCountByCity] = useState({});
  const { snackBarOpen } = useAppContext();
  const [countryKey, setCountryKey] = useState({});

  useEffect(() => {
    fetchStudentsData();
  }, []);

  const fetchStudentsData = async () => {
    try {
      const fairsSnapshot = await database.ref(`/NewFairs`).once('value');
      const fairsData = fairsSnapshot.val();
      if (fairsData) {
        const countryStudentCount = {};
        const countryKey = {};
        const cityStudentCount = {};

        for (const fairId in fairsData) {
          const studentsSnapshot = await database.ref(`/NewFairs/${fairId}/forms/studentMajorForm/students`).once('value');
          const students = studentsSnapshot.val();
          if (students) {
            for (const studentId in students) {
              const student = students[studentId];
              if (student.country) {
                try {
                  const country = atob(student.country);
                  const city = atob(student.city);
                  countryKey[city] = fairId;

                  if (country) {
                    if (!countryStudentCount[country]) {
                      countryStudentCount[country] = 0;
                    }
                    countryStudentCount[country]++;
                  }
                  if (city) {
                    if (!cityStudentCount[city]) {
                      cityStudentCount[city] = 0;
                    }
                    cityStudentCount[city]++;
                  }
                } catch (error) {
                  console.warn(`Error decoding country or city for student ${studentId}:`, error);
                }
              } else {
                console.warn(`Student ${studentId} has no country field`);
              }
            }
          }
        }
        console.log('Country Student Count:', countryStudentCount);
        setStudentsCountByCountry(countryStudentCount);
        setCountryKey(countryKey);
        setStudentsCountByCity(cityStudentCount);
      }
    } catch (error) {
      console.error('Error fetching students data:', error);
    }
  };

  return (
    <section className="py-2">
      <MaterialTable
        data={countries?.map((item, i) => ({
          ...item,
          sl: i + 1,
          keyCity: countryKey[item.cityName],
          studentCount: studentsCountByCountry[item.countryName] || 0,
        })) || []}
        title="Add Countries"
        options={{
          detailPanelColumnAlignment: 'right',
          filtering: false,
          sorting: true,
          exportAllData: true,
          exportMenu: [
            {
              label: 'Export Users Data In CSV',
              exportFunc: (cols, data) => ExportCsv(cols, data),
            },
          ],
          actionsColumnIndex: -1,
        }}
        columns={[
          {
            title: '#',
            field: 'sl',
            editable: 'never',
          },
          {
            title: 'Country Name',
            field: 'countryName',
            searchable: true,
            export: true,
            validate: (rowData) => rowData.countryName && rowData.countryName.length > 0 ? true : 'Required',
          },
          {
            title: 'Student Pulse',
            field: 'studentCount',
            editable: 'never',
          },
          {
            title: 'Created At',
            field: 'timestamp',
            editable: 'never',
            emptyValue: '--',
            render: ({ timestamp }) => moment(timestamp).format('Do MMM YYYY hh:mm A'),
          },
          {
            title: "Assign University",
            hidden: true,
            render: (rowData) => (
              <IconButton onClick={() => setOpenAssignUniversity(rowData)}>
                <School />
              </IconButton>
            ),
          },
        ]}
        editable={{
          onRowAdd: async (newData) => {
            try {
              await database.ref('Countries').push({
                ...newData,
                timestamp: new Date().toString(),
              });
              snackBarOpen('Country Created Successfully', 'success');
            } catch (error) {
              snackBarOpen(error.message, 'error');
              console.log(error, "Error adding country");
            }
          },
          onRowUpdate: async (newData, oldData) => {
            try {
              await database.ref(`Countries/${oldData.id}`).update({
                countryName: newData.countryName,
                updatedAt: new Date().toString(),
              });
              snackBarOpen('Country Updated Successfully', 'success');
            } catch (error) {
              snackBarOpen(error.message, 'error');
              console.log(error, "Error updating country");
            }
          },
          onRowDelete: async (oldData) => {
            try {
              await database.ref(`Countries/${oldData.id}`).remove();
              snackBarOpen('Country Deleted Successfully', 'success');
            } catch (error) {
              snackBarOpen(error.message, 'error');
              console.log(error, "Error deleting country");
            }
          },
        }}
        detailPanel={[
          {
            icon: () => <LocationCity />,
            openIcon: 'visibility',
            tooltip: 'View Cities',
            render: ({ rowData }) => <CityTable rowData={rowData} loading={loading} studentsCountByCity={studentsCountByCity} />,
          },
        ]}
        isLoading={loading}
      />
      <AssignUniversityDrawer open={openAssignUniversity} setOpen={setOpenAssignUniversity} />
      <KeyInfoDialog open={openAssignUniversity} setOpen={setOpenAssignUniversity} />
    </section>
  );
};

export default AllCountries;

const CityTable = ({ rowData, loading, studentsCountByCity }) => {
  const { students } = useStudents();
  const upcomingEvents = [
    ...students?.filter((item) => item?.fairType === 'SCHOOL VISIT'),
    ...students?.filter((item) => item?.fairType === 'ACTIVITY' || item?.fairType === 'INFO'),
  ];
  const [openAssignUniversity, setOpenAssignUniversity] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openCityDetails, setOpenCityDetails] = useState(false);
  const { snackBarOpen } = useAppContext();

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link).then(
      () => {
        snackBarOpen('Link copied to clipboard', 'success');
      },
      (err) => {
        console.error('Failed to copy link to clipboard:', err);
        snackBarOpen('Failed to copy link', 'error');
      }
    );
  };

  return (
    <div style={{ padding: '4vh', margin: 'auto', backgroundColor: '#eef5f9' }}>
      <AssignUniversityDrawer
        mainId={rowData?.id}
        open={openAssignUniversity}
        setOpenAssignDriverDrawer={setOpenAssignUniversity}
      />
      <KeyInfoDialog
        mainId={rowData?.id}
        openDialog={openInfo}
        setOpenDialog={setOpenInfo}
      />
      <CityDetailsDialog
        open={openCityDetails}
        setOpen={setOpenCityDetails}
        fairId={rowData?.keyCity}
        cityData={openInfo}
      />
      <MaterialTable
        data={getArrFromObj(rowData?.cities)
          ?.sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp))
          .map((item, i) => ({
            ...item,
            sl: i + 1,
            totalSchoolVisits: upcomingEvents?.filter(data => data?.cityName === item?.cityName)?.length || 0,
            studentCount: studentsCountByCity[item.cityName] || 0,
          }))}
        title={`${rowData?.countryName} Cities`}
        columns={[
          {
            title: '#',
            field: 'sl',
            editable: 'never',
          },
          {
            title: 'City Name',
            field: 'cityName',
            searchable: true,
            validate: (rowData) => rowData.cityName && rowData.cityName.length > 0 ? true : 'Required',
          },
          {
            title: 'Created At',
            field: 'timestamp',
            editable: 'never',
            filtering: false,
            render: ({ timestamp }) => moment(new Date(timestamp)).format('Do MMM YYYY hh:mm A'),
          },
          {
            title: "Participated Universities",
            render: ({ id }) => (
              <IconButton
                onClick={() =>
                  copyToClipboard(
                    `${window?.location?.origin}/${rowData?.id}/${id}`
                  )
                }
              >
                <CopyAll />
              </IconButton>
            ),
          },
          {
            title: "Assign University",
            render: (rowData) => (
              <IconButton onClick={() => setOpenAssignUniversity(rowData)}>
                <School />
              </IconButton>
            ),
          },
          {
            title: "Total School Visits",
            field: "totalSchoolVisits",
            editable: "never",
          },
          {
            title: 'Student pulse Details', 
            render: (rowData) => (
              <IconButton onClick={() => setOpenCityDetails(rowData)}>
                <LocationCity />
              </IconButton>
            ),
          },
        
          {
            title: "Key Info",
            render: ({ id }) => (
              <IconButton onClick={() => setOpenInfo(id)}>
                <Info />
              </IconButton>
            ),
          },
        ]}
        options={{
          filtering: false,
          sorting: true,
          paging: true,
          actionsColumnIndex: -1,
          exportAllData: true,
        }}
        editable={{
          onRowAdd: async (newData) => {
            try {
              await database.ref(`/Countries/${rowData?.id}/cities`).push({
                ...newData,
                timestamp: new Date().toString(),
              });
              snackBarOpen('City Created Successfully', 'success');
            } catch (error) {
              snackBarOpen(error.message, 'error');
              console.log(error, "Error adding city");
            }
          },
          onRowUpdate: async (newData, oldData) => {
            try {
              await database.ref(`/Countries/${rowData?.id}/cities/${oldData?.id}`).update({
                ...newData,
                updatedAt: new Date().toString(),
              });
              snackBarOpen('City Updated Successfully', 'success');
            } catch (error) {
              snackBarOpen(error.message, 'error');
              console.log(error, "Error updating city");
            }
          },
          onRowDelete: async (oldData) => {
            try {
              await database.ref(`/Countries/${rowData?.id}/cities/${oldData?.id}`).remove();
              snackBarOpen('City Deleted Successfully', 'success');
            } catch (error) {
              snackBarOpen(error.message, 'error');
              console.log(error, "Error deleting city");
            }
          },
        }}
        isLoading={loading}
      />
    </div>
  );
};
