import { getArrFromSnap } from "@ashirbad/js-core";
import { auth, database } from "configs";
import { useIsMounted } from "hooks";
import { useEffect, useState } from "react";

const useCreditsManagement = () => {
  const [creditsManagement, setCreditsManagement] = useState([]);
  const { isMounted } = useIsMounted();
  useEffect(() => {
    const fetchCredits = () => {
      try {
        database
          .ref(`CreditTransactions/${auth?.currentUser?.uid}`)
          .on("value", (snap) => {
            const arr = getArrFromSnap(snap).map((item, i) => ({
              ...item,
              sl: i + 1,
            }));
            arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            isMounted.current && setCreditsManagement(arr);
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchCredits();
  }, [isMounted]);
  return {
    creditsManagement,
  };
};

export default useCreditsManagement;
