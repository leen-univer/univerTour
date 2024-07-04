import { useContext } from "react";
import { AppContext } from "./AppContextProvider";

const useAppContext = () => {
	const {
		user,
		setUser,
		login,
		snack,
		loader,
		logout,
		snackBarOpen,
		snackBarClose,
		isDarkTheme,
		setIsDarkTheme,
		loginUser,
		sendNotification,
		sendMail,
	} = useContext(AppContext);
	return {
		snack,
		user,
		setUser,
		login,
		loader,
		logout,
		isDarkTheme,
		snackBarOpen,
		snackBarClose,
		setIsDarkTheme,
		loginUser,
		sendNotification,
		sendMail,
	};
};

export default useAppContext;
