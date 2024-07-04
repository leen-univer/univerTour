import { BASE_URL } from "configs/api";
import app, { auth, database } from "configs/firebase";
import { useIsMounted } from "hooks";
import Swal from "sweetalert2";
const { createContext, useState, useEffect } = require("react");
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loader, setLoader] = useState(true);
  const [snack, setSnack] = useState({
    boolean: false,
    message: "",
    severity: "success",
  });
  const [loginUser, setLoginUser] = useState(true);
  const { isMounted } = useIsMounted();
  const login = async (email, password) => {
    try {
      return await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      setLoginUser(false);
      Swal.fire({
        text: "Your username or password is incorrect",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result?.isConfirmed) {
          window.location.replace("/login");
        }
      });
      return;
    }
  };
  const signUp = async (email, password) => {
    try {
      return await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      new Error(error);
    }
  };
  const logout = () => {
    try {
      auth.signOut();
      return setUser({});
    } catch (error) {
      new Error(error);
    }
  };
  const snackBarClose = async () => {
    setSnack({ message: "", severity: "success", boolean: false });
  };
  const snackBarOpen = (message, severity) => {
    // console.log(message);
    setSnack({
      message,
      severity: severity ? severity : "success",
      boolean: true,
    });
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser && isMounted.current) return setLoader(false);
      try {
        database.ref(`Users/${currentUser.uid}`).on("value", (snapshot) => {
          isMounted.current && setUser(snapshot.val());
          isMounted.current && setLoader(false);
        });
      } catch (error) {
        new Error(error);
      }
    });
    return unsubscribe;
  }, [isMounted]);
  const sendNotification = async ({ notification, FCMToken }) => {
    const body = {
      tokens: [`${FCMToken}`],
      notification: notification,
    };
    try {
      const response = await fetch(BASE_URL + "/send-notification", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const results = await response?.json();
      //   console.log(results);
      return results;
    } catch (error) {
      console.log(error);
    }
  };
  const sendMail = async ({ to, subject, html }) => {
    const body = {
      to: to,
      subject: subject,
      html: html,
    };
    try {
      const response = await fetch(BASE_URL + "/api/send-mail", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const results = await response?.json();

      return results;
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   isMounted.current = true;
  //   const makeFcmToken = async () => {
  //     if (!isMounted.current) return;
  //     if (!user?.uid) return;
  //     try {
  //       "Notification" in window &&
  //         Notification.requestPermission(function (permission) {
  //           // If the user accepts, let's create a notification
  //           if (permission === "granted") {
  //             // Get FCM Token
  //             app
  //               .messaging()
  //               .requestPermission()
  //               .then(() => {
  //                 return app.messaging().getToken();
  //               })
  //               .then(async (fcmToken) => {
  //                 //  INSERT FCM TOKEN INTO DATABASE
  //                 try {
  //                   await database.ref(`Users/${user?.uid}`).update({
  //                     fcmToken,
  //                   });
  //                 } catch (error) {
  //                   new Error(error);
  //                 }
  //                 // end
  //               });
  //           }
  //         });
  //     } catch (error) {
  //       new Error(error);
  //     }
  //   };
  //   makeFcmToken();
  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, [user?.uid, isMounted]);
  const value = {
    signUp,
    login,
    sendMail,
    user,
    setUser,
    logout,
    snackBarClose,
    snack,
    snackBarOpen,
    loader,
    loginUser,
    sendNotification,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
