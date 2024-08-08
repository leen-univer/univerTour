import { Done } from '@mui/icons-material';
import DescriptionIcon from "@mui/icons-material/Description";
import { LoadingButton } from '@mui/lab';
import { CardContent, Dialog, Grid } from "@mui/material";
import { TextInput } from 'components/core';
import { Field, Form, Formik } from 'formik';
import * as Yup from "yup";

const AddNoteDailog = ({ handleClose, addReview, onSubmit }) => {
  const AddNoteSchema = [

    {
      key: "1",
      label: "Note*",
      multiline: true,
      rows: 4,
      name: "review",
      validationSchema: Yup.string().required("Note is Required"),
      initialValue: "",
      startIcon: <DescriptionIcon />,
    },
  ];

  const initialValues = AddNoteSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.initialValue;
    return accumulator;
  }, {});

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={addReview}
      maxWidth="sm"
      fullWidth
      className=""
    >
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            review: Yup.string().required("Note is Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            onSubmit(values); 
            handleClose(); 
            setSubmitting(false);
          }}
        >
          {(formik) => (
            <Form>
              <CardContent>
                <Grid container spacing={2} justifyContent="center">
                  {AddNoteSchema.map((inputItem) => (
                    <Grid
                      item
                      key={inputItem.key}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <Field name={inputItem.name}>
                        {(props) => (
                          <TextInput
                            key={inputItem.key}
                            name={inputItem.name}
                            label={inputItem.label}
                            disabled={inputItem.name === "email"}
                            type={inputItem.type}
                            startIcon={inputItem.startIcon}
                            multiline={inputItem.multiline}
                            rows={inputItem.rows}
                          />
                        )}
                      </Field>
                    </Grid>
                  ))}
                </Grid>
                <div className="place-content-center" onClick={handleClose}>
                  <LoadingButton
                    className="mt-1vh gradient"
                    variant="contained"
                    sx={{ color: "snow" }}
                    type="submit"
                    loadingPosition="start"
                    startIcon={<Done />}
                    fullWidth
                  >
                    Add
                  </LoadingButton>
                </div>
              </CardContent>
            </Form>
          )}
        </Formik>
      </div>
    </Dialog>
  );
}

export default AddNoteDailog;
