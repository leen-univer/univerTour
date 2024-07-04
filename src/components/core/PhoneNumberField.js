import React from "react";
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
// import * as Yup from "yup";
export default function PhoneNumberField({ inputItem, formik, props }) {
  // const validationSchema = {
  //   phoneNumber: Yup.string().required("Phone Number is Required"),
  // };
  return (
    <TextField
      label={"Phone Number"}
      type={"tel"}
      // placeholder={placeholder}
      margin="normal"
      variant="outlined"
      fullWidth
      value={formik.values.phoneNumber}
      onBlur={formik.handleBlur}
      onChange={formik.handleChange}
      name={"phoneNumber"}
      error={Boolean(
        formik?.touched?.phoneNumber && formik?.errors?.phoneNumber
      )}
      helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
      InputProps={{
        startAdornment: (
          <div>
            <FormControl>
              <div>
                <Select
                  error={Boolean(props.meta.touched && props.meta.error)}
                  value={formik?.values?.countryCode}
                  // onChange={onChangeCountryCode}
                  autoWidth
                  variant="standard"
                  disableUnderline
                  {...props.field}
                  // name={countryCodeName}
                >
                  {inputItem?.options?.map((option) => (
                    <MenuItem
                      key={option?.key}
                      value={
                        inputItem.name === "countryCode"
                          ? option.phone
                          : option.value
                      }
                    >
                      {inputItem.name === "countryCode" && (
                        <img
                          loading="lazy"
                          width="20"
                          src={`https://flagcdn.com/w20/${option.key.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w40/${option.key.toLowerCase()}.png 2x`}
                          alt=""
                          style={{ margin: "0 1vw" }}
                        />
                      )}
                      {inputItem?.name === "countryCode" ? (
                        <>{`+${option?.phone} `}</>
                      ) : (
                        option?.value
                      )}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {props.meta.touched && props.meta.error}
                </FormHelperText>
              </div>
            </FormControl>
          </div>
        ),
      }}
    />
  );
}
