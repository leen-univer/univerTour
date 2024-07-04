import { getArrFromObj } from "@ashirbad/js-core";
import { Send } from "@mui/icons-material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField
} from "@mui/material";
import { LOGO } from "assets";
import { TextInput } from "components/core";
import { database } from "configs";
import { useAppContext } from "contexts";
import { Form, Formik } from "formik";
import { useFetch, useUniversities } from "hooks";
import * as Yup from "yup";

const Announcements = () => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const { user, snackBarOpen } = useAppContext();
  const [countries] = useFetch(`Countries/`);

  const { universities } = useUniversities();
  const Universities = universities?.filter(
    (university) => university?.role === "university"
  );

  const { sendNotification, sendMail } = useAppContext();
  const SUPERADMIN = "jsdjd";
  const MessageSchema = [
    {
      key: "1",
      label: "Subject",
      name: "subject",
      validationSchema: Yup.string()
        .required("Subject is Required")
        .max(50, "Subject must be less than 50 characters")
        .min(5, "Subject must be greater than 5 characters"),
      initialValue: "",
    },
    {
      key: "2",
      label: "Message",
      name: "message",
      multiline: true,
      rows: 4,
      validationSchema: Yup.string()
        .required("Message is Required")
        .max(350, "Message must be less than 350 characters")
        .min(5, "Message must be greater than 5 characters"),
      initialValue: "",
    },
    {
      key: "3",
      label: "Cities",
      name: "cities",
      type: "autocomplete",
      initialValue: [],
      validationSchema: Yup.array().min(1, "Please select at least one city."),
    },
  ];

  const initialValues = MessageSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.initialValue;
    return accumulator;
  }, {});
  const validationSchema = MessageSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.validationSchema;
    return accumulator;
  }, {});
  const citiesArray = countries?.flatMap((country) =>
    getArrFromObj(country?.cities)
  );

  const handleUniversitySupport = async (values, submitProps) => {
    const filteredCities = citiesArray?.filter((city) =>
      values?.cities?.some((selectedCity) => selectedCity?.id === city?.id)
    );

    const filteredUniversities = filteredCities
      ?.flatMap((city) => city?.universities && city?.universities)
      .filter(Boolean);
    const filteredUniversitiesDetails = filteredUniversities?.map(
      (university) => {
        const matchedUniversity = Universities?.find(
          (u) => u?.id === university // Replace 'id' with the property that uniquely identifies a university
        );
        return matchedUniversity || university; // Use the matched university or the original one if no match is found
      }
    );
    try {
      const notification = {
        title: `Univer Tour Message: ${values?.subject}`,
        description: `${values?.message}`,
        read: false,
        timestamp: new Date().toString(),
      };

      // sendNotification({
      //   notification: {
      //     title: `Help Message`,
      //     body: `Help message received`,
      //   },
      //   FCMToken: SUPERADMIN?.fcmToken,
      // });
      filteredUniversitiesDetails?.map(async (university) => {
        await sendMail({
          to: university?.email,
          subject: `${values?.subject}`,
          html: `<p>${values?.message}</p><br/>
          <p>Univer Team </p>
          `,
        });

        // Push notification for each university
        await database
          .ref(`Notifications/${university?.id}`)
          .push(notification);
      });

      snackBarOpen("Your Message Sent", "success");
      submitProps.resetForm();
    } catch (error) {
      snackBarOpen(error.message, "error");
      submitProps.resetForm();
      console.log(error);
      submitProps.setSubmitting(false);
    }
  };
  //   console.log(
  //     countries?.flatMap((country) => {
  //       const citiesArray = country?.cities || [];
  //       return Object.keys(citiesArray).map((cityKey) => {
  //         return { title: cityKey };
  //       });
  //     })
  //   );

  return (
    <div className="">
      <Container
        maxWidth="sm"
        className=" h-75vh place-content-center place-items-center"
      >
        <Card>
          <div className="flex justify-center items-center">
            <img src={LOGO} width="150" alt="" />
          </div>
          <CardHeader
            title="Announcement"
            subheader="Write your Announcements..."
            titleTypographyProps={{
              gutterBottom: true,
              align: "center",
            }}
            subheaderTypographyProps={{
              gutterBottom: true,
              align: "center",
            }}
          />
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object(validationSchema)}
            onSubmit={handleUniversitySupport}
          >
            {({ isSubmitting, isValid, setFieldValue, values, errors }) => (
              <Form>
                <CardContent>
                  {MessageSchema.map((inputItem) =>
                    inputItem.type === "autocomplete" ? (
                      <div className="w-full mt-2 mb-2">
                        {" "}
                        <Autocomplete
                          fullWidth
                          multiple
                          id=""
                          filterSelectedOptions={true}
                          options={
                            citiesArray?.length > 0
                              ? [
                                {
                                  id: "select-all",
                                  title: "Select All",
                                  value: "select-all",
                                },
                                ...citiesArray.map((city) => ({
                                  id: city?.id,
                                  title: city?.cityName,
                                  value: city?.id,
                                })),
                              ]
                              : []
                          }
                          disableCloseOnSelect
                          getOptionLabel={(option) => option?.title}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          } // Adjust the comparison based on your data structure
                          value={values.cities}
                          onChange={(event, newValue) => {
                            if (
                              newValue?.some(
                                (option) => option.id === "select-all"
                              ) &&
                              newValue.length === citiesArray?.length + 1
                            ) {
                              // If 'Select All' and all other cities are selected, remove 'Select All'
                              setFieldValue(
                                "cities",
                                newValue.filter(
                                  (option) => option.id !== "select-all"
                                )
                              );
                            } else if (
                              newValue.find(
                                (option) => option?.id === "select-all"
                              )
                            ) {
                              // If 'Select All' is selected, set all cities as selected
                              setFieldValue(
                                "cities",
                                citiesArray.map((city) => ({
                                  id: city?.id,
                                  title: city?.cityName,
                                  value: city?.id,
                                }))
                              );
                            } else if (
                              newValue.every(
                                (option) => option?.id !== "select-all"
                              )
                            ) {
                              // If all other cities are selected, deselect 'Select All'
                              setFieldValue("cities", newValue);
                            } else {
                              setFieldValue("cities", newValue);
                            }
                          }}
                          renderOption={(props, option) => (
                            <li {...props}>
                              {/* <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={values?.cities?.some(
                                  (city) => city?.id === option?.id
                                )}
                              /> */}
                              {option.title}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              error={Boolean(errors.cities)} // Check if there is an error for 'cities'
                              helperText={errors.cities}
                              {...params}
                              label="Cities"
                              placeholder=""
                            />
                          )}
                        />
                      </div>
                    ) : (
                      <TextInput
                        key={inputItem.key}
                        name={inputItem?.name}
                        label={inputItem?.label}
                        type={inputItem?.type}
                        startIcon={inputItem?.startIcon}
                        multiline
                        rows={inputItem?.rows}
                      />
                    )
                  )}

                  <div className="place-content-center">
                    <LoadingButton
                      className="mt-1vh gradient"
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
        </Card>
      </Container>
    </div>
  );
};

export default Announcements;

const Shift_Type = [
  {
    id: 1,
    title: "First Shift",
    scd: "first",
  },
  {
    id: 2,
    title: "Second Shift",
    scd: "second",
  },
  {
    id: 3,
    title: "Night Shift",
    scd: "night",
  },
];
