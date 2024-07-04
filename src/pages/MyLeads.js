import { getArrFromObj } from "@ashirbad/js-core";
import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
// import ExportCsv from "@material-table/exporters/csv";
import { Female, Male } from "@mui/icons-material";
import {
	Button,
	Card,
	CardContent,
	ListItem,
	ListItemText,
	Skeleton,
	Typography,
} from "@mui/material";
// import { SendNotification } from "components/dialog";
import { auth } from "configs";
import { useStudents } from "hooks";
import moment from "moment";

const Leads = () => {
	const { students } = useStudents();
	const leads = students.filter((lead) => !lead.exclusiveTo);
	const NormalLeads = leads.filter((student) =>
		getArrFromObj(student.accepted).find(
			(item) => item.uid === auth.currentUser.uid
		)
	);

	return (
		<section className="py-2">
			<MaterialTable
				data={NormalLeads.map((item, i) => ({ ...item, sl: i + 1 })) || []}
				title="Unlock Leads"
				columns={[
					{
						title: "#",
						field: "sl",
						editable: "never",
						width: "10%",
					},
					{
						title: "Name",
						field: "displayName",
						render: ({ displayName, email, accepted }) => (
							<>
								<ListItem>
									<ListItemText
										primary={displayName}
										secondary={
											Boolean(
												getArrFromObj(accepted)?.find(
													(item) => item?.uid === auth.currentUser.uid
												)
											) ? (
												`${email}`
											) : (
												<Skeleton
													animation="wave"
													height={"12px"}
													width={"80%"}
												/>
											)
										}
									/>
								</ListItem>
							</>
						),
					},
					{ title: "Email", field: "email", hidden: true, export: true },
					{
						title: "Phone",
						field: "phoneNumber",
						render: ({ phoneNumber, accepted }) =>
							Boolean(
								getArrFromObj(accepted)?.find(
									(item) => item?.uid === auth.currentUser.uid
								)
							) ? (
								phoneNumber
							) : (
								<Skeleton animation="wave" height={"12px"} width={"80%"} />
							),
					},
					{ title: "Interested Program", field: "interestedProgram" },

					{
						title: "Gender",
						field: "gender",
						render: ({ gender }) => (
							<Button
								startIcon={gender === "male" ? <Male /> : <Female />}
								variant="outlined"
								size="small"
								color={gender === "male" ? "success" : "info"}
							>
								{gender}
							</Button>
						),
					},
					{ title: "Unlock Credits", field: "credits" },

					{
						title: "Unlock At",
						customSort: (a, b) =>
							new Date(b?.timestamp) - new Date(a?.timestamp),
						field: "timestamp",
						render: ({ accepted }) =>
							moment(accepted?.[auth.currentUser.uid]?.timestamp).format(
								"Do MMM YYYY hh:mm A"
							),
						editable: "never",
						emptyValue: "--",
					},
				]}
				options={{
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
					actionsColumnIndex: -1,
				}}
				style={{
					boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
					borderRadius: "8px",
				}}
				detailPanel={({ rowData }) => {
					return (
						<div
							style={{
								padding: "20px",
								margin: "auto",
								backgroundColor: "#eef5f9",
							}}
						>
							<Card
								sx={{
									minWidth: 400,
									maxWidth: 450,
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
									<Typography
										variant="h6"
										component="p"
										gutterBottom
										align="left"
									>
										Current University or School Name:
										<span
											style={{
												color: "rgb(30, 136, 229)",
												fontSize: "15px",
											}}
										>
											{rowData?.schoolName}
										</span>{" "}
									</Typography>
									<Typography
										variant="h6"
										component="p"
										gutterBottom
										align="left"
									>
										Current Education Level:
										<span
											style={{
												color: "rgb(30, 136, 229)",
												fontSize: "15px",
											}}
										>
											{rowData?.qualification}
										</span>{" "}
									</Typography>
									<Typography variant="h6" gutterBottom align="left">
										City:
										<span
											style={{ color: "rgb(30, 136, 229)", fontSize: "15px" }}
										>
											{rowData?.city}
										</span>
									</Typography>
									<Typography variant="h6" gutterBottom align="left">
										Nationality:
										<span
											style={{ color: "rgb(30, 136, 229)", fontSize: "15px" }}
										>
											{rowData?.nationality}
										</span>
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
											{rowData?.univerNotes}{" "}
										</span>
									</Typography>
								</CardContent>
							</Card>
						</div>
					);
				}}
				isLoading={!NormalLeads}
			/>
			{/* <SendNotification
        selectedUsers={selectedUsers}
        handleClose={() => setSelectedUsers([])}
      /> */}
		</section>
	);
};

export default Leads;
