import { Add, Remove, Money } from "@mui/icons-material";
import { Alert, AlertTitle, Button } from "@mui/material";
import CreditDialog from "components/dialog/CreditDialog";
import { useCreditsManagement } from "hooks";
import moment from "moment";
import { useState } from "react";

const Credits = () => {
	const [openDialog, setOpenDialog] = useState(false);
	const { creditsManagement } = useCreditsManagement();

	return (
		<>
			<CreditDialog
				openDialog={openDialog}
				handleClose={() => setOpenDialog(false)}
			/>
			<div>
				<Button
					sx={{ color: "snow" }}
					variant="contained"
					startIcon={<Money sx={{ color: "#fff" }} />}
					onClick={() => setOpenDialog(true)}
				>
					Request More Credit
				</Button>
			</div>
			<section className="py-2">
				{creditsManagement.map((transaction) => (
					<Alert
						key={transaction.id}
						variant="standard"
						severity={
							transaction.type === "+"
								? "success"
								: transaction.type === "-"
								? "error"
								: ""
						}
						sx={{ marginBottom: "10px" }}
						iconMapping={{
							success: <Add fontSize="large" sx={{ marginTop: "5px" }} />,
							error: <Remove fontSize="large" sx={{ marginTop: "5px" }} />,
						}}
					>
						{transaction.type === "+" ? (
							<>
								{" "}
								<AlertTitle sx={{ fontWeight: "900", fontSize: "18px" }}>
									{transaction?.amountAdded} {transaction?.message}
								</AlertTitle>
								SuperAdmin added <strong>{transaction?.amountAdded}</strong> to
								your account on{" "}
								{moment(transaction?.timestamp).format("Do MMM YYYY hh:mm A")}
								.Now your total credits is{" "}
								<strong>{transaction?.newAmount}.</strong>
							</>
						) : transaction.type === "-" ? (
							<>
								{" "}
								<AlertTitle sx={{ fontWeight: "900", fontSize: "18px" }}>
									{transaction?.amountDebited} {transaction?.message}
								</AlertTitle>
								SuperAdmin debited{" "}
								<strong>{transaction?.amountDebited} </strong>
								from your account on{" "}
								{moment(transaction?.timestamp).format("Do MMM YYYY hh:mm A")}
								.Now your total credits is{" "}
								<strong>{transaction?.newAmount}</strong>.
							</>
						) : (
							""
						)}
					</Alert>
				))}
			</section>
		</>
	);
};

export default Credits;
