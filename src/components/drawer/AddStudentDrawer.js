import { useState } from "react";
import {
  Container,
  Drawer,
  Grid,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import AddSchoolVisit from "components/AddSchoolVisit";
import AddActivity from "components/AddActivity";
import AddInfo from "components/AddInfo";

// ... Existing imports ...

const AddStudentDrawer = ({ open, setOpenAddStudentDrawer }) => {
  const theme = useTheme();
  // ... Existing code ...

  // State to manage the active tab index
  const [activeTab, setActiveTab] = useState(0);

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpenAddStudentDrawer(false)}
      >
        <Container
          className="90vw !mt-12vh  "
          sx={{
            // width: "50vw",
            marginTop: "10vh",
            [theme.breakpoints.up("sm")]: {
              maxWidth: "50vw",
            },
            [theme.breakpoints.up("md")]: {
              maxWidth: "80vw",
            },
            [theme.breakpoints.up("lg")]: {
              maxWidth: "40vw",
            },
          }}
        >
          <Typography align="center" color="text.primary" variant="h5">
            Add New Event
          </Typography>

          {/* Tabs */}
          <TabContext value={activeTab}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab label="School Visit" value={0} />
              <Tab label="Activity" value={1} />
              <Tab label="Info" value={2} />
            </Tabs>
            {/* Tab panels */}
            <TabPanel value={0} index={0}>
              {/* School Visit Tab Content */}
              <div className="!w-full">
                <AddSchoolVisit setOpenDrawer={setOpenAddStudentDrawer} />
                {/* Add fields relevant to School Visit here */}
                {/* Example: */}
                {/* <Field name="schoolVisitField1">
                      {(props) => <TextField {...props.field} />}
                    </Field> */}
              </div>
            </TabPanel>
            <TabPanel value={1} index={1}>
              {/* Activity Tab Content */}
              <AddActivity setOpenDrawer={setOpenAddStudentDrawer} />
              <Grid container justifyContent="center">
                {/* Add fields relevant to Activity here */}
                {/* Example: */}
                {/* <Field name="activityField1">
                      {(props) => <TextField {...props.field} />}
                    </Field> */}
              </Grid>
            </TabPanel>
            <TabPanel value={2} index={2}>
              {/* Info Tab Content */}
              <AddInfo setOpenDrawer={setOpenAddStudentDrawer} />
              <Grid container justifyContent="center">
                {/* Add fields relevant to Info here */}
                {/* Example: */}
                {/* <Field name="infoField1">
                      {(props) => <TextField {...props.field} />}
                    </Field> */}
              </Grid>
            </TabPanel>
          </TabContext>

          {/* ... Remaining code ... */}
        </Container>
      </Drawer>
    </>
  );
};

export default AddStudentDrawer;
