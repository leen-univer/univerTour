import { getArrFromObj } from "@ashirbad/js-core";
import {
	CreditScore,
	Upcoming,
	AssignmentTurnedIn,
	Event,
	EventAvailable,
	NotificationsActive,
	Add,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import { Card as DashboardCard } from "components/dashboard";
import { useSchoolFairs } from "hooks";

// import { useAppContext } from "contexts";
// import { useStudents } from "hooks";

const SchoolDashboard = () => {
	// // const { user } = useAppContext();
	// const { students } = useStudents();

	// const upcomingEvents = students?.filter(
	// 	(item) => new Date(item?.date) >= new Date()
	// );
	// const pastEvents = students
	// 	?.filter((item) => new Date(item?.date) < new Date())
	// 	?.slice()
	// 	?.sort((a, b) => new Date(b?.date) - new Date(a?.date));
	// const totalEvents = upcomingEvents?.concat(pastEvents);

	// const unreadMessage = notifications.filter(
	// 	(notification) => notification.read === false
	// );
	const { schoolFairs } = useSchoolFairs();
	const upcomingEvents = schoolFairs?.filter(
		(item) => new Date(item?.date) >= new Date()
	);

	const pastEvents = schoolFairs
		?.filter((item) => new Date(item?.date) < new Date())
		?.slice()
		?.sort((a, b) => new Date(b?.date) - new Date(a?.date));
	// console.log(pastEvents);

	return (
		<>
			<section className="py-2">
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6} md={6} lg={3}>
						<DashboardCard
							title={"Host Your Next Fair"}
							subtitle={`Add your new fair`}
							icon={<Add />}
							onClick={"/add-fairs"}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={6} lg={3}>
						<DashboardCard
							title={schoolFairs?.length || "00"}
							subtitle="Total Fairs"
							icon={<Event />}
							onClick={""}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={6} lg={3}>
						<DashboardCard
							title={upcomingEvents?.length || "00"}
							subtitle="Upcoming Fairs"
							icon={<Upcoming />}
							onClick={"/upcoming-fairs"}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={6} lg={3}>
						<DashboardCard
							title={pastEvents?.length || "00"}
							subtitle="Our Previous Fairs"
							icon={<EventAvailable />}
							onClick={"/completed-fairs"}
						/>
					</Grid>
					{/* <Grid item xs={12} sm={6} md={6} lg={3}>
						<DashboardCard
							title={"00"}
							subtitle="Notifications"
							icon={<NotificationsActive />}
							onClick={"/exclusive-leads"}
						/>
					</Grid> */}
				</Grid>
			</section>
		</>
	);
};

export default SchoolDashboard;
