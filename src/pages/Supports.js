// import ExportCsv from "@material-table/exporters/csv";
import { useFetch } from "hooks";
import * as Yup from "yup";
import { Send } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { CardContent } from "@mui/material";
import { TextInput } from "components/core";
import { database } from "configs";
import { useAppContext } from "contexts";
import { Form, Formik } from "formik";
import AdminChatBar from "layouts/adminchats/AdminCharBar";
import ChatDrawer from "layouts/adminchats/ChatDrawer";
import { useState } from "react";

const Supports = () => {
  const { user, snackBarOpen, sendNotification, sendMail } = useAppContext();
  const [data, setData] = useState([]);
  console.log(data);
  const [support, supportLoading, supportError] = useFetch(
    `/Supports/${data?.userId}`
  );
  console.log(support);

  const [superadminMessages, superadminLoading, superadminError] = useFetch(
    `Superadmin/${data?.userId}`
  );
  console.log(superadminMessages);

  let mergedData = [];

  if (Array.isArray(support) && Array.isArray(superadminMessages)) {
    mergedData = [...support, ...superadminMessages];
  } else {
    // Handle non-iterable responses here
    console.error("Either support or superadminMessages is not iterable");
  }

  console.log(mergedData);

  const AdminSupportSchema = [
    {
      key: "1",
      label: "Message",
      name: "message",
      multiline: true,
      rows: 1,
      validationSchema: Yup.string().required("Message is Required"),
      initialValue: "",
    },
  ];
  const initialValues = AdminSupportSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.initialValue;
      return accumulator;
    },
    {}
  );

  const validationSchema = AdminSupportSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.validationSchema;
      return accumulator;
    },
    {}
  );

  const handleAdminSupport = async (values, submitProps) => {
    try {
      console.log(values);
      await database.ref(`Superadmin/${data?.userId}`).push({
        ...values,
        timestamp: new Date().toString(),
        displayName: user?.displayName,
        email: user?.email,
        userId: user?.uid,
      });
      const notification = {
        title: "Message",
        description: `A Message Received From ${user?.displayName}`,
        read: false,
        timestamp: new Date().toString(),
      };
      sendNotification({
        notification: {
          title: `Message`,
          body: `A Message Received ${user?.displayName}`,
        },
      });
      //   sendMail({
      //     to: user?.email,
      //     subject: "Help message",
      //     html: `Help message received`,
      //   });
      database.ref(`Notifications/${data?.userId}`).push(notification);
      snackBarOpen("Your Message Sent", "success");
      submitProps.resetForm();
    } catch (error) {
      snackBarOpen(error.message, "error");
      submitProps.resetForm();
      console.log(error);
      submitProps.setSubmitting(false);
    }
  };

  return (
    <section className="py-2">
      {/* <AdminChatLayout> */}
      <section className="admin-container ">
        <main className="relative w-full flex rounded-md bg-white shadow-[0_0.125rem_0.25rem_rgba(165,163,174,0.3)]">
          <section className=" w-full flex">
            <div className="w-1/4">
              <ChatDrawer setData={setData} />
            </div>
            <div className="w-3/4">
              <AdminChatBar data={data} />
              <div className="w-full h-[calc(100vh-13rem)] ">
                {/* {children} */}
                <div class="flex flex-col h-[72vh] p-2">
                  <div class="flex-grow overflow-y-auto">
                    <div class="flex flex-col mb-4 gap-4 py-4">
                      {mergedData
                        ?.sort(
                          (a, b) =>
                            new Date(a.timestamp) - new Date(b.timestamp)
                        )
                        .map((item, index) => (
                          <div
                            className={`flex ${
                              data?.userId === item?.userId
                                ? "justify-start"
                                : "justify-end"
                            }`}
                            key={item.id}
                          >
                            <div
                              className={`rounded-lg px-4 py-2 w-fit ${
                                data?.userId === item?.userId
                                  ? "bg-gray-100"
                                  : "bg-blue-500"
                              }`}
                            >
                              <p
                                className={`text-sm ${
                                  data?.userId === item?.userId
                                    ? "text-gray-900"
                                    : "text-white"
                                }`}
                              >
                                {item?.message}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div class="flex justify-center items-center w-full ">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={Yup.object(validationSchema)}
                      onSubmit={handleAdminSupport}
                    >
                      {({ isSubmitting, isValid }) => (
                        <Form className="w-full h-full">
                          <CardContent className="flex gap-2 items-center">
                            {AdminSupportSchema.map((inputItem) => (
                              <div className="w-full">
                                <TextInput
                                  key={inputItem.key}
                                  name={inputItem?.name}
                                  label={inputItem?.label}
                                  type={inputItem?.type}
                                  startIcon={inputItem?.startIcon}
                                  multiline
                                  rows={inputItem?.rows}
                                />
                              </div>
                            ))}
                            <div className="place-content-center">
                              <LoadingButton
                                className="mt-1vh gradient whitespace-nowrap !py-4"
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting || !isValid}
                                loading={isSubmitting}
                                loadingPosition="start"
                                startIcon={<Send />}
                                le
                                fullWidth
                                sx={{ color: "snow" }}
                              >
                                Send Message
                              </LoadingButton>
                            </div>
                          </CardContent>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </section>

      {/* </AdminChatLayout> */}
      {/* <MaterialTable
				data={supports?.map((item, i) => ({ ...item, sl: i + 1 })) || []}
				title="Supports"
				columns={[
					{
						title: "#",
						field: "sl",
						width: "10%",
					},
					{
						title: "University Name",
						field: "universityName",
						render: ({ universityName, email, picture }) => (
							<>
								<ListItem>
									<ListItemText
										primary={universityName}
										secondary={`${email}`}
									/>
								</ListItem>
							</>
						),
					},
					{ title: "Email", field: "email", hidden: true, export: true },
					{ title: "Subject", field: "subject" },
					{
						emptyValue: "--",
						title: "timestamp",
						field: "timestamp",
						render: ({ timestamp }) =>
							moment(timestamp).format("Do MMM YYYY hh:mm A"),
						customSort: (a, b) =>
							new Date(b?.timestamp) - new Date(a?.timestamp),
					},
				]}
				detailPanel={({ rowData }) => {
					return (
						<div
							style={{
								padding: "20px",
								margin: "auto",
								backgroundColor: "#eef5f9",
							}}
						>
							<Card
								sx={{
									minWidth: 275,
									maxWidth: 700,
									transition: "0.3s",
									margin: "auto",
									borderRadius: "10px",
									fontWeight: "bolder",
									wordWrap: "break-word",
									padding: "20px",
									boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
									"&:hover": {
										boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
									},
								}}
							>
								<CardContent>
									<h2 style={{ marginBottom: "5px" }}>Message</h2>
									<Typography
										style={{
											fontWeight: "bold",
											color: "black",
											wordWrap: "break-word",
										}}
									>
										{rowData.message}
									</Typography>
								</CardContent>
							</Card>
						</div>
					);
				}}
				options={{
					exportAllData: true,
					exportMenu: [
						{
							label: "Export Users Data In CSV",
							exportFunc: (cols, data) => ExportCsv(cols, data),
						},
						// {
						//   label: "Export Users Data In PDF",
						//   exportFunc: (cols, data) => ExportPdf(cols, data),
						// },
					],
					// selection: true,
					actionsColumnIndex: -1,
				}}
				style={{
					boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
					borderRadius: "8px",
				}}
				editable={
					{
						// onRowAdd: async (newData) => {
						//   console.log(newData);
						// },
						// onRowUpdate: async (oldData, newData) => {
						//   console.log(oldData);
						// },
						// onRowDelete: async (oldData) => {
						//   console.log(oldData);
						// },
					}
				}
				// actions={[
				//   {
				//     tooltip: "Remove All Selected Users",
				//     icon: "delete",
				//     onClick: (evt, data) => console.log(data),
				//   },
				//   {
				//     tooltip: "Send Reply to all selected users",
				//     icon: "send",
				//     onClick: (evt, data) => setSelectedUsers(data),
				//   },
				// ]}
				isLoading={!supports}
			/> */}
      {/* <SendReply
        selectedUsers={selectedUsers}
        handleClose={() => setSelectedUsers([])}
      /> */}
    </section>
  );
};

export default Supports;
