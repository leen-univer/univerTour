import MaterialTable from "@material-table/core";
import ExportPdf from "@material-table/exporters/pdf";
import ExportCsv from "@material-table/exporters/csv";
import { Female, Male } from "@mui/icons-material";
import {
	Avatar,
	Button,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from "@mui/material";
import { SendNotification } from "components/dialog";
import { useUsers } from "hooks";
import { useState } from "react";

const Users = () => {
	const { users } = useUsers();
	const [selectedUsers, setSelectedUsers] = useState([]);
	return (
		<section className="py-2">
			<MaterialTable
				data={users || []}
				title="Users"
				columns={[
					{
						title: "#",
						field: "id",
						render: ({ index }) => index + 1,
						width: "10%",
					},
					{
						title: "Name",
						field: "name",
						render: ({ displayName, email, picture }) => (
							<>
								<ListItem>
									<ListItemAvatar>
										<Avatar src={picture?.thumbnail} />
									</ListItemAvatar>
									<ListItemText primary={displayName} secondary={`${email}`} />
								</ListItem>
							</>
						),
					},
					{ title: "Email", field: "email", hidden: true, export: true },
					{ title: "Phone", field: "phone" },
					{ title: "Country", field: "country" },
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
					{ title: "Created At", field: "created_at" },
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
					selection: true,
					actionsColumnIndex: -1,
				}}
				style={{
					boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
					borderRadius: "8px",
				}}
				editable={{
					onRowDelete: async (oldData) => {
						console.log(oldData);
					},
				}}
				actions={[
					{
						tooltip: "Remove All Selected Users",
						icon: "delete",
						onClick: (evt, data) => console.log(data),
					},
					{
						tooltip: "Send notification to all selected users",
						icon: "send",
						onClick: (evt, data) => setSelectedUsers(data),
					},
				]}
				isLoading={!users}
			/>
			<SendNotification
				selectedUsers={selectedUsers}
				handleClose={() => setSelectedUsers([])}
			/>
		</section>
	);
};

export default Users;
