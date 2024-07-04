import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
// import ExportCsv from "@material-table/exporters/csv";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { Tooltip } from "@mui/material";
import { SendNotification } from "components/dialog";
import SelectMultipleCities from "components/drawer/SelectMultipleCities";
import { auth, database } from "configs";
import { BASE_URL } from "configs/api";
import { useAppContext } from "contexts";
import { useFetch, useUniversities } from "hooks";
import moment from "moment";
import { useState } from "react";
import Swal from "sweetalert2";

const Users = () => {
  const { user, loader } = useAppContext();
  console.log(user);
  const { snackBarOpen } = useAppContext();
  const [openAddStudentDrawer, setOpenAddImageDrawer] = useState(false);

  const { universities } = useUniversities();
  const Universities = universities.filter(
    (university) =>
      university?.role === "user" &&
      university?.universityId === auth?.currentUser?.uid
  );
  // console.log(Universities, "Universities")

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userData, setUserData] = useState();
  const [allUserData, setAllUserData] = useState();
  const [id, setId] = useState();

  const [data] = useFetch(`/Others`);

  const usersData = [];

  if (data?.length > 0) {
    data?.filter((item) => {
      if (item && typeof Object.values(item) === "object") {
        let count = 0;
        Object.values(item).map((data, index) => {
          console.log(data);
          if (data?.uid === `${user?.uid}`) {
            usersData.push(data);
          }
        });
      }
    });
  }
  console.log(usersData);

  // setAllUserData(data?.[0]);
  // const AllCities = countries?.flatMap((country) =>
  //   getArrFromObj(country?.cities)
  // );

  return (
    <section className="py-2">
      <MaterialTable
        data={usersData?.map((item, i) => ({ ...item, sl: i + 1 })) || []}
        title="All Users"
        columns={[
          {
            title: "#",
            field: "sl",
            editable: "never",
          },
          {
            title: "Name",
            field: "displayName",
          },
          { title: "Email", field: "email", export: true },
          { title: "Password", field: "password", export: true },

          {
            title: "Created At",
            field: "created_at",
            // emptyValue: "--",
            editable: "never",
            render: ({ created_at }) =>
              moment(created_at).format("DD MMM YYYY hh:mm A"),
          },
          {
            title: "Add City",
            field: "cities",
            editable: "never",
            render: (data) => {
              return (
                <div className="flex gap-1">
                  <>
                    {console.log(data, "abc")}
                    <Tooltip title="Select Cities">
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setOpenAddImageDrawer(true);
                          setUserData(data);
                        }}
                      >
                        <ApartmentIcon />
                      </div>
                    </Tooltip>
                  </>
                </div>
              );
            },
            export: true,
          },
        ]}
        options={{
          detailPanelColumnAlignment: "right",
          exportAllData: true,
          addRowPosition: "first",
          headerStyle: {
            backgroundColor: "#f2f2f2", // Header background color
            color: "#333", // Header text color
            fontWeight: "bold", // Header font weight
            fontSize: "14px", // Header font size
            // ... (other styles)
          },

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
          // selection: true,
          actionsColumnIndex: -1,
        }}
        style={{
          boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
          borderRadius: "8px",
        }}
        editable={{
          onRowAdd: async (newData) => {
            const pushKey = database.ref("Others").push().key;
            const dbRef = `Others/${user?.uid}/${pushKey}`;
            const updatedData = {
              ...newData,
              role: "user",
              uid: `${user?.uid}`,
              id: pushKey,
              timestamp: new Date().toString(),
              updatedAt: new Date().toString(),
            };

            await database.ref(dbRef).update(updatedData);
            Swal.fire("Success!", "User Added Successfully", "success");
          },
          onRowDelete: async (oldData) => {
            console.log(oldData, "oldData");
            await database.ref(`Others/${user?.uid}/${oldData.id}`).remove();
            Swal.fire("Success!", "User Deleted Successfully", "success");
          },
        }}
        // actions={[
        //   {
        //     tooltip: "Send notification to all selected users",
        //     icon: "send",
        //     onClick: (evt, data) => setSelectedUsers(data),
        //   },
        //   {
        //     tooltip: "Add University",
        //     icon: "add",
        //     isFreeAction: true,
        //     onClick: (evt, data) => setOpenAddUniversityDrawer(true),
        //   },
        //   {
        //     tooltip: "Edit University",
        //     icon: "edit",
        //     onClick: (evt, rowData) => {
        //       if (rowData.length > 1) {
        //         Swal.fire({
        //           text: "Please Select One University",
        //           icon: "warning",
        //         });
        //       } else {
        //         setOpenEditUniversityDrawer(rowData);
        //       }
        //     },
        //   },
        // ]}
        isLoading={!Universities}
      />
      <SendNotification
        selectedUsers={selectedUsers}
        handleClose={() => setSelectedUsers([])}
      />
      <SelectMultipleCities
        open={openAddStudentDrawer}
        setOpenAddImageDrawer={setOpenAddImageDrawer}
        userData={userData}
      />
    </section>
  );
};

export default Users;
