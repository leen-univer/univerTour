import { getArrFromObj } from "@ashirbad/js-core";
import MaterialTable from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
// import ExportCsv from "@material-table/exporters/csv";
import { Avatar, Card, CardContent, Typography } from "@mui/material";
import { auth } from "configs";
import { useAppContext } from "contexts";
import { useStudents } from "hooks";
import moment from "moment";
import { useParams } from "react-router-dom";




const UpcomingFairs = () => {
	const params = useParams();
	const { students } = useStudents();
	const { user } = useAppContext();
	const ExclusiveLeads = students?.filter((student) =>
		getArrFromObj(student?.exclusiveTo).find(
			(item) => item.uid === auth.currentUser.uid
		)
	);
	const exclusiveLeads = ExclusiveLeads?.slice()?.sort(
		(a, b) =>
			new Date(b?.exclusiveTo?.[auth?.currentUser?.uid]?.timestamp) -
			new Date(a?.exclusiveTo?.[auth?.currentUser?.uid]?.timestamp)
	);
	
	// console.log(
	//   getArrFromObj(user?.upcomingFairs).filter(
	//     (item) => new Date(item?.date) >= new Date()
	//   )
	// );
	// console.log(user);
	return (
		<section className="py-2">
			<MaterialTable
				data={
					getArrFromObj(user?.upcomingFairs)
						?.filter((item) => new Date(item?.date) >= new Date())
						?.slice()
						?.sort((a, b) => new Date(a?.date) - new Date(b?.date))
						.map((item, i) => ({
							...item,
							sl: i + 1,
							fairDate: moment(item?.date).format("LL"),
						})) || []
				}
				title="Upcoming Fairs"
				columns={[
					{
						title: "#",
						field: "sl",
						editable: "never",
						width: "10%",
					},
					{
						title: "Image",
						searchable: true,
						field: "imageURL",
						filtering: false,
						render: ({ imageURL, displayName }) => (
							<Avatar src={imageURL} className="!h-24 !w-32" variant="rounded">
								{displayName?.[0]}
							</Avatar>
						),
					},
					{
						title: "Name",
						field: "displayName",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
					},
					{
						title: "City",
						field: "cityName",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
					},
					{
						title: "Country",
						searchable: true,
						field: "countryName",
					},
					{ title: "Email", field: "email", hidden: true, export: true },
					{
						title: "School System",
						field: "schoolName",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
					},
					{
						title: "Fair Date",
						field: "fairDate",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
						// render: (row) => {
						// 	moment(row?.date).format("LL");
						// },
					},
					{
						title: "Start Time",
						field: "time",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
					},
					{
						title: "Number Of Students",
						field: "studentCount",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
					},

			
				]}
				options={{
					detailPanelColumnAlignment: "right",
					exportAllData: true,
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
				
				detailPanel={[
					{
					

						render: ({ rowData }) => (
							<>
								<div
									style={{
										padding: "2px",
										margin: "auto",
										backgroundColor: "#eef5f9",
									}}
								>
									<Card
										sx={{
											minWidth: 400,
											maxWidth: 950,
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
												Registration Link:{" "}
												<a
													href={`${rowData?.regLink}`}
													style={{ textDecoration: "none", fontSize: "1rem" }}
													target="_blank"
													rel="noreferrer"
												>
													{rowData?.regLink}{" "}
												</a>
											</Typography>
											<Typography variant="h6" gutterBottom align="left">
  Studenttttttttttttt Fair Link:{" "}
  {rowData?.fairLink !== undefined ? (
    <a
      href={rowData?.fairLink}
      style={{ textDecoration: "none", fontSize: "1rem" }}
      target="_blank"
      rel="noreferrer"
    >
      {rowData?.fairLink}
    </a>
  ) : (
    "Fair Link is not defined"
  )}
</Typography>



											<Typography variant="h6" gutterBottom align="left">
												Location Link:{" "}
												<a
													href={`${rowData?.link}`}
													style={{ textDecoration: "none", fontSize: "1rem" }}
													target="_blank"
													rel="noreferrer"
												>
													{rowData?.link}{" "}
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
											title: "Student Id",
											searchable: true,
											field: "id",
										},
										{
											title: "Name",
											field: "name",
											searchable: true,
										},
										{
											title: "Email",
											field: "email",
											export: true,
											searchable: true,
										},
										{ title: "Phone", field: "phoneNumber", searchable: true },
										{
											title: "Age",
											field: "age",
											export: true,
											searchable: true,
										},
										{
											title: "Gender",
											field: "gender",
											export: true,
											searchable: true,
										},
										{
											title: "Nationality",
											field: "nationality",
											export: true,
											searchable: true,
										},
										{
											title: "Area Of Interest",
											field: "areaOfInterest",
											export: true,
											searchable: true,
										},
										{
											title: "Created At",
											editable: "never",
											field: "timestamp",
											filtering: false,
											render: ({ timestamp }) =>
												moment(new Date(timestamp)).format("lll"),
										},
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
				isLoading={!exclusiveLeads}
			/>
			{/* <SendNotification
					selectedUsers={selectedUsers}
					handleClose={() => setSelectedUsers([])}
				/> */}
		</section>
	);
};

export default UpcomingFairs;
