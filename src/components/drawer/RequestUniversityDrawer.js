import { getArrFromObj } from "@ashirbad/js-core";
import { School } from "@mui/icons-material";
import {
	Avatar,
	Container,
	Drawer,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from "@mui/material";

const RequestUniversityDrawer = ({ open, setOpenRequestUniversityDrawer }) => {


	return (
		<>
			<Drawer
				anchor="right"
				open={open}
				onClose={() => setOpenRequestUniversityDrawer(false)}
			>
				<Container
					style={{
						width: "25vw",
						marginTop: "12vh",
					}}
				>
					{getArrFromObj(open?.AcceptedUniversity)?.length > 0 && (
						<Typography align="center" color="text.primary" variant="h5">
							Participated Universities
						</Typography>
					)}
					{getArrFromObj(open?.AcceptedUniversity)?.length > 0 ? (
						getArrFromObj(open?.AcceptedUniversity)?.map((store) => {
							return (
								<>
									<div key={store?.key}>
										<List>
											<ListItem
												sx={{
													paddingLeft: "1.4vw",
													marginTop: "0vh",
												}}
											>
												<ListItemAvatar>
													<Avatar
														variant="outlined"
														src={store?.imageURL}
														sx={{ background: "#1877f2" }}
													>
														<School />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary={store?.displayName}
													secondary={
														<>
															{/* <div>Ph.no: {store?.phoneNumber}</div>
														<div>Email: {store?.email}</div>
														<div>Country: {store?.country}</div>
														<div>Location: {store?.location}</div> */}
															{/* Web:{" "}
														<a
															href={`${store?.website}`}
															style={{ textDecoration: "none" }}
															target="_blank"
															rel="noreferrer"
														>
															{store?.website}{" "}
														</a> */}
														</>
													}
													primaryTypographyProps={{
														fontWeight: "bold",
														fontSize: "1.5vw",
														color: "#1877f2",
														// marginTop: "2vh",
													}}
													secondaryTypographyProps={{
														fontSize: "1vw",
														marginTop: "1vh",
													}}
												/>
											</ListItem>
										</List>
									</div>
								</>
							);
						})
					) : (
						<Typography align="center" color="text.primary" variant="h6">
							No university Found
						</Typography>
					)}
				</Container>
			</Drawer>
		</>
	);
};

export default RequestUniversityDrawer;
