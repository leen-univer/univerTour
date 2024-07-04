import { getArrFromObj } from "@ashirbad/js-core";
import {
  CreditScore,
  Upcoming,
  AssignmentTurnedIn,
  Event,
  InsertDriveFile,
  Photo,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import { Card as DashboardCard } from "components/dashboard";
import { useAppContext } from "contexts";
import { useStudents } from "hooks";

const UniversityDashboard = () => {
  const { user } = useAppContext();
  const { students } = useStudents();

  const upcomingEvents = students?.filter(
    (item) => new Date(item?.date) >= new Date()
  );
  const pastEvents = students
    ?.filter((item) => new Date(item?.date) < new Date())
    ?.slice()
    ?.sort((a, b) => new Date(b?.date) - new Date(a?.date));
  const totalEvents = upcomingEvents
    ?.concat(pastEvents)
    ?.filter((event) => user?.cities?.includes(event?.city));

  // const unreadMessage = notifications.filter(
  // 	(notification) => notification.read === false
  // );
  return (
    <>
      <section className="py-2">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <DashboardCard
              // title={totalEvents?.length || "00"}
              subtitle="My Itinerary"
              icon={<Event />}
              onClick={"/itinerary"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <DashboardCard
              // title={
              //   getArrFromObj(user?.upcomingFairs)?.filter(
              //     (item) => new Date(item?.date) >= new Date()
              //   )?.length || "00"
              // }
              subtitle="My Documents"
              icon={<InsertDriveFile />}
              onClick={"/documents"}
            />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={6} lg={3}>
            <DashboardCard
              title={user?.creditAmount || "00"}
              subtitle="Remaining Credits"
              icon={<CreditScore />}
              onClick={"/credits"}
            />
          </Grid> */}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <DashboardCard
              // title={
              //   getArrFromObj(user?.upcomingFairs)?.filter(
              //     (item) => new Date(item?.date) < new Date()
              //   )?.length || "00"
              // }
              subtitle="Photo Wall"
              icon={<Photo />}
              onClick={"/photos"}
            />
          </Grid>
        </Grid>
      </section>
    </>
  );
};

export default UniversityDashboard;
