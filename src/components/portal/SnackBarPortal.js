import React from "react";
import { createPortal } from "react-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAppContext } from "contexts";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackBarPortal() {
	const { snack, snackBarClose } = useAppContext();
	const handleClose = () => {
		snackBarClose();
	};
	return createPortal(
		<div>
			<Snackbar
				open={snack?.boolean}
				autoHideDuration={6000}
				onClose={handleClose}
			>
				<Alert
					onClose={handleClose}
					severity={snack?.severity}
					sx={{ width: "100%" }}
				>
					{snack?.message}
				</Alert>
			</Snackbar>
		</div>,
		document.getElementById("snack")
	);
}
