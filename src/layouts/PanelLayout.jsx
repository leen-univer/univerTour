import { useState } from "react";
import { Box } from "@mui/material";
import DrawerLayout from "./DrawerLayout";
import HeaderLayout from "./HeaderLayout";
import { CustomDrawerHeader } from "./custom";

const PanelLayout = ({ children }) => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const handleDrawerOpen = () => setIsDrawerOpen(true);
	const handleDrawerClose = () => setIsDrawerOpen(false);

	return (
		<>
			<Box sx={{ display: "flex" }}>
				<HeaderLayout
					handleDrawerOpen={handleDrawerOpen}
					isDrawerOpen={isDrawerOpen}
				/>
				<DrawerLayout
					isDrawerOpen={isDrawerOpen}
					handleDrawerClose={handleDrawerClose}
				/>
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						p: 3,
						backgroundColor: "",
						minHeight: "100vh",
					}}
				>
					<CustomDrawerHeader />
					{children}
				</Box>
			</Box>
		</>
	);
};

export default PanelLayout;
