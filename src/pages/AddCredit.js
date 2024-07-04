import MaterialTable from "@material-table/core";
// import ExportPdf from "@material-table/exporters/pdf";
import { ListItem, ListItemText } from "@mui/material";
import { SendNotification } from "components/dialog";
import { useUniversities } from "hooks";
import moment from "moment";
import { useState } from "react";
// import { BASE_URL } from "configs/api";
import { AddUniversityDrawer, EditUniversityDrawer } from "components/drawer";
import { database } from "configs";
import { useAppContext } from "contexts";
import Swal from "sweetalert2";

const AddCredit = () => {
  const { sendNotification, sendMail } = useAppContext();

  const [openAddUniversityDrawer, setOpenAddUniversityDrawer] = useState(false);
  const [openEditUniversityDrawer, setOpenEditUniversityDrawer] =
    useState(false);
  const { universities } = useUniversities();
  const Universities = universities.filter(
    (university) => university?.role === "university"
  );
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
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
        data={Universities.map((item, i) => ({ ...item, sl: i + 1 })) || []}
        title="Add Credit"
        columns={[
          {
            title: "#",
            field: "sl",
            width: "2%",
            editable: "never",
          },
          {
            title: "University Name",
            field: "displayName",
            editable: "never",
            render: ({ displayName, email, picture }) => (
              <>
                <ListItem>
                  <ListItemText primary={displayName} secondary={`${email}`} />
                </ListItem>
              </>
            ),
          },
          {
            title: "Email",
            field: "email",
            editable: "never",
            export: true,
            hidden: true,
          },
          // { title: "Password", field: "password", export: true },
          {
            title: "Phone",
            field: "phoneNumber",
            editable: "never",
            export: true,
          },
          {
            title: "Contact Person",
            field: "contactName",
            hidden: true,
            export: true,
          },
          { title: "Location", field: "location", hidden: true, export: true },
          { title: "Country", field: "country", hidden: true, export: true },
          // {
          // 	title: "Credits",
          // 	field: "creditAmount",
          // 	headerStyle: {
          // 		textAlign: "center",
          // 	},
          // 	cellStyle: {
          // 		textAlign: "center",
          // 	},

          // 	export: true,
          // },

          {
            title: "Add Credits",
            field: "creditAmount",
            // headerStyle: {
            // 	textAlign: "center",
            // },
            // cellStyle: { textAlign: "center" },
          },

          {
            title: "Created At",
            field: "created_at",
            editable: "never",
            emptyValue: "--",
            render: ({ created_at }) =>
              moment(created_at).format("Do MMM YYYY hh:mm A"),
            customSort: (a, b) =>
              new Date(b?.timestamp) - new Date(a?.timestamp),
          },
        ]}
        cellEditable={{
          isCellEditable: (rowData) => rowData,
          onCellEditApproved: async (
            newValue,
            oldValue,
            rowData,
            columnDef
          ) => {
            try {
              // if (newValue <= rowData?.creditAmount)
              // 	return Swal.fire({
              // 		icon: "warning",
              // 		text: "You have to add more credit than existing credit",
              // 	});

              Swal.fire({
                title: "Are you sure?",
                // text: "You won't be able to revert it again!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  setLoading(true);
                  try {
                    // console.log(newValue);
                    await database.ref(`Users/${rowData?.id}`).update({
                      creditAmount: +newValue,
                      creditUpdatedTime: new Date().toString(),
                    });

                    const notification = {
                      title: "Credit Updated",
                      description: `Credit Updated By SuperAdmin`,
                      read: false,
                      timestamp: new Date().toString(),
                    };
                    database.ref(`Users/${rowData?.id}`).on("value", (snap) => {
                      // console.log(snap.val());
                      const { fcmToken, email } = rowData;
                      // console.log(fcmToken);

                      sendNotification({
                        notification: {
                          title: "Credit Updated By SuperAdmin",
                          body: "Notifications",
                        },
                        FCMToken: fcmToken,
                      });
                      sendMail({
                        to: email,
                        subject: "Credit Updated",
                        html: "Credit Updated By SuperAdmin",
                      });
                    });
                    database
                      .ref(`Notifications/${rowData?.id}`)
                      .push(notification);

                    database.ref(`CreditTransactions/${rowData?.id}`).push({
                      timestamp: new Date().toString(),
                      oldAmount: +rowData?.creditAmount,
                      amountAdded: +newValue - +rowData?.creditAmount,
                      newAmount: +newValue,
                      type: "+",
                      message: "Credited",
                    });
                    // console.log("Credit Added By SuperAdmin");

                    Swal.fire({
                      title: "Success!",
                      text: "Credit has been updated!",
                      icon: "success",
                      confirmButtonColor: "#3085d6",
                      confirmButtonText: "Okay!",
                    });
                  } catch (e) {
                    console.log(e);
                  }
                }
                setLoading(false);
              });
            } catch (e) {
              console.log(e);
            }
          },
        }}
        isLoading={!Universities || loading}
      />
      <SendNotification
        selectedUsers={selectedUsers}
        handleClose={() => setSelectedUsers([])}
      />
    </section>
  );
};

export default AddCredit;
