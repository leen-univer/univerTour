import { Done } from "@mui/icons-material";
import {
  Button,
  CardActions,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";

const Notification = () => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Email Notification
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Email me when new order placed"
        />
        <FormControlLabel
          control={<Switch />}
          label="Email me when a order cancelled"
        />
        <FormControlLabel
          control={<Switch />}
          label="Allow Email Notifications"
        />
      </FormGroup>
      <Typography variant="h6" gutterBottom>
        Push Notifications
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Send Push Notifications when new order placed"
        />
        <FormControlLabel
          control={<Switch />}
          label="Send Push Notifications when a order cancelled"
        />
        <FormControlLabel
          control={<Switch />}
          label="Allow Push Notifications"
        />
      </FormGroup>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ color: "snow" }}
          className="gradient"
          startIcon={<Done />}
        >
          Save Changes
        </Button>
      </CardActions>
    </>
  );
};

export default Notification;
