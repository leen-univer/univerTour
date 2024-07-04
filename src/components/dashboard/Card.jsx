import {
	Avatar,
	CardHeader,
	CardActionArea,
	Card as MUICard,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Card = ({ icon, title, subtitle, onClick }) => {
	const navigate = useNavigate();
	return (
		<>
			<MUICard className="d-card gradient">
				<CardActionArea onClick={() => navigate(`${onClick}`)}>
					<CardHeader
						avatar={
							<Avatar sx={{ backgroundColor: "rgb(37, 82, 167)" }}>
								{icon}
							</Avatar>
						}
						title={title}
						subheader={subtitle}
						titleTypographyProps={{ variant: "h5" }}
						subheaderTypographyProps={{ variant: "h6" }}
					/>
				</CardActionArea>
			</MUICard>
		</>
	);
};

export default Card;
