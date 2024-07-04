import { getArrFromObj } from "@ashirbad/js-core";
import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
// import ExportCsv from "@material-table/exporters/csv";
import { Female, Male } from "@mui/icons-material";
import { Button, Chip, ListItem, ListItemText } from "@mui/material";
import { database } from "configs";
import { useAppContext } from "contexts";
import { useUniversities } from "hooks";
import moment from "moment";
import Swal from "sweetalert2";

const RequestedExclusiveCredits = () => {
	const { snackBarOpen } = useAppContext();
	const { universities } = useUniversities();
	const university = universities.filter(
		(university) => university.exclusiveBy
	);
	const University = university.sort(
		(a, b) => new Date(b.exclusiveRequestAt) - new Date(a.exclusiveRequestAt)
	);
	// console.log(University);
	const handleBulkReject = (data) => {
		// console.log(data);
		data.forEach((item) => {
			database.ref(`Users/${item?.uid}/exclusiveBy/${item.id}`).update({
				isPaid: "rejected",
			});
		});
		snackBarOpen("Rejected All Requests", "error");
	};
	const handleBulkAccept = async (data, UniversityCredits, UID) => {
		// console.log(data);
		const totalCreditsRequired = data.reduce(
			(accumulator, currentValue) => accumulator + +currentValue.credits,
			0
		);
		if (UniversityCredits >= totalCreditsRequired) {
			data.forEach((item) => {
				database.ref(`NewFairs/${item?.id}/exclusiveTo/${item.uid}`).update({
					uid: item.uid,
					timestamp: new Date().toString(),
				});
				database.ref(`Users/${item?.uid}/exclusiveBy/${item.id}`).remove();
				University.forEach(
					(data) =>
						database.ref(`Users/${data?.uid}/exclusiveBy/${item.id}`).remove
				);
			});
			await database.ref(`CreditTransactions/${UID}`).push({
				timestamp: new Date().toString(),
				oldAmount: UniversityCredits,
				amountDebited: totalCreditsRequired,
				newAmount: UniversityCredits - totalCreditsRequired,
				type: "-",
				message: "Debited",
			});
			await database
				.ref(`Users/${UID}/`)
				.update({ creditAmount: UniversityCredits - totalCreditsRequired });
			snackBarOpen("Accepted All Requests", "success");
		} else {
			Swal.fire({
				text: "University does not have enough credits",
				icon: "error",
			});
		}
	};
	return (
		<section className="py-2">
			<MaterialTable
				data={University.map((item, i) => ({ ...item, sl: i + 1 }))}
				title="Requested Exclusive Leads"
				columns={[
					{
						title: "#",
						field: "sl",

						width: "10%",
					},
					{
						title: "University Info",
						field: "name",
						render: ({ displayName, email, picture }) => (
							<>
								<ListItem>
									<ListItemText primary={displayName} secondary={`${email}`} />
								</ListItem>
							</>
						),
					},
					{ title: "Email", field: "email", hidden: true, export: true },
					{
						title: "Phone",
						field: "phoneNumber",
					},
					{
						title: "Leads Requested",
						render: ({ exclusiveBy }) => getArrFromObj(exclusiveBy).length,
					},
					{
						title: "Requested At",
						field: "exclusiveRequestAt",
						render: ({ exclusiveRequestAt }) =>
							moment(exclusiveRequestAt).format("Do MMM YYYY hh:mm A"),
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
					selection: false,
					actionsColumnIndex: -1,
				}}
				style={{
					boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
					borderRadius: "8px",
				}}
				detailPanel={({ rowData }) => {
					const UniversityCredits = rowData?.creditAmount;
					const UID = rowData.uid;
					// console.log(UniversityCredits);
					const exclusiveBy = getArrFromObj(rowData?.exclusiveBy).sort(
						(a, b) => new Date(b?.timestamp) - new Date(a?.timestamp)
					);
					return (
						<MaterialTable
							data={
								getArrFromObj(exclusiveBy).map((item, i) => ({
									...item,
									sl: i + 1,
								})) || []
							}
							title={rowData.displayName + " Requested Students"}
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
									render: ({ displayName, email }) => (
										<>
											<ListItem>
												<ListItemText
													primary={displayName}
													secondary={`${email}`}
												/>
											</ListItem>
										</>
									),
								},
								{
									title: "Email",
									field: "email",
									hidden: true,
									export: true,
								},
								{
									title: "Phone",
									field: "phoneNumber",
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
								{ title: "Credits", field: "credits" },
								{
									title: "Status",
									render: ({ isPaid }) =>
										isPaid === "rejected" ? (
											<Chip size="small" label="rejected" color="error" />
										) : (
											<Chip size="small" label="pending" color="info" />
										),
								},
								{
									title: "Requested At",
									field: "timestamp",
									render: ({ timestamp }) =>
										moment(timestamp).format("Do MMM YYYY hh:mm A"),
									editable: "never",
								},
							]}
							actions={[
								{
									tooltip: "Accept All Request",
									icon: "done",
									onClick: (evt, data) =>
										handleBulkAccept(data, UniversityCredits, UID),
								},
								{
									tooltip: "Cancel All Request",
									icon: "cancel",
									onClick: (evt, data) => handleBulkReject(data),
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
								selection: true,
								actionsColumnIndex: -1,
							}}
							style={{
								boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
								borderRadius: "8px",
							}}
							isLoading={!getArrFromObj(rowData?.requested)}
						/>
					);
				}}
			/>
		</section>
	);
};

export default RequestedExclusiveCredits;
