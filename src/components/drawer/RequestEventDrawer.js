import { getArrFromObj } from "@ashirbad/js-core";
import { Close, Done, School } from "@mui/icons-material";
import {
  Avatar,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { database } from "configs";
import Swal from "sweetalert2";

const RequestEventDrawer = ({ open, setOpenAddStudentDrawer }) => {
  // console.log(getArrFromObj(open?.participationRequest));
  const handleAccept = async (university) => {
    try {
      await database
        .ref(`Users/${university?.id}/upcomingFairs/${open?.id}`)
        .update({
          ...open,
          timestamp: new Date().toString(),
        });
      await database
        .ref(`NewFairs/${open?.id}/AcceptedUniversity/${university?.id}`)
        .update({
          ...university,
          timestamp: new Date().toString(),
        });
      await database
        .ref(`NewFairs/${open?.id}/participationRequest/${university?.id}`)
        .remove();
      setOpenAddStudentDrawer(false);
      Swal.fire({
        text: "Request Accepted",
        icon: "success",
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleReject = async (university) => {
    await database.ref(`CreditTransactions/${university?.uid}`).push({
      timestamp: new Date().toString(),
      oldAmount: +university?.creditAmount,
      amountAdded: +open?.credits,
      newAmount: +university?.creditAmount + +open?.credits,
      type: "+",
      message: "Credited",
    });
    await database
      .ref(`NewFairs/${open?.id}/participationRequest/${university?.uid}`)
      .remove();
    setOpenAddStudentDrawer(false);
    Swal.fire({
      text: "Request Rejected",
      icon: "success",
    });
  };
  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpenAddStudentDrawer(false)}
      >
        <Container
          style={{
            width: "30vw",
            marginTop: "12vh",
          }}
        >
          {getArrFromObj(open?.participationRequest)?.length > 0 ? (
            getArrFromObj(open?.participationRequest)
              ?.slice()
              .sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp))
              .map((store) => {
                return (
                  <div key={store?.key}>
                    <Typography
                      align="center"
                      color="text.primary"
                      variant="h5"
                    >
                      Requested Universities
                    </Typography>
                    <List>
                      <ListItem
                        sx={{
                          paddingLeft: "1.4vw",
                          marginTop: "0vh",
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            variant="outlined"
                            src={store?.imageURL}
                            sx={{
                              background: "#1877f2",
                            }}
                          >
                            <School />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={store?.displayName}
                          secondary={
                            <>
                              <div>Ph.no: {store?.phoneNumber}</div>
                              <div>Email: {store?.email}</div>
                              <div>Country: {store?.country}</div>
                              <div>Location: {store?.location}</div>
                              Web:{" "}
                              <a
                                href={`${store?.website}`}
                                style={{ textDecoration: "none" }}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {store?.website}{" "}
                              </a>
                            </>
                          }
                          primaryTypographyProps={{
                            fontWeight: "bold",
                            color: "#1877f2",
                          }}
                          secondaryTypographyProps={{
                            fontSize: "1vw",
                            marginTop: "1vh",
                          }}
                        />

                        <Tooltip title="Accept">
                          <Done
                            onClick={() => handleAccept(store)}
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              mr: 2.5,
                              color: "green",
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Reject">
                          <Close
                            onClick={() => handleReject(store)}
                            sx={{
                              fontSize: "20px",
                              cursor: "pointer",
                              color: "red",
                            }}
                          />
                        </Tooltip>
                      </ListItem>
                    </List>
                  </div>
                );
              })
          ) : (
            <Typography align="center" color="#2552A7" variant="h6">
              No university Found
            </Typography>
          )}
        </Container>
      </Drawer>
    </>
  );
};

export default RequestEventDrawer;
