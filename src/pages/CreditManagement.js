import { Money, Done, Cancel } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCreditRequest } from "hooks";
import moment from "moment";
import { useAppContext } from "contexts";
import { database } from "configs";
const CreditManagement = () => {
  const { creditRequest } = useCreditRequest();

  const { sendNotification, sendMail } = useAppContext();
  const { snackBarOpen } = useAppContext();
  const handleSend = async (transaction) => {
    const notification = {
      title: "Credit Added",
      description: `Credit Added By SuperAdmin`,
      read: false,
      timestamp: new Date().toString(),
    };
    database.ref(`Users/${transaction?.uid}`).on("value", (snap) => {
      //   console.log(snap.val());
      const { fcmToken, email } = snap.val();
      //   console.log(fcmToken);

      sendNotification({
        notification: {
          title: "Credit Added By SuperAdmin",
          body: "Notifications",
        },
        FCMToken: fcmToken,
      });
      sendMail({
        to: email,
        subject: "We Have Added Credits To Your Account",
        html: `
								<p>
								You are ready to join more college fairs, we have added the below credits to your account:<br/>
								<br/>
								Number of new credits added: <strong>${transaction.requestCredit}</strong> <br/>
								
								<br/>             
								Please login to your account on collegefairs.ae to sign up to more fairs!<br/> 
								<br/>
								Univer Team
								</p>
									`,
      });
    });
    database.ref(`Notifications/${transaction?.uid}`).push(notification);

    await database.ref(`Users/${transaction?.uid}`).update({
      creditAmount: +transaction?.creditAmount + +transaction?.requestCredit,
      creditUpdatedTime: new Date().toString(),
    });
    await database.ref(`CreditTransactions/${transaction?.uid}`).push({
      timestamp: new Date().toString(),
      oldAmount: +transaction?.creditAmount,
      amountAdded: +transaction?.requestCredit,
      newAmount: +transaction?.creditAmount + +transaction?.requestCredit,
      type: "+",
      message: "Credited",
    });
    await database.ref(`RequestedCredits/${transaction?.id}`).remove();

    snackBarOpen("Credit Added Successfully", "success");
  };

  const onDelete = async (transaction) => {
    await database.ref(`RequestedCredits/${transaction?.id}`).remove();
  };
  return (
    <section className="py-2">
      {creditRequest.length ? (
        creditRequest.map((transaction) => (
          <Alert
            key={transaction.id}
            variant="standard"
            severity={"info"}
            sx={{ marginBottom: "10px" }}
            iconMapping={{
              info: <Money fontSize="large" sx={{ marginTop: "5px" }} />,
            }}
            action={
              <>
                <IconButton
                  color="primary"
                  onClick={() => handleSend(transaction)}
                >
                  <Tooltip title="Accept">
                    <Done />
                  </Tooltip>
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(transaction)}>
                  <Tooltip title="Reject">
                    <Cancel />
                  </Tooltip>
                </IconButton>
              </>
            }
          >
            <>
              {" "}
              <AlertTitle sx={{ fontWeight: "900", fontSize: "18px" }}>
                {transaction?.requestCredit} Credits needed
              </AlertTitle>
              {transaction?.displayName} requested{" "}
              <strong>{transaction?.requestCredit}</strong> credits on{" "}
              {moment(transaction?.timestamp).format("Do MMM YYYY hh:mm A")}.
            </>
          </Alert>
        ))
      ) : (
        <Grid container justifyContent={"center"}>
          <Grid
            item
            style={{ display: "block", margin: "auto", paddingTop: "12vh" }}
            justifyContent="center"
          >
            <div
              style={{
                display: "block",
                textAlign: "center",
                margin: "auto",
              }}
            >
              <IconButton color="primary">
                <Money />
              </IconButton>
            </div>
            <Typography>No Credit Request Found</Typography>
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default CreditManagement;
