import MaterialTable from "@material-table/core";
import { IconButton, Tooltip } from "@mui/material";
// import ExportCsv from "@material-table/exporters/csv";
import { ExportCsv } from "@material-table/exporters";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Card, CardContent, Typography } from "@mui/material";
import { SendNotification } from "components/dialog";
import { RequestEventDrawer } from "components/drawer";
import { useRequestedUniversities, useStudents } from "hooks";
import moment from "moment";
import { useState } from "react";

const RequestEvent = () => {
	const { students } = useStudents();
	const { requestedUniversities } = useRequestedUniversities();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [openAddStudentDrawer, setOpenAddStudentDrawer] = useState(false);

	return (
		<section className="py-2">
			<RequestEventDrawer
				open={openAddStudentDrawer}
				setOpenAddStudentDrawer={setOpenAddStudentDrawer}
			/>
			<MaterialTable
				data={students.map((student, i) => ({ ...student, sl: i + 1 }))}
				title="Requested Events"
				columns={[
					{
						title: "#",
						field: "sl",
						width: "10%",
					},
					{
						title: "Name",
						field: "displayName",
					},

					{ title: "City", field: "city" },

					{ title: "School System", field: "schoolName", export: true },

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
					},

					{ title: "Start Time", field: "time", emptyValue: "--" },
					{
						title: "End Time",
						field: "endTime",
						emptyValue: "--",
					},

					{
						title: "Number Of Students",
						field: "studentCount",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: { textAlign: "center" },
					},
					{
						title: "Contact Person",
						field: "contactName",
						hidden: true,
						export: true,
					},
					{ title: "Location", field: "location", hidden: true, export: true },

					{
						title: "Participation Credit",
						searchable: true,
						field: "credits",
						type: "numeric",
						filtering: false,
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: { textAlign: "center" },
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
						title: "Requests",
						field: "requests",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: { textAlign: "center" },
						render: (rowData) => (
							<Tooltip title="Requested Universities">
								<IconButton color="primary">
									<GroupAddIcon
										fontSize="large"
										onClick={() => setOpenAddStudentDrawer(rowData)}
									/>
								</IconButton>
							</Tooltip>
						),
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
									boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
									"&:hover": {
										boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
									},
								}}
							>
								<CardContent>
									<Typography
										variant="body1"
										component="p"
										gutterBottom
										align="left"
									>
										Location:{" "}
										<span
											style={{
												color: "rgb(30, 136, 229)",
												fontSize: "15px",
											}}
										>
											{rowData?.link}
										</span>
									</Typography>

									<Typography variant="body1" gutterBottom align="left">
										Notes:{" "}
										<span
											style={{ color: "rgb(30, 136, 229)", fontSize: "15px" }}
										>
											{rowData?.notes}
										</span>
									</Typography>
								</CardContent>
							</Card>
						</div>
					);
				}}
				isLoading={!requestedUniversities}
			/>
			<SendNotification
				selectedUsers={selectedUsers}
				handleClose={() => setSelectedUsers([])}
			/>
		</section>
	);
};

export default RequestEvent;
