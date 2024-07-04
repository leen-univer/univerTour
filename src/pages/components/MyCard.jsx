import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Container, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { Person } from "@mui/icons-material";
export default function MyCard() {
	return (
		<Container className="main-card-container">
			<Card sx={{ minWidth: 275 }} className="card-border-style">
				<CardContent>
					<div className="card-icon-container">
						<div className="card-halfpart">
							<div className=" card-display-flex">
								<SchoolIcon className="first-card-item" />
								<span className="first-card-text">
									<Typography
										variant="h4"
										className="Card-text-size"
										sx={{
											fontSize: {
												lg: 34,
												md: 30,
												sm: 25,
												xs: 25,
											},
										}}
									>
										4,000+
									</Typography>
									<Typography variant="body1">School/Institute</Typography>
								</span>
							</div>
							<div className="second-card-item card-display-flex">
								<Person className="first-card-item" />
								<span className="first-card-text">
									<Typography
										variant="h4"
										className="Card-text-size"
										sx={{
											fontSize: {
												lg: 34,
												md: 30,
												sm: 25,
												xs: 25,
											},
										}}
									>
										10,000+
									</Typography>
									<Typography variant="body1">Teacher</Typography>
								</span>
							</div>
						</div>

						<div className="card-secondpart">
							<div className="third-card-item card-display-flex">
								<GroupsIcon className="first-card-item" />
								<span className="first-card-text">
									<Typography
										variant="h4"
										className="Card-text-size"
										sx={{
											fontSize: {
												lg: 34,
												md: 30,
												sm: 25,
												xs: 25,
											},
										}}
									>
										3,50,000+
									</Typography>
									<Typography variant="body1">Student</Typography>
								</span>
							</div>
							<div className="fourth-card-item card-display-flex">
								<LocalLibraryIcon className="first-card-item" />
								<span className="first-card-text">
									<Typography
										variant="h4"
										className="Card-text-size"
										sx={{
											fontSize: {
												lg: 34,
												md: 30,
												sm: 25,
												xs: 25,
											},
										}}
									>
										3,00,000+
									</Typography>
									<Typography variant="body1">Learning Content</Typography>
								</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</Container>
	);
}
