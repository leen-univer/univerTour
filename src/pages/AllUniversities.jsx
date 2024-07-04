import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
import {
  Key,
} from "@mui/icons-material";
import {
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { PasswordDialogue, SendNotification } from "components/dialog";
import { useFetch, useUniversities } from "hooks";
import { useState } from "react";

const AllUniversities = () => {
  // const { snackBarOpen } = useAppContext();
  // const [openPasswordDialogue, setOpenPasswordDialogue] = useState(false);
  // const [openAddUniversityDrawer, setOpenAddUniversityDrawer] = useState(false);
  // const [openAddDocumentDrawer, setOpenAddDocumentDrawer] = useState(false);
  // const [openAddImageDrawer, setOpenAddImageDrawer] = useState(false);
  // const [openEditUniversityDrawer, setOpenEditUniversityDrawer] =
  // useState(false);
  const { universities } = useUniversities();
  const Universities = universities.filter(
    (university) => university?.role === "university"
  );
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [countries] = useFetch(`/Countries`);

  return (
    <section className="py-2">
      <MaterialTable
        data={Universities.map((item, i) => ({ ...item, sl: i + 1 })) || []}
        title="Universities"
        columns={[
          {
            title: "#",
            field: "sl",
            width: "10%",
          },
          {
            title: "University Name",
            field: "displayName",
            render: ({ displayName, email }) => (
              <>
                <ListItem>
                  <ListItemText primary={displayName} secondary={`${email}`} />
                </ListItem>
              </>
            ),
          },
          { title: "Email", field: "email", export: true },
          { title: "Password", field: "password", export: true },
          { title: "Phone", field: "phoneNumber" },

          {
            title: "Action",
            export: false,
            render: (rowData) => (
              <ChangePasswordSection universityData={rowData} />

            ),
          },

        ]}

        options={{
          detailPanelColumnAlignment: "right",
          exportAllData: true,
          selection: true,
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

        isLoading={!Universities}
      />
      <SendNotification
        selectedUsers={selectedUsers}
        handleClose={() => setSelectedUsers([])}
      />
    </section>
  );
};

export default AllUniversities;

const ChangePasswordSection = ({ universityData }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <PasswordDialogue
        open={isOpen}
        setIsOpen={setIsOpen}
        universityData={universityData}
      />
      <Tooltip title="Change Password">
        <div className="flex items-center rounded-lg border w-fit overflow-hidden" onClick={() => setIsOpen(true)}>
          <span
            className=" px-3 py-2 bg-transparent hover:bg-red-200/50 transition-all ease-in-out duration-300 cursor-pointer"
          >
            <Key className="text-black" />
          </span>
        </div>
      </Tooltip></>
  )
}
