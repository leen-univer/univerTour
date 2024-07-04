import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

export default function TemporaryDrawer() {
	const navigate = useNavigate();

	const [state, setState] = useState({
		top: false,
	});

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	const list = (anchor) => (
		<Box
			sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<List>
				<ListItem
					className="center-div change_new_clr"
					component="a"
					href=""
					button
				>
					<ListItemText primary={"Home"} />
				</ListItem>

				<ListItem
					className="center-div change_new_clr"
					component="a"
					href="#ContactUs"
					button
				>
					<ListItemText primary={"Contact Us"} />
				</ListItem>
			</List>

			<List>
				<ListItem
					className="center-div change_new_clr"
					onClick={() => navigate("/login")}
					button
				>
					<ListItemText className="book-demo" primary={"Login"} />
				</ListItem>
				<ListItem
					className="center-div change_new_clr"
					button
					onClick={() => navigate("/university-register")}
				>
					<ListItemText
						className="new-started change_new_bg_clr"
						primary={"Register"}
					/>
				</ListItem>
			</List>
		</Box>
	);

	return (
		<div>
			<>
				<Button
					className="burger change_new_clr"
					onClick={toggleDrawer("top", true)}
				>
					<MenuIcon />
				</Button>
				<Drawer
					anchor={"top"}
					open={state["top"]}
					onClose={toggleDrawer("top", false)}
				>
					{list("top")}
				</Drawer>
			</>
		</div>
	);
}
