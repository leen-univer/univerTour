import { createTheme } from "@mui/material/";
import { purple } from "@mui/material/colors";
import { useAppContext } from "contexts";
import { useIsMounted } from "hooks";
import { useEffect, useState } from "react";
const boxShadow = "#6a1b9a3d 0px 8px 16px 0px";

const Theme = {
	palette: {
		primary: {
			main: "rgb(37, 82, 167)",
		},
	},
	typography: {
		fontFamily: "'Lato', sans-serif",
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: "8px",
					paddingBottom: "8px",
					paddingTop: "8px",
				},
				contained: {
					boxShadow,
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: "8px",
					boxShadow,
				},
			},
		},
	},
};
const useCustomTheme = () => {
	const { isDarkTheme } = useAppContext();
	const { isMounted } = useIsMounted();
	const [theme, setTheme] = useState(
		createTheme({
			...Theme,
			palette: { ...Theme.palette },
		})
	);

	useEffect(() => {
		if (isDarkTheme)
			return (
				isMounted.current &&
				setTheme(
					createTheme({
						...Theme,
						palette: {
							...Theme.palette,
							mode: "dark",
							primary: { main: purple["A700"] },
						},
					})
				)
			);
		isMounted.current &&
			setTheme(
				createTheme({
					...Theme,
					components: {
						...Theme.components,
						MuiAppBar: {
							styleOverrides: {
								root: {
									backgroundColor: "#fff",
									color: "#000",
								},
							},
						},
					},
				})
			);
	}, [isDarkTheme, isMounted]);
	return {
		theme,
	};
};

export default useCustomTheme;
