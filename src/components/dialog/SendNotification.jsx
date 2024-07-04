import { Cancel, Send } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { TextInput } from "components/core";
import { database } from "configs";
import { useAppContext } from "contexts";
import { Form, Formik } from "formik";
import { SendNotificationSchema } from "schemas";
import * as Yup from "yup";
const SendNotification = ({ selectedUsers, handleClose }) => {
	const { snackBarOpen, sendMail } = useAppContext();
	const initialValues = SendNotificationSchema.reduce(
		(accumulator, currentValue) => {
			accumulator[currentValue.name] = currentValue.initialValue;
			return accumulator;
		},
		{}
	);
	const validationSchema = SendNotificationSchema.reduce(
		(accumulator, currentValue) => {
			accumulator[currentValue.name] = currentValue.validationSchema;
			return accumulator;
		},
		{}
	);
	const handleSendNotification = async (values, submitProps) => {
		try {
			await selectedUsers?.forEach((user) => {
				sendMail({
					to: user?.email,
					subject: `${values?.subject}`,
					html: `<p>${values?.message}</p><br/>
          <p>Univer Team </p>
          `,
				});
				database.ref(`Notifications/${user?.uid}`).push({
					...values,
					read: false,
					timestamp: new Date().toString(),
				});
				snackBarOpen("Notifications Send Successfully", "success");

				submitProps.resetForm();
			});
		} catch (error) {
			snackBarOpen(error.message, "error");
			console.log(error);
			submitProps.setSubmitting(false);
		}
	};
	return (
		<>
			<Dialog
				open={Boolean(selectedUsers?.length)}
				onClose={handleClose}
				maxWidth="sm"
				fullWidth
			>
				<Formik
					initialValues={initialValues}
					validationSchema={Yup.object(validationSchema)}
					onSubmit={handleSendNotification}
				>
					{({ isSubmitting, isValid }) => (
						<Form>
							<DialogTitle>Send Notification</DialogTitle>
							<DialogContent dividers>
								{SendNotificationSchema.map((inputItem) => (
									<TextInput
										key={inputItem.key}
										name={inputItem?.name}
										label={inputItem?.label}
										type={inputItem?.type}
										startIcon={inputItem?.startIcon}
										multiline={inputItem?.multiline}
										rows={inputItem?.rows}
									/>
								))}
							</DialogContent>
							<DialogActions>
								<Button
									variant="outlined"
									startIcon={<Cancel />}
									onClick={handleClose}
									color="error"
								>
									Close
								</Button>
								<LoadingButton
									className="!bg-theme"
									variant="contained"
									startIcon={<Send />}
									disabled={!isValid}
									loading={isSubmitting}
									type="submit"
								>
									Send
								</LoadingButton>
							</DialogActions>
						</Form>
					)}
				</Formik>
			</Dialog>
		</>
	);
};

export default SendNotification;
