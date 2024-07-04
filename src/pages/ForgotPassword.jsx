import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
	CardContent,
	TextField,
	InputAdornment,
	CardHeader,
	CardActions,
	Button,
	Container,
	Card,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Email, Send } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { LOGO } from "assets";
import { auth } from "configs";
import { useAppContext } from "contexts";
const ForgotPassword = () => {
	const { snackBarOpen } = useAppContext();
	const initialValues = {
		email: "",
	};
	const validationSchema = {
		email: Yup.string()
			.required("Email is Required")
			.email("Please enter a valid email"),
	};
	const handleLogin = async (values, submitProps) => {
		try {
			await auth.sendPasswordResetEmail(values.email);
			snackBarOpen("Password Reset Link Sent to your Mail", "success");
			submitProps.resetForm();
		} catch (error) {
			console.log(error);
			snackBarOpen(error?.message, "error");
		} finally {
			submitProps.setSubmitting(false);
		}
	};
	return (
		<>
			<div className="auth_page">
				<Container
					maxWidth="sm"
					className="d-flex h-75vh place-content-center place-items-center"
				>
					<Card>
						<div style={{ textAlign: "center", paddingTop: "10px" }}>
							<img src={LOGO} width="150" alt="" />
						</div>
						<CardHeader
							title="Forgot your password?"
							subheader="Please enter the email address associated with your account and We will email you a link to reset your password."
							titleTypographyProps={{
								align: "center",
								gutterBottom: true,
							}}
							subheaderTypographyProps={{
								align: "center",
								gutterBottom: true,
								p: "1px 15px",
							}}
						/>
						<Formik
							initialValues={initialValues}
							validationSchema={Yup.object(validationSchema)}
							onSubmit={handleLogin}
						>
							{({ isSubmitting, isValid }) => (
								<Form>
									<CardContent>
										<Field name={"email"}>
											{(props) => (
												<TextField
													fullWidth
													margin="normal"
													label={"Enter your email address"}
													type={"email"}
													error={Boolean(
														props.meta.touched && props.meta.error
													)}
													helperText={props.meta.touched && props.meta.error}
													{...props.field}
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<Email />
															</InputAdornment>
														),
													}}
												/>
											)}
										</Field>
										<LoadingButton
											className="mt-1vh gradient"
											variant="contained"
											type="submit"
											sx={{ color: "snow" }}
											disabled={isSubmitting || !isValid}
											loading={isSubmitting}
											loadingPosition="start"
											startIcon={<Send />}
											fullWidth
										>
											Reset Password
										</LoadingButton>
									</CardContent>
									<CardActions className="place-content-center">
										<Button
											component={Link}
											to="/login"
											sx={{ color: "rgb(37, 82, 167)" }}
										>
											Back to Login
										</Button>
									</CardActions>
								</Form>
							)}
						</Formik>
					</Card>
				</Container>
			</div>
		</>
	);
};

export default ForgotPassword;
