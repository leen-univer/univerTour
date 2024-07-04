import MaterialTable from "@material-table/core";
// import { ListItem, ListItemText } from "@mui/material";
// import ExportCsv from "@material-table/exporters";
import { Button, Card, CardContent, Skeleton, Typography } from "@mui/material";
import { AddStudentDrawer, EditStudentDrawer } from "components/drawer";
import RequestUniversityDrawer from "components/drawer/RequestUniversityDrawer";
import { auth, database } from "configs";
import { useAppContext } from "contexts";
import { useIsMounted, useNestedSchoolFairs, useUniversities } from "hooks";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
// import { useUniversities } from "hooks";
import { getArrFromObj } from "@ashirbad/js-core";
import { ExportCsv } from "@material-table/exporters";
import { Add, Cancel } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

const UniversityFairs = () => {
	const { isMounted } = useIsMounted();
	const params = useParams();
	const [time, setTime] = useState(new Date());
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
	const navigate = useNavigate();
	const { universities } = useUniversities();
	console.log(universities);
	const SUPERADMIN = universities?.filter(
		(university) => university?.role === "superadmin"
	)[0];
	const { sendNotification, user, sendMail } = useAppContext();
	const [openAddStudentDrawer, setOpenAddStudentDrawer] = useState(false);
	const [openEditStudentDrawer, setOpenEditStudentDrawer] = useState(false);
	const [openRequestUniversityDrawer, setOpenRequestUniversityDrawer] =
		useState(false);
	const { schoolFairs } = useNestedSchoolFairs();

	const upcomingEvents = schoolFairs?.filter(
		(item) => new Date(item?.date) >= new Date()
	);
	// const pastEvents = students
	// 	?.filter((item) => new Date(item?.date) < new Date())
	// 	?.slice()
	// 	?.sort((a, b) => new Date(b?.date) - new Date(a?.date));
	// const totalEvents = upcomingEvents?.concat(pastEvents);
	//   const { snackBarOpen } = useAppContext();
	// const { sendNotification, sendMail } = useAppContext();

	// const { universities } = useUniversities();
	// const Universities = universities.filter(
	//   (university) => university?.isA === "accepted"
	// );
	//   console.log(upcomingEvents);
	const handleCancel = async (row) => {
		console.log(row);
		try {
			await database.ref(`Users/${auth?.currentUser?.uid}`).update({
				creditAmount: +user?.creditAmount + +row?.credits,
				creditUpdatedTime: new Date().toString(),
			});
			await database.ref(`CreditTransactions/${auth?.currentUser?.uid}`).push({
				timestamp: new Date().toString(),
				oldAmount: +user?.creditAmount,
				amountAdded: +row?.credits,
				newAmount: +user?.creditAmount + +row?.credits,
				type: "+",
				message: "Credited",
			});

			const notification = {
				title: "Participation Cancelled",
				description: `Participation cancelled By ${user?.displayName} for fair ${row?.displayName}`,
				read: false,
				timestamp: new Date().toString(),
			};

			sendNotification({
				notification: {
					title: `Participation Cancelled `,
					body: `Participation Cancelled by ${user?.displayName} for fair ${row?.displayName}`,
				},
				FCMToken: SUPERADMIN?.fcmToken,
			});
			sendMail({
				to: SUPERADMIN?.email,
				subject: `Participation Request Cancel`,
				html: `Participation Request Cancel by ${user?.displayName} for fair ${row?.displayName}`,
			});
			database.ref(`Notifications/${SUPERADMIN?.uid}`).push(notification);

			await database
				.ref(
					`SchoolFairs/${row?._id}/${row?.id}/participationRequest/${auth?.currentUser?.uid}`
				)
				.remove();
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
				getArrFromObj(user?.upcomingFairs).find((item) => item?.id === row?.id)
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
	};
	const handleParticipate = async (row) => {
		// console.log(row);
		if (user?.creditAmount >= +row?.credits) {
			await database.ref(`CreditTransactions/${auth?.currentUser?.uid}`).push({
				timestamp: new Date().toString(),
				oldAmount: user?.creditAmount,
				amountDebited: +row?.credits,
				newAmount: user?.creditAmount - +row?.credits,
				type: "-",
				message: "Debited",
			});
			await database
				.ref(`Users/${auth?.currentUser?.uid}/`)
				.update({ creditAmount: user?.creditAmount - +row?.credits });
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
			Swal.fire({
				text: "You Don't have enough Credits",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Buy Now",
			}).then((result) => {
				if (result.isConfirmed) {
					navigate("/credits");
				}
			});
		}
	};
	return (
		<section className="py-2">
			<RequestUniversityDrawer
				open={openRequestUniversityDrawer}
				setOpenRequestUniversityDrawer={setOpenRequestUniversityDrawer}
			/>
			<AddStudentDrawer
				open={openAddStudentDrawer}
				setOpenAddStudentDrawer={setOpenAddStudentDrawer}
			/>
			<EditStudentDrawer
				open={openEditStudentDrawer}
				setOpenEditStudentDrawer={setOpenEditStudentDrawer}
			/>
			<MaterialTable
				data={upcomingEvents
					?.map((student, i) => ({
						...student,
						startDate: new Date(
							new Date(student?.date).getFullYear(),
							new Date(student?.date).getMonth(),
							new Date(student?.date).getDate(),
							+student?.time?.split(":")[0],
							+student?.time?.split(":")[1]
						),
						endDate: new Date(
							new Date(student?.date).getFullYear(),
							new Date(student?.date).getMonth(),
							new Date(student?.date).getDate(),
							+student?.endTime?.split(":")[0],
							+student?.endTime?.split(":")[1]
						),
					}))
					.slice()
					?.sort((a, b) => new Date(a?.startDate) - new Date(b?.startDate))
					.map((student, i) => ({ ...student, sl: i + 1 }))}
				title="School Fairs"
				columns={[
					{
						title: "#",
						field: "sl",
						editable: "never",
						filtering: false,
					},
					{
						title: "Name",
						searchable: true,
						field: "displayName",
						filtering: false,
					},
					{
						title: "City",
						searchable: true,
						field: "city",
					},

					{
						title: "School System",
						field: "schoolName",
						searchable: true,
						filtering: false,
					},
					{
						title: "Fair Date",
						searchable: true,
						field: "date",
						filtering: false,
						editable: "never",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
						render: (rowData) => moment(rowData?.date).format("LL"),
					},
					{ title: "Start Time", field: "time", emptyValue: "--" },
					{
						title: "End Time",
						field: "endTime",
						// headerStyle: {
						//   textAlign: "center",
						// },
						// cellStyle: {
						//   textAlign: "center",
						// },
						emptyValue: "--",
					},
					{
						title: "Number of Students",
						searchable: true,
						field: "studentCount",
						type: "numeric",
						filtering: false,
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
					},
					{
						title: "Participation Credit",
						searchable: true,
						field: "credits",
						type: "numeric",
						filtering: false,
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
					},
					{
						title: "Created At",
						searchable: true,
						field: "timestamp",
						render: ({ timestamp }) =>
							moment(timestamp).format("Do MMM YYYY hh:mm A"),
						customSort: (a, b) =>
							new Date(b?.timestamp) - new Date(a?.timestamp),
						filtering: false,
						editable: "never",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
					},
					{
						title: "Participate",
						field: "participate",
						render: (rowData) => (
							<>
								{getArrFromObj(rowData?.participationRequest)?.find(
									(item) => item?.uid === auth?.currentUser.uid
								) ||
									(getArrFromObj(rowData?.AcceptedUniversity)?.find(
										(item) => item?.id === auth?.currentUser.uid
									) &&
										!rowData?.isBooked) ? (
									<Button
										disabled={
											new Date() >
											new Date(
												new Date(rowData?.date).getFullYear(),
												new Date(rowData?.date).getMonth(),
												new Date(rowData?.date).getDate(),
												+rowData?.time?.split(":")[0],
												+rowData?.time?.split(":")[1]
											)
										}
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
				]}
				options={{
					detailPanelColumnAlignment: "right",
					filtering: false,
					sorting: true,
					exportAllData: true,
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
				// editable={{
				// 	onRowDelete: async (oldData) => {
				// 		try {
				// 			await database
				// 				.ref(`SchoolFairs/${user?.uid}/${oldData.id}`)
				// 				.remove();
				// 			snackBarOpen(
				// 				`Fair  ${oldData.displayName} Deleted Successfully`,
				// 				"success"
				// 			);
				// 		} catch (error) {
				// 			snackBarOpen(error.message, "error");
				// 			console.log(error);
				// 		}
				// 	},
				// }}
				actions={
					[
						// {
						// 	icon: "add",
						// 	tooltip: <strong>{"Add New Fair"}</strong>,
						// 	isFreeAction: true,
						// 	onClick: (evt, rowData) => setOpenAddStudentDrawer(true),
						// },
						// {
						// 	icon: "edit",
						// 	tooltip: <strong>{"Edit Fair"}</strong>,
						// 	onClick: (evt, rowData) => setOpenEditStudentDrawer(rowData),
						// },
					]
				}
				detailPanel={[
					{
						tooltip: "View Fair Details",
						icon: "info",
						openIcon: "visibility",

						render: ({ rowData }) => (
							<>
								{console.log(rowData)}
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
											maxWidth: 650,
											transition: "0.3s",
											margin: "auto",
											borderRadius: "10px",
											// fontFamily: italic,
											boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
											"&:hover": {
												boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
											},
										}}
									>
										<CardContent>
											<Typography variant="h6" gutterBottom align="left">
												Registration Link:
												<a
													href={rowData?.regLink}
													style={{ textDecoration: "none", fontSize: "1rem" }}
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

											<Typography variant="h6" gutterBottom align="left">
												Location Link:
												<a
													href={rowData?.link}
													style={{ textDecoration: "none", fontSize: "1rem" }}
													target="_blank"
													rel="noreferrer"
												>
													{rowData?.link}
												</a>
											</Typography>
											<Typography variant="h6" gutterBottom align="left">
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
										</CardContent>
									</Card>
								</div>
							</>
						),
					},

					{
						icon: "person",
						openIcon: "visibility",
						tooltip: "View Registered Students",
						render: ({ rowData }) => (
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
											(a, b) => new Date(b?.timestamp) - new Date(a?.timestamp)
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
											title: "Name",
											field: "name",
											searchable: true,
											render: ({ name }) =>
												Boolean(
													getArrFromObj(rowData?.AcceptedUniversity)?.find(
														(item) => item?.uid === auth.currentUser.uid
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
													getArrFromObj(rowData?.AcceptedUniversity)?.find(
														(item) => item?.uid === auth.currentUser.uid
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
													getArrFromObj(rowData?.AcceptedUniversity)?.find(
														(item) => item?.uid === auth.currentUser.uid
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
													getArrFromObj(rowData?.AcceptedUniversity)?.find(
														(item) => item?.uid === auth.currentUser.uid
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
													getArrFromObj(rowData?.AcceptedUniversity)?.find(
														(item) => item?.uid === auth.currentUser.uid
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
											title: "Created At",
											field: "timestamp",
											editable: "never",
											emptyValue: "--",
											render: ({ timestamp }) =>
												moment(timestamp).format("Do MMM YYYY hh:mm A"),
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
								/>
							</div>
						),
					},
				]}
				isLoading={!schoolFairs}
			/>
			{/* <SendNotification
				selectedUsers={selectedUsers}
				handleClose={() => setSelectedUsers([])}
			/> */}
		</section>
	);
};

export default UniversityFairs;
