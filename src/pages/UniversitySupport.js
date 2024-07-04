import { Send } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { CardContent } from "@mui/material";
import { TextInput } from "components/core";
import { auth, database } from "configs";
import { useAppContext } from "contexts";
import { Form, Formik } from "formik";
import { useFetch, useUniversities } from "hooks";
import ChatBar from "layouts/communication/CharBar";
import { MessageSchema } from "schemas";
import * as Yup from "yup";

const UniversitySupport = () => {
  const { user, snackBarOpen } = useAppContext();

  const { universities } = useUniversities();
  const SUPERADMIN = universities?.filter(
    (university) => university?.role === "superadmin"
  )[0];
  const [data] = useFetch(`Supports/${user?.uid}`);
  console.log(data);
  const [superadminMessages] = useFetch(`Superadmin/${user?.uid}`);
  console.log(superadminMessages);
  let mergedData = [];
  if (Array.isArray(data) && Array.isArray(superadminMessages)) {
    mergedData = [...data, ...superadminMessages];
  } else {
    // Handle non-iterable responses here
    console.error("Either support or superadminMessages is not iterable");
  }

  console.log(mergedData);

  const { sendNotification, sendMail } = useAppContext();

  const initialValues = MessageSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.initialValue;
    return accumulator;
  }, {});

  const validationSchema = MessageSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.validationSchema;
    return accumulator;
  }, {});

  const handleUniversitySupport = async (values, submitProps) => {
    try {
      const newMessageRef = await database
        .ref(`Supports/${auth.currentUser.uid}`)
        .push({
          ...values,
          timestamp: new Date().toString(),
          universityName: user?.displayName,
          email: user?.email,
          userId: user?.uid,
          read: "unSeen",
        });

      // Get the ID of the newly created message
      const newMessageId = newMessageRef.key;

      // Update the data object with the ID
      const messageData = {
        id: newMessageId,
        ...values,
        timestamp: new Date().toString(),
        universityName: user?.displayName,
        email: user?.email,
        userId: user?.uid,
        read: "unSeen",
      };

      // Push the updated data object to the database
      await newMessageRef.set(messageData);

      const notification = {
        title: "Message",
        description: `A Message Received From ${user?.displayName} `,
        read: false,
        timestamp: new Date().toString(),
      };

      sendNotification({
        notification: {
          title: `Message`,
          body: `A Message Received From ${user?.displayName} `,
        },
        FCMToken: SUPERADMIN?.fcmToken,
      });

      sendMail({
        to: SUPERADMIN?.email,
        subject: "Message",
        html: `A Message Received From ${user?.displayName} `,
      });

      await database.ref(`Notifications/${SUPERADMIN?.uid}`).push(notification);

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
    <section className="admin-container ">
      <main className="relative w-full flex rounded-md bg-white shadow-[0_0.125rem_0.25rem_rgba(165,163,174,0.3)]">
        <div className="w-full">
          <ChatBar user={user} />
          <div className="w-full h-[calc(100vh-13rem)] ">
            <div class="flex flex-col h-[72vh] p-2">
              <div class="flex-grow overflow-y-auto">
                <div class="flex flex-col mb-4 gap-4 py-4">
                  {mergedData
                    ?.sort(
                      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                    )
                    .map((item) => (
                      <div
                        className={`flex ${
                          user?.uid === item?.userId
                            ? "justify-end"
                            : "justify-start"
                        }`}
                        key={item.id}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 w-fit ${
                            user?.uid === item?.userId
                              ? "bg-blue-500"
                              : "bg-gray-100"
                          }`}
                        >
                          <p
                            className={`text-sm ${
                              user?.uid === item?.userId
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            {item?.message}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div class="flex justify-center items-center w-full">
                <Formik
                  initialValues={initialValues}
                  validationSchema={Yup.object(validationSchema)}
                  onSubmit={handleUniversitySupport}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form className="w-full h-full">
                      <CardContent className="flex gap-2 items-center">
                        {MessageSchema.map((inputItem) => (
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
      </main>
    </section>
  );
};

export default UniversitySupport;
