import {
  Delete,
  Done,
  Notifications as NotificationsIcon,
  NotificationsTwoTone,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { auth, database } from "configs";
import { useNotifications } from "hooks";
import moment from "moment";
import Swal from "sweetalert2";

// export default Notifications;
const Notifications = () => {
  const { notifications } = useNotifications();
  const handleSend = async (notification) => {
    await database
      .ref(`Notifications/${auth.currentUser.uid}/${notification?.id}`)
      .update({ read: true });
  };
  // const onDelete = async (notification) => {
  //   await database
  //     .ref(`Notifications/${auth.currentUser.uid}/${notification?.id}`)
  //     .remove();
  // };
  const onDelete = async (notification) => {
    try {
      const confirmDelete = await Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this notification!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (confirmDelete.isConfirmed) {
        await database
          .ref(`Notifications/${auth.currentUser.uid}/${notification?.id}`)
          .remove();

        Swal.fire(
          'Deleted!',
          'Your notification has been deleted.',
          'success'
        );
      } else {
        Swal.fire(
          'Cancelled',
          'Your notification is safe :)',
          'info'
        );
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      Swal.fire(
        'Error',
        'An error occurred while deleting the notification.',
        'error'
      );
    }
  };

  return (
    <>
      {notifications.length ? (
        notifications.map((notification) => (
          <div className="mb-1" key={notification.id}>
            <Alert
              severity={notification.read ? "success" : "info"}
              iconMapping={{
                success: <NotificationsTwoTone fontSize="inherit" />,
              }}
              action={
                <>
                  <IconButton
                    color="primary"
                    disabled={notification?.read}
                    onClick={() => handleSend(notification)}
                  >
                    <Tooltip title="Mark As Read">
                      <Done />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(notification)}
                  >
                    <Tooltip title="Delete">
                      <Delete />
                    </Tooltip>
                  </IconButton>
                </>
              }
              sx={{ marginBottom: "10px" }}
            >
              <AlertTitle>{notification.title}</AlertTitle>
              <strong>{notification.description}</strong>
              &nbsp; &nbsp;
              <span>{`${moment(notification?.timestamp).fromNow()}`}</span>
            </Alert>
          </div>
        ))
      ) : (
        <Grid container justifyContent={"center"}>
          <Grid
            item
            style={{ display: "block", margin: "auto", paddingTop: "12vh" }}
            justifyContent="center"
          >
            <div
              style={{ display: "block", textAlign: "center", margin: "auto" }}
            >
              <IconButton color="primary">
                <NotificationsIcon />
              </IconButton>
            </div>
            <Typography>No Notifications Found</Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Notifications;
