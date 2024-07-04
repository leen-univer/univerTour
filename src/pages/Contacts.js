import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
import {
	Card,
	CardContent,
	ListItem,
	ListItemText,
	Typography,
} from "@mui/material";
import { useContacts } from "hooks";
import moment from "moment";

const Contacts = () => {
	const { contacts } = useContacts();

	return (
		<section className="py-2">
			<MaterialTable
				data={contacts?.map((item, i) => ({ ...item, sl: i + 1 })) || []}
				title="Contacts"
				columns={[
					{
						title: "#",
						field: "sl",
						width: "10%",
					},
					{
						title: "University Name",
						field: "universityName",
						render: ({ name, email, picture }) => (
							<>
								<ListItem>
									<ListItemText primary={name} secondary={`${email}`} />
								</ListItem>
							</>
						),
					},
					{ title: "Phone", field: "phoneNumber" },
					{ title: "Email", field: "email", hidden: true, export: true },
					{ title: "Subject", field: "subject" },
					{
						title: "timestamp",
						field: "timestamp",
						render: ({ timestamp }) =>
							moment(timestamp).format("Do MMM YYYY hh:mm A"),
						customSort: (a, b) =>
							new Date(b?.timestamp) - new Date(a?.timestamp),
					},
				]}
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
									minWidth: 275,
									maxWidth: 700,
									transition: "0.3s",
									margin: "auto",
									borderRadius: "10px",
									fontWeight: "bolder",
									wordWrap: "break-word",
									padding: "20px",
									boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
									"&:hover": {
										boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
									},
								}}
							>
								<CardContent>
									<h2 style={{ marginBottom: "5px" }}>Message</h2>
									<Typography
										style={{
											fontWeight: "bold",
											color: "black",
											wordWrap: "break-word",
										}}
									>
										{rowData.message}
									</Typography>
								</CardContent>
							</Card>
						</div>
					);
				}}
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
					// selection: true,
					actionsColumnIndex: -1,
				}}
				style={{
					boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
					borderRadius: "8px",
				}}
				editable={
					{
						// onRowAdd: async (newData) => {
						//   console.log(newData);
						// },
						// onRowUpdate: async (oldData, newData) => {
						//   console.log(oldData);
						// },
						// onRowDelete: async (oldData) => {
						//   console.log(oldData);
						// },
					}
				}
				// actions={[
				//   {
				//     tooltip: "Remove All Selected Users",
				//     icon: "delete",
				//     onClick: (evt, data) => console.log(data),
				//   },
				//   {
				//     tooltip: "Send Reply to all selected users",
				//     icon: "send",
				//     onClick: (evt, data) => setSelectedUsers(data),
				//   },
				// ]}
				isLoading={!contacts}
			/>
			{/* <SendReply
        selectedUsers={selectedUsers}
        handleClose={() => setSelectedUsers([])}
      /> */}
		</section>
	);
};

export default Contacts;
