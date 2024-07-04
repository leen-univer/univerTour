import { getArrFromObj } from "@ashirbad/js-core";
import MaterialTable from "@material-table/core";
// import ExportCsv from "@material-table/exporters/csv";
import { ExportCsv } from "@material-table/exporters";
import { useParams } from "react-router-dom";

import {
  Add,
  Cancel,
  Download,
  Info,
  Person,
  School,
} from "@mui/icons-material";
import DetailsIcon from "@mui/icons-material/Details";
import GradingIcon from "@mui/icons-material/Grading";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import Popup from "components/PopUp";
import { NoDatas } from "components/core";
import {
  KeyInfoDialog,
  ViewItineraryDialog,
  ViewRegisterStudentDialog,
} from "components/dialog";
import CounsellorDetailDialog from "components/dialog/CounsellorDetailDialog";
import UniNoteDailog from "components/dialog/UniNoteDailog";
import { auth, database } from "configs";
import { useAppContext } from "contexts";
import {
  useFetch,
  useIsMounted,
  useNestedSchoolFairs,
  useStudents,
  useUniversities,
} from "hooks";
import { sortBy } from "lodash";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";

const Leads = () => {
  const { isMounted } = useIsMounted();
  const params = useParams();
  const [time, setTime] = useState(new Date());
  const [openInfo, setOpenInfo] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStudent, setOpenStudent] = useState(false);
  const [countries] = useFetch(`Countries/`);
  const [currentData, setCurrentData] = useState("");
  const [counsellorDetail, setCounsellorDetails] = useState(false);
  const [allData, setAllData] = useState();
  const [addReview, setAddReview] = useState(false);
  const [isSelect, setIsSelect] = useState()

  const timeout = useRef();
  useEffect(() => {
    (() => {
      if (!isMounted.current) return;
      timeout.current = setTimeout(() => setTime(new Date()), 2000);
    })();
    return () => {
      timeout.current && clearTimeout(timeout.current);
      isMounted.current = false;
    };
  }, [time, isMounted]);

  const { user } = useAppContext();

  const { universities } = useUniversities();
  const { schoolFairs } = useNestedSchoolFairs();
  const UNIVERSITYDATA = universities
    ?.filter((university) => university?.role === "university")
    ?.find((university) => university?.id === user?.universityId);
  const SUPERADMIN = universities?.filter(
    (university) => university?.role === "superadmin"
  )[0];
  const { students } = useStudents();
  console.log(students);
  const hasEventStarted = (date, time) => {
    const eventStartTime = new Date(
      moment(`${date} ${time}`).subtract(24, "hours").toDate()
    );
    const currentTime = new Date();
    return currentTime >= eventStartTime;
  };

  const AllInfos = students?.filter(
    (item) => item?.fairType === "SCHOOL VISIT"
  );
  console.log(AllInfos);
  const upcomingEvents = [
    ...students?.filter((item) => new Date(item?.date) >= new Date()),
    ...schoolFairs?.filter((item) => new Date(item?.date) >= new Date()),
  ];
  const pastEvents = [
    ...students?.filter((item) => new Date(item?.date) < new Date()),
    ...schoolFairs
      ?.filter((item) => new Date(item?.date) < new Date())
      ?.sort((a, b) => new Date(b?.date) - new Date(a?.date)),
  ]
    ?.slice()
    ?.sort((a, b) => new Date(b?.date) - new Date(a?.date));
  const totalEvents =
    user?.role === "user"
      ? upcomingEvents
        ?.concat(AllInfos)
        ?.concat(pastEvents)
        ?.filter((event) =>
          universities
            ?.filter((university) => university?.role === "university")
            ?.find((university) => university?.id === user?.universityId)
            ?.cities?.includes(event?.city)
        )
      : upcomingEvents
        ?.concat(AllInfos)
        ?.concat(pastEvents)
        ?.filter((event) => user?.cities?.includes(event?.city));

  const handleCancel = async (row) => {
    if (!row?.createdBy) return;
    if (row?.createdBy === "school") {
      try {
        const notification = {
          title: "Participation Cancelled",
          description: `Participation cancelled By ${user?.displayName} for fair ${row?.displayName}`,
          read: false,
          timestamp: new Date().toString(),
        };

        database.ref(`Notifications/${SUPERADMIN?.uid}`).push(notification);

        await database
          .ref(
            `SchoolFairs/${row?._id}/${row?.id}/participationRequest/${auth?.currentUser?.uid}`
          )
          .remove();
        // console.log("hadg");
        if (
          getArrFromObj(row?.AcceptedUniversity).find(
            (item) => item?.uid === auth?.currentUser?.uid
          )
        ) {
          await database
            .ref(
              `SchoolFairs/${row?._id}/${row?.id}/AcceptedUniversity/${auth?.currentUser?.uid}`
            )
            .remove();
        }
        if (
          getArrFromObj(user?.upcomingFairs).find(
            (item) => item?.id === row?.id
          )
        ) {
          // console.log("university remove from upcoming fairs");

          await database
            .ref(`Users/${auth?.currentUser?.uid}/upcomingFairs/${row?.id}`)
            .remove();
        }
        Swal.fire({
          text: `Participation Cancelled for fair ${row?.displayName}`,
          icon: "success",
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const notification = {
          title: "Participation Cancelled",
          description: `Participation cancelled By ${user?.displayName} for fair ${row?.displayName}`,
          read: false,
          timestamp: new Date().toString(),
        };

        database.ref(`Notifications/${SUPERADMIN?.uid}`).push(notification);

        if (
          getArrFromObj(row?.AcceptedUniversity).find(
            (item) => item?.uid === auth?.currentUser?.uid
          )
        ) {
          await database
            .ref(
              `NewFairs/${row?.id}/AcceptedUniversity/${auth?.currentUser?.uid}`
            )
            .remove();
        }
        if (
          getArrFromObj(user?.upcomingFairs).find(
            (item) => item?.id === row?.id
          )
        ) {
          // console.log("university remove from upcoming fairs");

          await database
            .ref(`Users/${auth?.currentUser?.uid}/upcomingFairs/${row?.id}`)
            .remove();
        }
        Swal.fire({
          text: `Participation Cancelled for fair ${row?.displayName}`,
          icon: "success",
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleParticipate = async (row) => {
    if (!row?.createdBy) return;
    if (row?.createdBy === "school") {
      await database
        .ref(
          `SchoolFairs/${row?._id}/${row?.id}/AcceptedUniversity/${auth.currentUser.uid}`
        )
        .update({
          displayName: user?.displayName,
          uid: auth?.currentUser.uid,
          email: user?.email,
          phoneNumber: user?.phoneNumber,
          location: user?.location,
          country: user?.country,
          website: user?.website,
          timestamp: new Date().toString(),
          isRequested: true,
        });
      await database
        .ref(`Users/${auth?.currentUser?.uid}/upcomingFairs/${row?.id}`)
        .update({
          ...row,
          tableData: {},
          timestamp: new Date().toString(),
        });
      Swal.fire({
        text: "You Are In",
        icon: "success",
      });
    } else {
      await database
        .ref(`NewFairs/${row?.id}/AcceptedUniversity/${auth.currentUser.uid}`)
        .update({
          displayName: user?.displayName,
          uid: auth?.currentUser.uid,
          email: user?.email,
          phoneNumber: user?.phoneNumber,
          location: user?.location,
          country: user?.country,
          website: user?.website,
          timestamp: new Date().toString(),
          isRequested: true,
        });
      await database
        .ref(`Users/${auth?.currentUser?.uid}/upcomingFairs/${row?.id}`)
        .update({
          ...row,
          timestamp: new Date().toString(),
        });
      Swal.fire({
        text: "You Are In",
        icon: "success",
      });
    }
  };
  console.log(handleParticipate);
  const sortedTotalEvents = sortBy(totalEvents, (event) =>
    new Date(event.date).getTime()
  );
  console.log(sortedTotalEvents);
  const AllEvents = [...AllInfos, ...sortedTotalEvents];

  console.log(AllEvents);

  const cityWiseData = [];
  const cityMap = {};
  AllEvents?.forEach((item) => {
    if (!cityMap[item?.date]) {
      cityWiseData.push({
        ...item,
        date: item.date,
        cityName: item.cityName,
        cityInfo: getArrFromObj(
          getArrFromObj(
            countries?.find((country) => country?.id === item?.country)?.cities
          )?.find((city) => city?.id === item?.city)?.keyInfos
        ),
        data: AllEvents.filter(
          (_) => _.date === item.date && _.cityName === item.cityName
        ),
      });
    }
  });
  console.log(cityWiseData);

  const result =
    user?.role === "user"
      ? cityWiseData
        ?.filter((data) =>
          universities
            ?.filter((university) => university?.role === "university")
            ?.find((university) => university?.id === user?.universityId)
            ?.cities?.includes(data?.city)
        )
        ?.reduce((accumulator, currentItem) => {
          const { cityName, date } = currentItem;
          const existingIndex = accumulator.findIndex(
            (item) => item.cityName === cityName && item.date === date
          );

          if (existingIndex === -1) {
            accumulator.push(currentItem);
          } else {
            console.log(
              `Duplicate found for cityName: ${cityName}, date: ${date}`
            );
          }

          return accumulator;
        }, [])
      : cityWiseData
        ?.filter((data) => user?.cities?.includes(data?.city))
        ?.reduce((accumulator, currentItem) => {
          const { cityName, date } = currentItem;
          const existingIndex = accumulator.findIndex(
            (item) => item.cityName === cityName && item.date === date
          );

          if (existingIndex === -1) {
            accumulator.push(currentItem);
          } else {
            console.log(
              `Duplicate found for cityName: ${cityName}, date: ${date}`
            );
          }

          return accumulator;
        }, []);

  console.log(result);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: "@page { size: landscape; }",
  });

  if (currentData?.length < 1) {
    setCurrentData(result?.[0]?.cityName);
  }

  console.log(currentData);
  // console.log(currentData);
  const headers = [
    { label: "Fair Type", key: "fairType" },
    { label: "Details", key: "displayName" },
    { label: "No of Students", key: "studentCount" },
    { label: "School System", key: "schoolName" },
    { label: "Location Link", key: "displayName" },
    { label: "Registration Link", key: "displayName" },
    { label: "Start Time", key: "time" },
    { label: "End Time", key: "endTime" },
  ];
  // console.log(result, " aosudytfiausydtfuy");

  // useEffect(() => {
  //   if (result !== allData) {
  //     setAllData(result);
  //   }
  // }, [allData]);
  // console.log(allData, "data");

  const handleChange = (e) => {
    console.log(e, "Selected city");
    setCurrentData(e);
    setIsSelect(e)

    // Check if "All" is selected
    if (e === "All") {
      setAllData(result);
    } else {
      // Update the current data based on the selected city
      const currentCity = result?.find((item) => item?.cityName === e);
      setAllData([currentCity]);
    }
  };

  isSelect ? console.log("After Selecting") : console.log("Before Clicking")

  console.log(currentData, "Selected city");

  // The state variable that holds the data to be displayed
  const dataToDisplay = allData;

  console.log("dataToDisplay=====", dataToDisplay);
  return (
    <section className="">
      <Popup />
      <ViewItineraryDialog
        rowData={openDialog}
        handleClose={() => setOpenDialog(false)}
      />
      <CounsellorDetailDialog
        rowData={counsellorDetail}
        handleClose={() => setCounsellorDetails(false)}
      />
      <UniNoteDailog
        handleClose={() => setAddReview(false)}
        addReview={addReview}
      />
      <ViewRegisterStudentDialog
        rowData={openStudent}
        handleClose={() => setOpenStudent(false)}
      />
      <div className="!text-end flex gap-2 justify-end ">
        <Select
          defaultValue=""
          displayEmpty
          className="!bg-theme !text-white"
          onChange={(event) => handleChange(event.target.value)}
        >
          <MenuItem value="" disabled>
            Select a City
          </MenuItem>
          {/* Conditionally render the "All" button */}
          {result && result.length > 0 && <MenuItem value="All">All</MenuItem>}
          {[...new Set(result?.map((data) => data.cityName))].map(
            (cityName) => (
              <MenuItem value={cityName} key={cityName}>
                {cityName}
              </MenuItem>
            )
          )}
        </Select>

        <Button
          startIcon={<Download />}
          variant="contained"
          onClick={handlePrint}
          className="!bg-theme !normal-case"
        >
          Download Itinerary
        </Button>
      </div>
      <KeyInfoDialog
        openDialog={openInfo}
        // handleClose={setOpenInfo(false)}
        setOpenDialog={setOpenInfo}
      />
      <div ref={componentRef}>
        <div className="text-2xl text-center text-theme font-bold mb-2">
          {user?.role === "user"
            ? UNIVERSITYDATA?.displayName
            : user?.displayName}{" "}
          Itinerary
        </div>
        {
          isSelect ? dataToDisplay?.map((_, i) => (
            <>
              <div
                className="!flex !justify-between !w-full
               !font-bold !text-[17px]  !p-2 mt-3"
              >
                <div className="flex gap-4 text-theme">
                  {/* City */}
                  <div>{_?.cityName}</div>
                  {/* Date */}
                  <div>{_?.date ? moment(_.date).format("LL") : ""}</div>
                  {/* Total School Visits */}
                  <div className="h-8 w-52 rounded-md bg-theme text-white flex gap-2 items-center px-4">
                    <h1>Total School Visits : </h1>
                    <span>
                      {_?.data
                        ?.reduce((accumulator, item) => {
                          const existingItem = accumulator.find(
                            (existing) => existing.id === item.id
                          );
                          if (!existingItem) {
                            accumulator.push(item);
                          }

                          return accumulator;
                        }, [])
                        .filter((data) => data?.fairType === "SCHOOL VISIT")
                        ?.length || 0}
                    </span>
                  </div>
                </div>
                {/* Key Information */}
                <div className="!text-red-600">
                  Key information {console.log("cityInfo", _?.cityInfo)}
                  <Tooltip
                    title={
                      _?.cityInfo?.length
                        ? `${_?.cityName} City Key Information`
                        : "No Key Information"
                    }
                  >
                    <IconButton
                      onClick={() =>
                        setOpenInfo({
                          id: _?.city,
                          cityName: _?.cityName,
                          keyInfos: _?.cityInfo,
                        })
                      }
                    // disabled={!_?.cityInfo?.length}
                    >
                      <Info className="!text-red-600" />
                    </IconButton>
                  </Tooltip>
                </div>
                {/* Download */}
                <CSVLink
                  filename="itinerary-list.csv"
                  headers={headers}
                  data={
                    _?.data
                      ?.reduce((accumulator, item) => {
                        const existingItem = accumulator.find(
                          (existing) => existing.id === item.id
                        );
                        if (!existingItem) {
                          accumulator.push(item);
                        }
                        return accumulator;
                      }, [])
                      ?.sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);

                        if (dateA < dateB) {
                          return -1;
                        } else if (dateA > dateB) {
                          return 1;
                        } else {
                          // If dates are equal, compare the times
                          const timeA = new Date(
                            `1970/01/01 ${a.time}`
                          ).getTime();
                          const timeB = new Date(
                            `1970/01/01 ${b.time}`
                          ).getTime();
                          return timeA - timeB;
                        }
                      })
                      ?.map((item, i) => ({ ...item, sl: i + 1 })) || []
                  }
                >
                  <button className="text-xs px-4 bg-theme py-2 text-white rounded-md">
                    <Download fontSize="small" /> DOWNLOAD
                  </button>
                </CSVLink>

                <div>
                  Participants
                  <a
                    href={`${window?.location?.origin}/${_?.country}/${_?.city}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconButton>
                      <School />
                    </IconButton>
                  </a>
                </div>
              </div>
              <MaterialTable
                key={i}
                data={
                  _?.data
                    ?.reduce((accumulator, item) => {
                      const existingItem = accumulator.find(
                        (existing) => existing.id === item.id
                      );
                      if (!existingItem) {
                        accumulator.push(item);
                      }
                      return accumulator;
                    }, [])
                    ?.sort((a, b) => {
                      const dateA = new Date(a.date);
                      const dateB = new Date(b.date);

                      if (dateA < dateB) {
                        return -1;
                      } else if (dateA > dateB) {
                        return 1;
                      } else {
                        // If dates are equal, compare the times
                        const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
                        const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
                        return timeA - timeB;
                      }
                    })
                    ?.map((item, i) => ({ ...item, sl: i + 1 })) || []
                }
                localization={{
                  header: {},
                }}
                title={" "}
                columns={[
                  {
                    title: "#",
                    field: "sl",
                    editable: "never",
                    // width: "10%",
                    filtering: false,
                  },
                  {
                    title: `${_?.data
                      ?.reduce((accumulator, item) => {
                        const existingItem = accumulator.find(
                          (existing) => existing.id === item.id
                        );
                        if (!existingItem) {
                          accumulator.push(item);
                        }
                        return accumulator;
                      }, [])
                      ?.sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);

                        if (dateA < dateB) {
                          return -1;
                        } else if (dateA > dateB) {
                          return 1;
                        } else {
                          // If dates are equal, compare the times
                          const timeA = new Date(
                            `1970/01/01 ${a.time}`
                          ).getTime();
                          const timeB = new Date(
                            `1970/01/01 ${b.time}`
                          ).getTime();
                          return timeA - timeB;
                        }
                      })
                      ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0].fairType
                      }`,
                    field: "fairType",
                    editable: "never",
                    headerStyle: {
                      color:
                        _?.data
                          ?.reduce((accumulator, item) => {
                            const existingItem = accumulator.find(
                              (existing) => existing.id === item.id
                            );
                            if (!existingItem) {
                              accumulator.push(item);
                            }
                            return accumulator;
                          }, [])
                          ?.sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);

                            if (dateA < dateB) {
                              return -1;
                            } else if (dateA > dateB) {
                              return 1;
                            } else {
                              // If dates are equal, compare the times
                              const timeA = new Date(
                                `1970/01/01 ${a.time}`
                              ).getTime();
                              const timeB = new Date(
                                `1970/01/01 ${b.time}`
                              ).getTime();
                              return timeA - timeB;
                            }
                          })
                          ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0]
                          .fairType === "ACTIVITY"
                          ? "blue"
                          : _?.data
                            ?.reduce((accumulator, item) => {
                              const existingItem = accumulator.find(
                                (existing) => existing.id === item.id
                              );
                              if (!existingItem) {
                                accumulator.push(item);
                              }
                              return accumulator;
                            }, [])
                            ?.sort((a, b) => {
                              const dateA = new Date(a.date);
                              const dateB = new Date(b.date);

                              if (dateA < dateB) {
                                return -1;
                              } else if (dateA > dateB) {
                                return 1;
                              } else {
                                // If dates are equal, compare the times
                                const timeA = new Date(
                                  `1970/01/01 ${a.time}`
                                ).getTime();
                                const timeB = new Date(
                                  `1970/01/01 ${b.time}`
                                ).getTime();
                                return timeA - timeB;
                              }
                            })
                            ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0]
                            .fairType === "INFO"
                            ? "cyan"
                            : "teal",
                      fontWeight: "bold",
                    },
                    sorting: false,
                    render: ({ imageURL, displayName, fairType, tableData }) => (
                      <div className="flex flex-col gap-3">
                        {tableData.index === 0 ? ( // Check if it's the first row
                          " "
                        ) : tableData.index !== 0 && fairType === "ACTIVITY" ? (
                          <div className="font-bold text-indigo-600">
                            {fairType}
                          </div>
                        ) : tableData.index !== 0 && fairType === "INFO" ? (
                          <div className="font-bold text-cyan-900">
                            {fairType}
                          </div>
                        ) : (
                          <div className="font-bold text-teal-600">
                            {fairType}
                          </div>
                        )}

                        <div>
                          {imageURL ? (
                            <Avatar
                              src={imageURL}
                              className="!h-full !w-full object-contain"
                              variant="rounded"
                            >
                              {displayName?.[0]}
                            </Avatar>
                          ) : (
                            <Avatar
                              src={imageURL}
                              className="!h-24 !w-32"
                              variant="rounded"
                            >
                              {displayName?.[0]}
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ),

                    filtering: false,
                  },
                  {
                    title: "Image",
                    searchable: true,
                    field: "imageURL",
                    filtering: false,
                    render: ({ imageURL, displayName }) =>
                      imageURL ? (
                        <Avatar
                          src={imageURL}
                          className="!h-full !w-full"
                          variant="rounded"
                        >
                          {displayName?.[0]}
                        </Avatar>
                      ) : (
                        <Avatar
                          src={imageURL}
                          className="!h-24 !w-32"
                          variant="rounded"
                        >
                          {displayName?.[0]}
                        </Avatar>
                      ),
                    hidden: true,
                  },
                  {
                    title: "Details",
                    field: "displayName",
                    filtering: false,
                    render: ({ time, fairType, displayName, tableData }) => (
                      <div className="flex flex-col gap-3 ">
                        {tableData.index === 0 ? ( // Check if it's the first row
                          " "
                        ) : (
                          <div className="font-medium ">{"Details"}</div>
                        )}

                        <div className="h-24">{displayName}</div>
                      </div>
                    ),
                  },
                  {
                    title: `${["ACTIVITY", "INFO"]?.includes(
                      _?.data
                        ?.reduce((accumulator, item) => {
                          const existingItem = accumulator.find(
                            (existing) => existing.id === item.id
                          );
                          if (!existingItem) {
                            accumulator.push(item);
                          }
                          return accumulator;
                        }, [])
                        ?.sort((a, b) => {
                          const dateA = new Date(a.date);
                          const dateB = new Date(b.date);

                          if (dateA < dateB) {
                            return -1;
                          } else if (dateA > dateB) {
                            return 1;
                          } else {
                            // If dates are equal, compare the times
                            const timeA = new Date(
                              `1970/01/01 ${a.time}`
                            ).getTime();
                            const timeB = new Date(
                              `1970/01/01 ${b.time}`
                            ).getTime();
                            return timeA - timeB;
                          }
                        })
                        ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0]
                        .fairType
                    )
                      ? ""
                      : "School System"
                      }`,
                    field: "schoolName",

                    filtering: false,
                    sorting: false,
                    render: ({
                      schoolName,
                      studentCount,
                      tableData,
                      fairType,
                    }) => (
                      <div className="flex flex-col gap-3">
                        {tableData.index === 0 ? ( // Check if it's the first row
                          " "
                        ) : !schoolName ? (
                          " "
                        ) : (
                          <div className="font-medium ">{"School System"}</div>
                        )}

                        <div className="!h-24">{schoolName}</div>
                      </div>
                    ),
                  },
                  {
                    title: `${["ACTIVITY", "INFO"]?.includes(
                      _?.data
                        ?.reduce((accumulator, item) => {
                          const existingItem = accumulator.find(
                            (existing) => existing.id === item.id
                          );
                          if (!existingItem) {
                            accumulator.push(item);
                          }
                          return accumulator;
                        }, [])
                        ?.sort((a, b) => {
                          const dateA = new Date(a.date);
                          const dateB = new Date(b.date);

                          if (dateA < dateB) {
                            return -1;
                          } else if (dateA > dateB) {
                            return 1;
                          } else {
                            // If dates are equal, compare the times
                            const timeA = new Date(
                              `1970/01/01 ${a.time}`
                            ).getTime();
                            const timeB = new Date(
                              `1970/01/01 ${b.time}`
                            ).getTime();
                            return timeA - timeB;
                          }
                        })
                        ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0]
                        .fairType
                    )
                      ? ""
                      : "No of students"
                      }`,
                    field: "studentCount",

                    filtering: false,
                    sorting: false,
                    render: ({ studentCount, tableData }) => (
                      <div className="flex flex-col gap-3">
                        {tableData.index === 0 ? ( // Check if it's the first row
                          " "
                        ) : !studentCount ? (
                          " "
                        ) : (
                          <div className="font-medium ">{"No of students"}</div>
                        )}

                        <div className="!h-24">{studentCount}</div>
                      </div>
                    ),
                  },
                  {
                    title: `${_?.data
                      ?.reduce((accumulator, item) => {
                        const existingItem = accumulator.find(
                          (existing) => existing.id === item.id
                        );
                        if (!existingItem) {
                          accumulator.push(item);
                        }
                        return accumulator;
                      }, [])
                      ?.sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);

                        if (dateA < dateB) {
                          return -1;
                        } else if (dateA > dateB) {
                          return 1;
                        } else {
                          // If dates are equal, compare the times
                          const timeA = new Date(
                            `1970/01/01 ${a.time}`
                          ).getTime();
                          const timeB = new Date(
                            `1970/01/01 ${b.time}`
                          ).getTime();
                          return timeA - timeB;
                        }
                      })
                      ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0]
                      .fairType === "INFO"
                      ? ""
                      : "Start Time"
                      }`,
                    field: "time",

                    render: ({ time, fairType, tableData }) => (
                      <div className="flex flex-col gap-3">
                        {tableData.index === 0 ? ( // Check if it's the first row
                          " "
                        ) : !time ? (
                          ""
                        ) : (
                          <div className="font-medium ">{"Start Time"}</div>
                        )}

                        <div className="!h-24">{time}</div>
                      </div>
                    ),
                    filtering: false,
                  },
                  {
                    title: `${_?.data
                      ?.reduce((accumulator, item) => {
                        const existingItem = accumulator.find(
                          (existing) => existing.id === item.id
                        );
                        if (!existingItem) {
                          accumulator.push(item);
                        }
                        return accumulator;
                      }, [])
                      ?.sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);

                        if (dateA < dateB) {
                          return -1;
                        } else if (dateA > dateB) {
                          return 1;
                        } else {
                          // If dates are equal, compare the times
                          const timeA = new Date(
                            `1970/01/01 ${a.time}`
                          ).getTime();
                          const timeB = new Date(
                            `1970/01/01 ${b.time}`
                          ).getTime();
                          return timeA - timeB;
                        }
                      })
                      ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0]
                      .fairType === "INFO"
                      ? ""
                      : "End Time"
                      }`,
                    field: "endTime",

                    render: ({ endTime, fairType, tableData }) => (
                      <div className="flex flex-col gap-3">
                        {tableData.index === 0 ? ( // Check if it's the first row
                          " "
                        ) : !endTime ? (
                          ""
                        ) : (
                          <div className="font-medium">{"End Time"}</div>
                        )}

                        <div className="!h-24">{endTime}</div>
                      </div>
                    ),
                    filtering: false,
                  },
                  {
                    title: "Participate",
                    field: "participate",
                    hidden: true,
                    render: (rowData) => (
                      <>
                        {getArrFromObj(rowData?.AcceptedUniversity)?.find(
                          (item) => item?.id === auth?.currentUser.uid
                        ) && !rowData?.isBooked ? (
                          <Button
                            disabled={
                              hasEventStarted(rowData?.date, rowData?.time)

                              //   ||
                              // getArrFromObj(rowData?.participationRequest)?.find(
                              //   (item) => item?.uid === auth?.currentUser.uid
                              // ) ||
                              // getArrFromObj(rowData?.AcceptedUniversity)?.find(
                              //   (item) => item?.id === auth?.currentUser.uid
                              // )
                            }
                            className="bg-theme"
                            variant="contained"
                            size="small"
                            color="secondary"
                            onClick={() => handleCancel(rowData)}
                            sx={{
                              px: 1,
                              py: 1,
                              textTransform: "capitalize",
                              fontWeight: "bold",
                            }}
                            // onClick={() => {
                            // 	setSelectedFair(rowData);
                            // }}
                            startIcon={<Cancel />}
                          >
                            Cancel
                          </Button>
                        ) : rowData?.isBooked ? (
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            sx={{
                              px: 1,
                              py: 1,
                              textTransform: "capitalize",
                              fontWeight: "bold",
                            }}
                            // onClick={() => {
                            // 	s0etSelectedFair(rowData);
                            // }}
                            disabled
                          >
                            Fully Booked
                          </Button>
                        ) : (
                          !rowData?.isBooked && (
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              disabled={
                                time >=
                                new Date(
                                  moment(`${rowData?.date}`)
                                    .subtract(24, "hours")
                                    .toDate()
                                )
                                // true
                              }
                              sx={{
                                px: 1,
                                py: 1,
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                              // onClick={() => {
                              // 	setSelectedFair(rowData);
                              // }}
                              startIcon={<Add />}
                              onClick={() => handleParticipate(rowData)}
                            >
                              Participate
                            </Button>
                          )
                        )}
                      </>
                    ),
                  },
                  {
                    title: "",
                    field: "fairType",
                    render: (rowData) =>
                      rowData?.fairType === "SCHOOL VISIT" && (
                        <div className="flex gap-2 !h-24">
                          <div className=" !h-24">
                            <Tooltip title="View Itinerary Details">
                              <IconButton onClick={() => setOpenDialog(rowData)}>
                                <Info />
                              </IconButton>
                            </Tooltip>{" "}
                          </div>
                          {user?.isAccepted === true ? (
                            <div className=" !h-24">
                              <Tooltip title="View Counsellor Details">
                                <IconButton
                                  onClick={() => setCounsellorDetails(rowData)}
                                >
                                  <DetailsIcon />
                                </IconButton>
                              </Tooltip>
                            </div>
                          ) : null}
                          <div className=" !h-24">
                            <Tooltip title="Add Review">
                              <IconButton onClick={() => setAddReview(true)}>
                                <GradingIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                          {getArrFromObj(rowData?.students)?.length ? (
                            <div className="!h-24">
                              <Tooltip title="View Registered Students">
                                <IconButton
                                  onClick={() => setOpenStudent(rowData)}
                                >
                                  <Person />
                                </IconButton>
                              </Tooltip>
                            </div>
                          ) : null}
                        </div>
                      ),
                  },
                ]}
                options={{
                  filtering: false,
                  exportAllData: true,
                  detailPanelColumnAlignment: "right",
                  search: false,
                  exportMenu: [
                    // {
                    //   label: "Export Users Data In CSV",
                    //   exportFunc: (cols, data) => ExportCsv(cols, data),
                    // },
                    // {
                    //   label: "Export Users Data In PDF",
                    //   exportFunc: (cols, data) => ExportPdf(cols, data),
                    // },
                  ],
                  pageSize: _?.data?.length,
                  // selection: true,
                  actionsColumnIndex: -1,
                }}
                style={{
                  boxShadow: "#6a1b9a3d 0px 0px 0px 0px",
                  borderRadius: "8px",
                }}
                // actions={[
                // 	{
                // 		icon: "person_add_alt",
                // 		tooltip: <strong>{"Send Request as Normal Leads"}</strong>,
                // 		onClick: (evt, rowData) => handleNormalLeads(rowData),
                // 	},
                // 	{
                // 		icon: "send",
                // 		tooltip: <strong>{"Send Request as Exclusive Leads"}</strong>,
                // 		onClick: (evt, rowData) => handleExclusiveLeads(rowData),
                // 	},
                // 	{
                // 		icon: "edit",
                // 		tooltip: <strong>{"Edit Student"}</strong>,
                // 		onClick: (evt, rowData) => setOpenEditStudentDrawer(rowData),
                // 	},
                // ]}
                detailPanel={
                  false && [
                    {
                      tooltip: "View Fair Details",
                      icon: "info",
                      openIcon: "visibility",
                      disabled: (rowData) =>
                        rowData?.fairType === "ACTIVITY" ? true : false,
                      // disabled: _?.fairType !== "SCHOOL VISIT",
                      render: ({ rowData }) => (
                        <>
                          {rowData?.fairType === "SCHOOL VISIT" ? (
                            <div
                              style={{
                                padding: "2px",
                                margin: "auto",
                                backgroundColor: "#eef5f9",
                              }}
                            >
                              <Card
                                sx={{
                                  minWidth: 600,
                                  maxWidth: 950,
                                  transition: "0.3s",
                                  margin: "auto",
                                  borderRadius: "10px",
                                  // fontFamily: italic,
                                  boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                                  "&:hover": {
                                    boxShadow:
                                      "0 16px 70px -12.125px rgba(0,0,0,0.3)",
                                  },
                                }}
                              >
                                <CardContent>
                                  <Typography
                                    variant="h6"
                                    gutterBottom
                                    align="left"
                                  >
                                    Registration Link:
                                    <a
                                      href={rowData?.regLink}
                                      style={{
                                        textDecoration: "none",
                                        fontSize: "1rem",
                                      }}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {rowData?.regLink}
                                    </a>

                                    <Typography variant="h6" gutterBottom align="left">
                                        Student Fair Link:{" "}
                                        {rowData?.fairLink ? (
                                          <a
                                            href={rowData.fairLink}
                                            style={{ textDecoration: "none", fontSize: "1rem" }}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            {rowData.fairLink}
                                          </a>
                                        ) : (
                                          "Fair Link is not defined"
                                        )}
                                      </Typography>

                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    gutterBottom
                                    align="left"
                                  >
                                    Location Link:
                                    <a
                                      href={rowData?.link}
                                      style={{
                                        textDecoration: "none",
                                        fontSize: "1rem",
                                      }}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {rowData?.link}
                                    </a>
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    gutterBottom
                                    align="left"
                                  >
                                    Notes:
                                    <span
                                      style={{
                                        color: "rgb(30, 136, 229)",
                                        fontSize: "15px",
                                        wordBreak: "break-word",
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      {" "}
                                      {rowData?.notes}{" "}
                                    </span>
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    gutterBottom
                                    align="left"
                                  >
                                    School System:
                                    <span
                                      style={{
                                        color: "rgb(30, 136, 229)",
                                        fontSize: "15px",
                                        wordBreak: "break-word",
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      {" "}
                                      {rowData?.schoolName}{" "}
                                    </span>
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    gutterBottom
                                    align="left"
                                  >
                                    Number Of Students:
                                    <span
                                      style={{
                                        color: "rgb(30, 136, 229)",
                                        fontSize: "15px",
                                        wordBreak: "break-word",
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      {" "}
                                      {rowData?.studentCount}{" "}
                                    </span>
                                  </Typography>
                                </CardContent>
                              </Card>
                            </div>
                          ) : (
                            <div
                              style={{
                                padding: "2px",
                                margin: "auto",
                                backgroundColor: "#eef5f9",
                              }}
                            >
                              <Card
                                sx={{
                                  minWidth: 600,
                                  maxWidth: 950,
                                  transition: "0.3s",
                                  margin: "auto",
                                  borderRadius: "10px",
                                  // fontFamily: italic,
                                  boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                                  "&:hover": {
                                    boxShadow:
                                      "0 16px 70px -12.125px rgba(0,0,0,0.3)",
                                  },
                                }}
                              >
                                <CardContent>
                                  <NoDatas title="No Details Provided" />
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </>
                      ),
                    },

                    {
                      icon: "person",
                      openIcon: "visibility",
                      tooltip: "View Registered Students",
                      render: ({ rowData }) => {
                        // (getArrFromObj(rowData?.participationRequest)?.find(
                        //   (item) => item?.uid === auth?.currentUser.uid
                        // ) ||
                        //   getArrFromObj(rowData?.AcceptedUniversity)?.find(
                        //     (item) => item?.id === auth?.currentUser.uid
                        //   )) &&
                        //   database.ref();

                        return (
                          <div
                            style={{
                              padding: "4vh",
                              margin: "auto",
                              backgroundColor: "#eef5f9",
                            }}
                          >
                            <MaterialTable
                              data={getArrFromObj(rowData?.students)
                                ?.sort(
                                  (a, b) =>
                                    new Date(b?.timestamp) -
                                    new Date(a?.timestamp)
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
                                  render: ({ id }) =>
                                    Boolean(
                                      getArrFromObj(
                                        rowData?.AcceptedUniversity
                                      )?.find(
                                        (item) =>
                                          item?.uid === auth.currentUser.uid
                                      )
                                    ) ? (
                                      id
                                    ) : (
                                      <Skeleton
                                        animation="wave"
                                        height={"12px"}
                                        width={"80%"}
                                      />
                                    ),
                                },
                                {
                                  title: "Name",
                                  field: "name",
                                  searchable: true,
                                  render: ({ name }) =>
                                    Boolean(
                                      getArrFromObj(
                                        rowData?.AcceptedUniversity
                                      )?.find(
                                        (item) =>
                                          item?.uid === auth.currentUser.uid
                                      )
                                    ) ? (
                                      name
                                    ) : (
                                      <Skeleton
                                        animation="wave"
                                        height={"12px"}
                                        width={"80%"}
                                      />
                                    ),
                                },
                                {
                                  title: "Email",
                                  field: "email",
                                  export: true,
                                  searchable: true,
                                  render: ({ email }) =>
                                    Boolean(
                                      getArrFromObj(
                                        rowData?.AcceptedUniversity
                                      )?.find(
                                        (item) =>
                                          item?.uid === auth.currentUser.uid
                                      )
                                    ) ? (
                                      email
                                    ) : (
                                      <Skeleton
                                        animation="wave"
                                        height={"12px"}
                                        width={"80%"}
                                      />
                                    ),
                                },
                                {
                                  title: "Phone",
                                  field: "phoneNumber",
                                  searchable: true,
                                  render: ({ phoneNumber }) =>
                                    Boolean(
                                      getArrFromObj(
                                        rowData?.AcceptedUniversity
                                      )?.find(
                                        (item) =>
                                          item?.uid === auth.currentUser.uid
                                      )
                                    ) ? (
                                      phoneNumber
                                    ) : (
                                      <Skeleton
                                        animation="wave"
                                        height={"12px"}
                                        width={"80%"}
                                      />
                                    ),
                                },
                                {
                                  title: "Age",
                                  field: "age",
                                  export: true,
                                  render: ({ age }) =>
                                    Boolean(
                                      getArrFromObj(
                                        rowData?.AcceptedUniversity
                                      )?.find(
                                        (item) =>
                                          item?.uid === auth.currentUser.uid
                                      )
                                    ) ? (
                                      age
                                    ) : (
                                      <Skeleton
                                        animation="wave"
                                        height={"12px"}
                                        width={"80%"}
                                      />
                                    ),
                                },
                                {
                                  title: "Gender",
                                  field: "gender",
                                  export: true,
                                  render: ({ gender }) =>
                                    Boolean(
                                      getArrFromObj(
                                        rowData?.AcceptedUniversity
                                      )?.find(
                                        (item) =>
                                          item?.uid === auth.currentUser.uid
                                      )
                                    ) ? (
                                      gender
                                    ) : (
                                      <Skeleton
                                        animation="wave"
                                        height={"12px"}
                                        width={"80%"}
                                      />
                                    ),
                                },
                                {
                                  title: "Nationality",
                                  field: "nationality",
                                  export: true,
                                  render: ({ nationality }) =>
                                    Boolean(
                                      getArrFromObj(
                                        rowData?.AcceptedUniversity
                                      )?.find(
                                        (item) =>
                                          item?.uid === auth.currentUser.uid
                                      )
                                    ) ? (
                                      nationality
                                    ) : (
                                      <Skeleton
                                        animation="wave"
                                        height={"12px"}
                                        width={"80%"}
                                      />
                                    ),
                                },
                                {
                                  title: "Area Of Interest",
                                  field: "areaOfInterest",
                                  export: true,
                                  render: ({ areaOfInterest }) =>
                                    Boolean(
                                      getArrFromObj(
                                        rowData?.AcceptedUniversity
                                      )?.find(
                                        (item) =>
                                          item?.uid === auth.currentUser.uid
                                      )
                                    ) ? (
                                      areaOfInterest
                                    ) : (
                                      <Skeleton
                                        animation="wave"
                                        height={"12px"}
                                        width={"80%"}
                                      />
                                    ),
                                },
                                {
                                  title: "Created At",
                                  field: "timestamp",
                                  editable: "never",
                                  emptyValue: "--",
                                  render: ({ timestamp }) =>
                                    moment(timestamp).format(
                                      "Do MMM YYYY hh:mm A"
                                    ),
                                },

                                // {
                                //   title: "Country",
                                //   field: "country",
                                //   searchable: true,
                                //   // hidden: true,
                                //   export: true,
                                // },
                              ]}
                              options={{
                                detailPanelColumnAlignment: "right",
                                exportAllData: true,
                                selection: false,
                                toolbar: false,
                                exportMenu: [
                                  {
                                    label: "Export Users Data In CSV",
                                    exportFunc: (cols, data) =>
                                      ExportCsv(cols, data),
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
                            />
                          </div>
                        );
                      },
                    },
                  ]
                }
                isLoading={!students}
              />
            </>
          )) :
            <div className="flex flex-col gap-10 ">
              {result?.map((_, i) => (
                <div className="flex flex-col gap-5 shadow-lg  rounded-lg">
                  <div
                    className="!flex !justify-between !w-full
               !font-bold !text-[17px]  !p-2 mt-3"
                  >
                    <div className="flex gap-4 text-theme">
                      {/* City */}
                      <div>{_?.cityName}</div>
                      {/* Date */}
                      <div>{_?.date ? moment(_.date).format("LL") : ""}</div>
                      {/* Total School Visits */}
                      <div className="h-8 w-52 rounded-md bg-theme text-white flex gap-2 items-center px-4">
                        <h1>Total School Visits : </h1>
                        <span>
                          {_?.data
                            ?.reduce((accumulator, item) => {
                              const existingItem = accumulator.find(
                                (existing) => existing.id === item.id
                              );
                              if (!existingItem) {
                                accumulator.push(item);
                              }

                              return accumulator;
                            }, [])
                            .filter((data) => data?.fairType === "SCHOOL VISIT")
                            ?.length || 0}
                        </span>
                      </div>
                    </div>
                    {/* Key Information */}
                    <div className="!text-red-600">
                      Key information {console.log("cityInfo", _?.cityInfo)}
                      <Tooltip
                        title={
                          _?.cityInfo?.length
                            ? `${_?.cityName} City Key Information`
                            : "No Key Information"
                        }
                      >
                        <IconButton
                          onClick={() =>
                            setOpenInfo({
                              id: _?.city,
                              cityName: _?.cityName,
                              keyInfos: _?.cityInfo,
                            })
                          }
                        // disabled={!_?.cityInfo?.length}
                        >
                          <Info className="!text-red-600" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    {/* Download */}
                    <CSVLink
                      filename="itinerary-list.csv"
                      headers={headers}
                      data={
                        _?.data
                          ?.reduce((accumulator, item) => {
                            const existingItem = accumulator.find(
                              (existing) => existing.id === item.id
                            );
                            if (!existingItem) {
                              accumulator.push(item);
                            }
                            return accumulator;
                          }, [])
                          ?.sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);

                            if (dateA < dateB) {
                              return -1;
                            } else if (dateA > dateB) {
                              return 1;
                            } else {
                              // If dates are equal, compare the times
                              const timeA = new Date(
                                `1970/01/01 ${a.time}`
                              ).getTime();
                              const timeB = new Date(
                                `1970/01/01 ${b.time}`
                              ).getTime();
                              return timeA - timeB;
                            }
                          })
                          ?.map((item, i) => ({ ...item, sl: i + 1 })) || []
                      }
                    >
                      <button className="text-xs px-4 bg-theme py-2 text-white rounded-md">
                        <Download fontSize="small" /> DOWNLOAD
                      </button>
                    </CSVLink>

                    <div>
                      Participants
                      <a
                        href={`${window?.location?.origin}/${_?.country}/${_?.city}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconButton>
                          <School />
                        </IconButton>
                      </a>
                    </div>
                  </div>
                  <MaterialTable
                    key={i}
                    data={
                      _?.data
                        ?.reduce((accumulator, item) => {
                          const existingItem = accumulator.find(
                            (existing) => existing.id === item.id
                          );
                          if (!existingItem) {
                            accumulator.push(item);
                          }
                          return accumulator;
                        }, [])
                        ?.sort((a, b) => {
                          const dateA = new Date(a.date);
                          const dateB = new Date(b.date);

                          if (dateA < dateB) {
                            return -1;
                          } else if (dateA > dateB) {
                            return 1;
                          } else {
                            // If dates are equal, compare the times
                            const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
                            const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
                            return timeA - timeB;
                          }
                        })
                        ?.map((item, i) => ({ ...item, sl: i + 1 })) || []
                    }
                    localization={{
                      header: {},
                    }}
                    title={" "}
                    columns={[
                      {
                        title: "#",
                        field: "sl",
                        editable: "never",
                        // width: "10%",
                        filtering: false,
                      },
                      {
                        title: `${_?.data
                          ?.reduce((accumulator, item) => {
                            const existingItem = accumulator.find(
                              (existing) => existing.id === item.id
                            );
                            if (!existingItem) {
                              accumulator.push(item);
                            }
                            return accumulator;
                          }, [])
                          ?.sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);

                            if (dateA < dateB) {
                              return -1;
                            } else if (dateA > dateB) {
                              return 1;
                            } else {
                              // If dates are equal, compare the times
                              const timeA = new Date(
                                `1970/01/01 ${a.time}`
                              ).getTime();
                              const timeB = new Date(
                                `1970/01/01 ${b.time}`
                              ).getTime();
                              return timeA - timeB;
                            }
                          })
                          ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0].fairType
                          }`,
                        field: "fairType",
                        editable: "never",
                        headerStyle: {
                          color:
                            _?.data
                              ?.reduce((accumulator, item) => {
                                const existingItem = accumulator.find(
                                  (existing) => existing.id === item.id
                                );
                                if (!existingItem) {
                                  accumulator.push(item);
                                }
                                return accumulator;
                              }, [])
                              ?.sort((a, b) => {
                                const dateA = new Date(a.date);
                                const dateB = new Date(b.date);

                                if (dateA < dateB) {
                                  return -1;
                                } else if (dateA > dateB) {
                                  return 1;
                                } else {
                                  // If dates are equal, compare the times
                                  const timeA = new Date(
                                    `1970/01/01 ${a.time}`
                                  ).getTime();
                                  const timeB = new Date(
                                    `1970/01/01 ${b.time}`
                                  ).getTime();
                                  return timeA - timeB;
                                }
                              })
                              ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0]
                              .fairType === "ACTIVITY"
                              ? "blue"
                              : _?.data
                                ?.reduce((accumulator, item) => {
                                  const existingItem = accumulator.find(
                                    (existing) => existing.id === item.id
                                  );
                                  if (!existingItem) {
                                    accumulator.push(item);
                                  }
                                  return accumulator;
                                }, [])
                                ?.sort((a, b) => {
                                  const dateA = new Date(a.date);
                                  const dateB = new Date(b.date);

                                  if (dateA < dateB) {
                                    return -1;
                                  } else if (dateA > dateB) {
                                    return 1;
                                  } else {
                                    // If dates are equal, compare the times
                                    const timeA = new Date(
                                      `1970/01/01 ${a.time}`
                                    ).getTime();
                                    const timeB = new Date(
                                      `1970/01/01 ${b.time}`
                                    ).getTime();
                                    return timeA - timeB;
                                  }
                                })
                                ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0]
                                .fairType === "INFO"
                                ? "cyan"
                                : "teal",
                          fontWeight: "bold",
                        },
                        sorting: false,
                        render: ({ imageURL, displayName, fairType, tableData }) => (
                          <div className="flex flex-col gap-3">
                            {tableData.index === 0 ? ( // Check if it's the first row
                              " "
                            ) : tableData.index !== 0 && fairType === "ACTIVITY" ? (
                              <div className="font-bold text-indigo-600">
                                {fairType}
                              </div>
                            ) : tableData.index !== 0 && fairType === "INFO" ? (
                              <div className="font-bold text-cyan-900">
                                {fairType}
                              </div>
                            ) : (
                              <div className="font-bold text-teal-600">
                                {fairType}
                              </div>
                            )}

                            <div>
                              {imageURL ? (
                                <Avatar
                                  src={imageURL}
                                  className="!h-full !w-full object-contain"
                                  variant="rounded"
                                >
                                  {displayName?.[0]}
                                </Avatar>
                              ) : (
                                <Avatar
                                  src={imageURL}
                                  className="!h-24 !w-32"
                                  variant="rounded"
                                >
                                  {displayName?.[0]}
                                </Avatar>
                              )}
                            </div>
                          </div>
                        ),

                        filtering: false,
                      },
                      {
                        title: "Image",
                        searchable: true,
                        field: "imageURL",
                        filtering: false,
                        render: ({ imageURL, displayName }) =>
                          imageURL ? (
                            <Avatar
                              src={imageURL}
                              className="!h-full !w-full"
                              variant="rounded"
                            >
                              {displayName?.[0]}
                            </Avatar>
                          ) : (
                            <Avatar
                              src={imageURL}
                              className="!h-24 !w-32"
                              variant="rounded"
                            >
                              {displayName?.[0]}
                            </Avatar>
                          ),
                        hidden: true,
                      },
                      {
                        title: "Details",
                        field: "displayName",
                        filtering: false,
                        render: ({ time, fairType, displayName, tableData }) => (
                          <div className="flex flex-col gap-3 ">
                            {tableData.index === 0 ? ( // Check if it's the first row
                              " "
                            ) : (
                              <div className="font-medium ">{"Details"}</div>
                            )}

                            <div className="h-24">{displayName}</div>
                          </div>
                        ),
                      },
                      {
                        title: `${["ACTIVITY", "INFO"]?.includes(
                          _?.data
                            ?.reduce((accumulator, item) => {
                              const existingItem = accumulator.find(
                                (existing) => existing.id === item.id
                              );
                              if (!existingItem) {
                                accumulator.push(item);
                              }
                              return accumulator;
                            }, [])
                            ?.sort((a, b) => {
                              const dateA = new Date(a.date);
                              const dateB = new Date(b.date);

                              if (dateA < dateB) {
                                return -1;
                              } else if (dateA > dateB) {
                                return 1;
                              } else {
                                // If dates are equal, compare the times
                                const timeA = new Date(
                                  `1970/01/01 ${a.time}`
                                ).getTime();
                                const timeB = new Date(
                                  `1970/01/01 ${b.time}`
                                ).getTime();
                                return timeA - timeB;
                              }
                            })
                            ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0]
                            .fairType
                        )
                          ? ""
                          : "School System"
                          }`,
                        field: "schoolName",

                        filtering: false,
                        sorting: false,
                        render: ({
                          schoolName,
                          studentCount,
                          tableData,
                          fairType,
                        }) => (
                          <div className="flex flex-col gap-3">
                            {tableData.index === 0 ? ( // Check if it's the first row
                              " "
                            ) : !schoolName ? (
                              " "
                            ) : (
                              <div className="font-medium ">{"School System"}</div>
                            )}

                            <div className="!h-24">{schoolName}</div>
                          </div>
                        ),
                      },
                      {
                        title: `${["ACTIVITY", "INFO"]?.includes(
                          _?.data
                            ?.reduce((accumulator, item) => {
                              const existingItem = accumulator.find(
                                (existing) => existing.id === item.id
                              );
                              if (!existingItem) {
                                accumulator.push(item);
                              }
                              return accumulator;
                            }, [])
                            ?.sort((a, b) => {
                              const dateA = new Date(a.date);
                              const dateB = new Date(b.date);

                              if (dateA < dateB) {
                                return -1;
                              } else if (dateA > dateB) {
                                return 1;
                              } else {
                                // If dates are equal, compare the times
                                const timeA = new Date(
                                  `1970/01/01 ${a.time}`
                                ).getTime();
                                const timeB = new Date(
                                  `1970/01/01 ${b.time}`
                                ).getTime();
                                return timeA - timeB;
                              }
                            })
                            ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0]
                            .fairType
                        )
                          ? ""
                          : "No of students"
                          }`,
                        field: "studentCount",

                        filtering: false,
                        sorting: false,
                        render: ({ studentCount, tableData }) => (
                          <div className="flex flex-col gap-3">
                            {tableData.index === 0 ? ( // Check if it's the first row
                              " "
                            ) : !studentCount ? (
                              " "
                            ) : (
                              <div className="font-medium ">{"No of students"}</div>
                            )}

                            <div className="!h-24">{studentCount}</div>
                          </div>
                        ),
                      },
                      {
                        title: `${_?.data
                          ?.reduce((accumulator, item) => {
                            const existingItem = accumulator.find(
                              (existing) => existing.id === item.id
                            );
                            if (!existingItem) {
                              accumulator.push(item);
                            }
                            return accumulator;
                          }, [])
                          ?.sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);

                            if (dateA < dateB) {
                              return -1;
                            } else if (dateA > dateB) {
                              return 1;
                            } else {
                              // If dates are equal, compare the times
                              const timeA = new Date(
                                `1970/01/01 ${a.time}`
                              ).getTime();
                              const timeB = new Date(
                                `1970/01/01 ${b.time}`
                              ).getTime();
                              return timeA - timeB;
                            }
                          })
                          ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0]
                          .fairType === "INFO"
                          ? ""
                          : "Start Time"
                          }`,
                        field: "time",

                        render: ({ time, fairType, tableData }) => (
                          <div className="flex flex-col gap-3">
                            {tableData.index === 0 ? ( // Check if it's the first row
                              " "
                            ) : !time ? (
                              ""
                            ) : (
                              <div className="font-medium ">{"Start Time"}</div>
                            )}

                            <div className="!h-24">{time}</div>
                          </div>
                        ),
                        filtering: false,
                      },
                      {
                        title: `${_?.data
                          ?.reduce((accumulator, item) => {
                            const existingItem = accumulator.find(
                              (existing) => existing.id === item.id
                            );
                            if (!existingItem) {
                              accumulator.push(item);
                            }
                            return accumulator;
                          }, [])
                          ?.sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);

                            if (dateA < dateB) {
                              return -1;
                            } else if (dateA > dateB) {
                              return 1;
                            } else {
                              // If dates are equal, compare the times
                              const timeA = new Date(
                                `1970/01/01 ${a.time}`
                              ).getTime();
                              const timeB = new Date(
                                `1970/01/01 ${b.time}`
                              ).getTime();
                              return timeA - timeB;
                            }
                          })
                          ?.map((item, i) => ({ ...item, sl: i + 1 }))?.[0]
                          .fairType === "INFO"
                          ? ""
                          : "End Time"
                          }`,
                        field: "endTime",

                        render: ({ endTime, fairType, tableData }) => (
                          <div className="flex flex-col gap-3">
                            {tableData.index === 0 ? ( // Check if it's the first row
                              " "
                            ) : !endTime ? (
                              ""
                            ) : (
                              <div className="font-medium">{"End Time"}</div>
                            )}

                            <div className="!h-24">{endTime}</div>
                          </div>
                        ),
                        filtering: false,
                      },
                      {
                        title: "Participate",
                        field: "participate",
                        hidden: true,
                        render: (rowData) => (
                          <>
                            {getArrFromObj(rowData?.AcceptedUniversity)?.find(
                              (item) => item?.id === auth?.currentUser.uid
                            ) && !rowData?.isBooked ? (
                              <Button
                                disabled={
                                  hasEventStarted(rowData?.date, rowData?.time)

                                  //   ||
                                  // getArrFromObj(rowData?.participationRequest)?.find(
                                  //   (item) => item?.uid === auth?.currentUser.uid
                                  // ) ||
                                  // getArrFromObj(rowData?.AcceptedUniversity)?.find(
                                  //   (item) => item?.id === auth?.currentUser.uid
                                  // )
                                }
                                className="bg-theme"
                                variant="contained"
                                size="small"
                                color="secondary"
                                onClick={() => handleCancel(rowData)}
                                sx={{
                                  px: 1,
                                  py: 1,
                                  textTransform: "capitalize",
                                  fontWeight: "bold",
                                }}
                                // onClick={() => {
                                // 	setSelectedFair(rowData);
                                // }}
                                startIcon={<Cancel />}
                              >
                                Cancel
                              </Button>
                            ) : rowData?.isBooked ? (
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                sx={{
                                  px: 1,
                                  py: 1,
                                  textTransform: "capitalize",
                                  fontWeight: "bold",
                                }}
                                // onClick={() => {
                                // 	s0etSelectedFair(rowData);
                                // }}
                                disabled
                              >
                                Fully Booked
                              </Button>
                            ) : (
                              !rowData?.isBooked && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="primary"
                                  disabled={
                                    time >=
                                    new Date(
                                      moment(`${rowData?.date}`)
                                        .subtract(24, "hours")
                                        .toDate()
                                    )
                                    // true
                                  }
                                  sx={{
                                    px: 1,
                                    py: 1,
                                    textTransform: "capitalize",
                                    fontWeight: "bold",
                                  }}
                                  // onClick={() => {
                                  // 	setSelectedFair(rowData);
                                  // }}
                                  startIcon={<Add />}
                                  onClick={() => handleParticipate(rowData)}
                                >
                                  Participate
                                </Button>
                              )
                            )}
                          </>
                        ),
                      },
                      {
                        title: "",
                        field: "fairType",
                        render: (rowData) =>
                          rowData?.fairType === "SCHOOL VISIT" && (
                            <div className="flex gap-2 !h-24">
                              <div className=" !h-24">
                                <Tooltip title="View Itinerary Details">
                                  <IconButton onClick={() => setOpenDialog(rowData)}>
                                    <Info />
                                  </IconButton>
                                </Tooltip>{" "}
                              </div>
                              {user?.isAccepted === true ? (
                                <div className=" !h-24">
                                  <Tooltip title="View Counsellor Details">
                                    <IconButton
                                      onClick={() => setCounsellorDetails(rowData)}
                                    >
                                      <DetailsIcon />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              ) : null}
                              <div className=" !h-24">
                                <Tooltip title="Add Review">
                                  <IconButton onClick={() => setAddReview(true)}>
                                    <GradingIcon />
                                  </IconButton>
                                </Tooltip>
                              </div>
                              {getArrFromObj(rowData?.students)?.length ? (
                                <div className="!h-24">
                                  <Tooltip title="View Registered Students">
                                    <IconButton
                                      onClick={() => setOpenStudent(rowData)}
                                    >
                                      <Person />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              ) : null}
                            </div>
                          ),
                      },
                    ]}
                    options={{
                      filtering: false,
                      paging: false,
                      exportAllData: true,
                      detailPanelColumnAlignment: "right",
                      search: false,
                      exportMenu: [],
                      actionsColumnIndex: -1,
                    }}
                    style={{
                      boxShadow: "#6a1b9a3d 0px 0px 0px 0px",
                      borderRadius: "8px",
                    }}

                    detailPanel={
                      false && [
                        {
                          tooltip: "View Fair Details",
                          icon: "info",
                          openIcon: "visibility",
                          disabled: (rowData) =>
                            rowData?.fairType === "ACTIVITY" ? true : false,
                          // disabled: _?.fairType !== "SCHOOL VISIT",
                          render: ({ rowData }) => (
                            <>
                              {rowData?.fairType === "SCHOOL VISIT" ? (
                                <div
                                  style={{
                                    padding: "2px",
                                    margin: "auto",
                                    backgroundColor: "#eef5f9",
                                  }}
                                >
                                  <Card
                                    sx={{
                                      minWidth: 600,
                                      maxWidth: 950,
                                      transition: "0.3s",
                                      margin: "auto",
                                      borderRadius: "10px",
                                      // fontFamily: italic,
                                      boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                                      "&:hover": {
                                        boxShadow:
                                          "0 16px 70px -12.125px rgba(0,0,0,0.3)",
                                      },
                                    }}
                                  >
                                    <CardContent>
                                      <Typography
                                        variant="h6"
                                        gutterBottom
                                        align="left"
                                      >
                                        Registration Link:
                                        <a
                                          href={rowData?.regLink}
                                          style={{
                                            textDecoration: "none",
                                            fontSize: "1rem",
                                          }}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          {rowData?.regLink}
                                        </a>
                                      </Typography>
                                      <Typography variant="h6" gutterBottom align="left">
                                            Student Fair Link:{" "}
                                            {rowData?.fairLink ? (
                                              <a
                                                href={rowData.fairLink}
                                                style={{ textDecoration: "none", fontSize: "1rem" }}
                                                target="_blank"
                                                rel="noreferrer"
                                              >
                                                {rowData.fairLink}
                                              </a>
                                            ) : (
                                              "Fair Link is not defined"
                                            )}
                                          </Typography>
                                      <Typography
                                        variant="h6"
                                        gutterBottom
                                        align="left"
                                      >
                                        Location Link:
                                        <a
                                          href={rowData?.link}
                                          style={{
                                            textDecoration: "none",
                                            fontSize: "1rem",
                                          }}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          {rowData?.link}
                                        </a>
                                      </Typography>
                                      <Typography
                                        variant="h6"
                                        gutterBottom
                                        align="left"
                                      >
                                        Notes:
                                        <span
                                          style={{
                                            color: "rgb(30, 136, 229)",
                                            fontSize: "15px",
                                            wordBreak: "break-word",
                                            wordWrap: "break-word",
                                          }}
                                        >
                                          {" "}
                                          {rowData?.notes}{" "}
                                        </span>
                                      </Typography>
                                      <Typography
                                        variant="h6"
                                        gutterBottom
                                        align="left"
                                      >
                                        School System:
                                        <span
                                          style={{
                                            color: "rgb(30, 136, 229)",
                                            fontSize: "15px",
                                            wordBreak: "break-word",
                                            wordWrap: "break-word",
                                          }}
                                        >
                                          {" "}
                                          {rowData?.schoolName}{" "}
                                        </span>
                                      </Typography>
                                      <Typography
                                        variant="h6"
                                        gutterBottom
                                        align="left"
                                      >
                                        Number Of Students:
                                        <span
                                          style={{
                                            color: "rgb(30, 136, 229)",
                                            fontSize: "15px",
                                            wordBreak: "break-word",
                                            wordWrap: "break-word",
                                          }}
                                        >
                                          {" "}
                                          {rowData?.studentCount}{" "}
                                        </span>
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    padding: "2px",
                                    margin: "auto",
                                    backgroundColor: "#eef5f9",
                                  }}
                                >
                                  <Card
                                    sx={{
                                      minWidth: 600,
                                      maxWidth: 950,
                                      transition: "0.3s",
                                      margin: "auto",
                                      borderRadius: "10px",
                                      // fontFamily: italic,
                                      boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                                      "&:hover": {
                                        boxShadow:
                                          "0 16px 70px -12.125px rgba(0,0,0,0.3)",
                                      },
                                    }}
                                  >
                                    <CardContent>
                                      <NoDatas title="No Details Provided" />
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </>
                          ),
                        },

                        {
                          icon: "person",
                          openIcon: "visibility",
                          tooltip: "View Registered Students",
                          render: ({ rowData }) => {
                            // (getArrFromObj(rowData?.participationRequest)?.find(
                            //   (item) => item?.uid === auth?.currentUser.uid
                            // ) ||
                            //   getArrFromObj(rowData?.AcceptedUniversity)?.find(
                            //     (item) => item?.id === auth?.currentUser.uid
                            //   )) &&
                            //   database.ref();

                            return (
                              <div
                                style={{
                                  padding: "4vh",
                                  margin: "auto",
                                  backgroundColor: "#eef5f9",
                                }}
                              >
                                <MaterialTable
                                  data={getArrFromObj(rowData?.students)
                                    ?.sort(
                                      (a, b) =>
                                        new Date(b?.timestamp) -
                                        new Date(a?.timestamp)
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
                                      render: ({ id }) =>
                                        Boolean(
                                          getArrFromObj(
                                            rowData?.AcceptedUniversity
                                          )?.find(
                                            (item) =>
                                              item?.uid === auth.currentUser.uid
                                          )
                                        ) ? (
                                          id
                                        ) : (
                                          <Skeleton
                                            animation="wave"
                                            height={"12px"}
                                            width={"80%"}
                                          />
                                        ),
                                    },
                                    {
                                      title: "Name",
                                      field: "name",
                                      searchable: true,
                                      render: ({ name }) =>
                                        Boolean(
                                          getArrFromObj(
                                            rowData?.AcceptedUniversity
                                          )?.find(
                                            (item) =>
                                              item?.uid === auth.currentUser.uid
                                          )
                                        ) ? (
                                          name
                                        ) : (
                                          <Skeleton
                                            animation="wave"
                                            height={"12px"}
                                            width={"80%"}
                                          />
                                        ),
                                    },
                                    {
                                      title: "Email",
                                      field: "email",
                                      export: true,
                                      searchable: true,
                                      render: ({ email }) =>
                                        Boolean(
                                          getArrFromObj(
                                            rowData?.AcceptedUniversity
                                          )?.find(
                                            (item) =>
                                              item?.uid === auth.currentUser.uid
                                          )
                                        ) ? (
                                          email
                                        ) : (
                                          <Skeleton
                                            animation="wave"
                                            height={"12px"}
                                            width={"80%"}
                                          />
                                        ),
                                    },
                                    {
                                      title: "Phone",
                                      field: "phoneNumber",
                                      searchable: true,
                                      render: ({ phoneNumber }) =>
                                        Boolean(
                                          getArrFromObj(
                                            rowData?.AcceptedUniversity
                                          )?.find(
                                            (item) =>
                                              item?.uid === auth.currentUser.uid
                                          )
                                        ) ? (
                                          phoneNumber
                                        ) : (
                                          <Skeleton
                                            animation="wave"
                                            height={"12px"}
                                            width={"80%"}
                                          />
                                        ),
                                    },
                                    {
                                      title: "Age",
                                      field: "age",
                                      export: true,
                                      render: ({ age }) =>
                                        Boolean(
                                          getArrFromObj(
                                            rowData?.AcceptedUniversity
                                          )?.find(
                                            (item) =>
                                              item?.uid === auth.currentUser.uid
                                          )
                                        ) ? (
                                          age
                                        ) : (
                                          <Skeleton
                                            animation="wave"
                                            height={"12px"}
                                            width={"80%"}
                                          />
                                        ),
                                    },
                                    {
                                      title: "Gender",
                                      field: "gender",
                                      export: true,
                                      render: ({ gender }) =>
                                        Boolean(
                                          getArrFromObj(
                                            rowData?.AcceptedUniversity
                                          )?.find(
                                            (item) =>
                                              item?.uid === auth.currentUser.uid
                                          )
                                        ) ? (
                                          gender
                                        ) : (
                                          <Skeleton
                                            animation="wave"
                                            height={"12px"}
                                            width={"80%"}
                                          />
                                        ),
                                    },
                                    {
                                      title: "Nationality",
                                      field: "nationality",
                                      export: true,
                                      render: ({ nationality }) =>
                                        Boolean(
                                          getArrFromObj(
                                            rowData?.AcceptedUniversity
                                          )?.find(
                                            (item) =>
                                              item?.uid === auth.currentUser.uid
                                          )
                                        ) ? (
                                          nationality
                                        ) : (
                                          <Skeleton
                                            animation="wave"
                                            height={"12px"}
                                            width={"80%"}
                                          />
                                        ),
                                    },
                                    {
                                      title: "Area Of Interest",
                                      field: "areaOfInterest",
                                      export: true,
                                      render: ({ areaOfInterest }) =>
                                        Boolean(
                                          getArrFromObj(
                                            rowData?.AcceptedUniversity
                                          )?.find(
                                            (item) =>
                                              item?.uid === auth.currentUser.uid
                                          )
                                        ) ? (
                                          areaOfInterest
                                        ) : (
                                          <Skeleton
                                            animation="wave"
                                            height={"12px"}
                                            width={"80%"}
                                          />
                                        ),
                                    },
                                    {
                                      title: "Created At",
                                      field: "timestamp",
                                      editable: "never",
                                      emptyValue: "--",
                                      render: ({ timestamp }) =>
                                        moment(timestamp).format(
                                          "Do MMM YYYY hh:mm A"
                                        ),
                                    },

                                    // {
                                    //   title: "Country",
                                    //   field: "country",
                                    //   searchable: true,
                                    //   // hidden: true,
                                    //   export: true,
                                    // },
                                  ]}
                                  options={{
                                    detailPanelColumnAlignment: "right",
                                    exportAllData: true,
                                    selection: false,
                                    enablePagination: false,
                                    toolbar: false,
                                    exportMenu: [
                                      {
                                        label: "Export Users Data In CSV",
                                        exportFunc: (cols, data) =>
                                          ExportCsv(cols, data),
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
                                />
                              </div>
                            );
                          },
                        },
                      ]
                    }
                    isLoading={!students}
                  />
                </div>
              ))}

            </div>
        }

        { }
      </div>
      {/* <SendNotification
        selectedUsers={selectedUsers}
        handleClose={() => setSelectedUsers([])}
      /> */}
    </section>
  );
};

export default Leads;
