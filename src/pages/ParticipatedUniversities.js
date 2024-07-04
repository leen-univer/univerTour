import { getArrFromObj } from "@ashirbad/js-core";
import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
import { ArrowDropDown } from "@mui/icons-material";
import { IconButton, ListItem, ListItemText, Tooltip } from "@mui/material";
import { ViewUniversityDetails } from "components/dialog";
import {
  useFetch,
  useNestedSchoolFairs,
  useStudents,
  useUniversities
} from "hooks";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ParticipatedUniversities = () => {
  const [countries] = useFetch("/Countries", {
    needNested: false,
    needArray: true,
  });
  const { students } = useStudents();
  const { schoolFairs } = useNestedSchoolFairs();
  const [openDialog, setOpenDialog] = useState(false);
  const params = useParams();
  const { universities } = useUniversities();

  const cityData = getArrFromObj(
    countries?.find((country) => country?.id === params?.countryId)?.cities
  )?.find((city) => city?.id === params?.cityId);
  const cityName = cityData?.cityName || "";

  const cityEvents = students
    ?.concat(schoolFairs)
    ?.filter((fair) => fair?.city === params?.cityId);

  const cityUniversities = cityData?.universities;
  const Universities = universities.filter(
    (university) => university?.role === "university"
  );

  const eventsData = cityEvents?.flatMap((event) =>
    Universities.filter((university) =>
      cityUniversities?.includes(university.id)
    )?.map((university) => ({
      eventName: event?.displayName,
      fairType: event?.fairType,
      ...university,
    }))
  );

  const UniversityData = Universities.filter((university) =>
    cityUniversities?.includes(university.id)
  );
  console.log(UniversityData)

  // const uniqueEventsData = eventsData?.reduce((uniqueItems, currentItem) => {
  //   if (!uniqueItems.some((item) => item.id === currentItem.id)) {
  //     uniqueItems.push(currentItem);
  //   }
  //   return uniqueItems;
  // }, []);

  return (
    <section className="lg:px-28 px-5 py-2 max-w-7xl mx-auto">
      <ViewUniversityDetails
        openDialog={openDialog}
        handleClose={() => setOpenDialog(false)}
      />
      <h2 className="text-theme text-center text-2xl mt-7 mb-3">
        Participants in Univer Tour - {cityName}
      </h2>
      <div
        style={{
          padding: "4vh",
          margin: "auto",
        }}
      >
        <MaterialTable
          data={UniversityData?.map((item, i) => ({ ...item, sl: i + 1 }))}
          title=""
          columns={[
            {
              title: "",
              field: "image",
              render: ({ image }) => (
                <>
                  <img className="w-32" src={image} alt="" />
                </>
              ),
            },
            {
              title: "Event Name",
              field: "eventName",
              searchable: true,
              hidden: true,
            },
            {
              title: "Event type",
              field: "fairType",
              searchable: true,
              hidden: true,
            },
            {
              title: "",
              field: "displayName",
              searchable: true,
              render: ({ displayName, email, picture }) => (
                <>
                  <ListItem>
                    <ListItemText primary={displayName} />
                  </ListItem>
                </>
              ),
            },
            {
              title: "Email",
              field: "email",
              export: true,
              searchable: true,
              hidden: true,
            },
            {
              title: "Phone",
              field: "phoneNumber",
              searchable: true,
              hidden: true,
            },
            {
              title: "Contact Person",
              field: "contactName",
              hidden: true,
              export: true,
            },
            {
              title: "Location",
              field: "location",
              searchable: true,
              hidden: true,
              export: true,
            },
            {
              title: "",
              render: (data) => {
                const dynamicUrl = `/university/${data.id}`; // Construct the dynamic URL based on data.id or other properties
                return (
                  <div className="flex justify-center gap-2 items-center">
                    <p>View Profile</p>
                    <Tooltip title="View University Details">
                      <a
                        href={dynamicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-purple-600 h-8 w-8 rounded-md flex justify-center items-center cursor-pointer"
                      >
                        <IconButton>
                          <ArrowDropDown className="!text-white" />
                        </IconButton>
                      </a>
                    </Tooltip>
                  </div>
                );
              },
              editable: "never",
            },
          ]}
          options={{
            detailPanelColumnAlignment: "right",
            exportAllData: true,
            toolbar: false,
            selection: false,
            exportMenu: [
              {
                label: "Export Users Data In CSV",
                exportFunc: (cols, data) => ExportCsv(cols, data),
              },
            ],
            actionsColumnIndex: -1,
          }}
          style={{
            boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
            borderRadius: "8px",
          }}
        />
      </div>
    </section>
  );
};

export default ParticipatedUniversities;
