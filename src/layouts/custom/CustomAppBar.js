import { styled, AppBar } from "@mui/material";
import { drawerWidth } from "./LayoutConfigs";
const CustomAppBar = styled(AppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	background: "#fff",
	border: "0px",
	backdropFilter: "blur(6px)",
	boxShadow: "#6a1b9a3d 0px 0px 0px 0px",
	color: "rgb(37, 82, 167)",
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));
export default CustomAppBar;
