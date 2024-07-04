import { getArrFromSnap } from "@ashirbad/js-core";
import { database } from "configs";
import { useIsMounted } from "hooks";
import { useEffect, useState } from "react";

const useCreditRequest = () => {
  const [creditRequest, setCreditRequest] = useState([]);
  const { isMounted } = useIsMounted();
  useEffect(() => {
    const fetchCredits = () => {
      try {
        database.ref(`RequestedCredits`).on("value", (snap) => {
          const arr = getArrFromSnap(snap).map((item, i) => ({
            ...item,
            sl: i + 1,
          }));
          arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          isMounted.current && setCreditRequest(arr);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchCredits();
  }, [isMounted]);
  return {
    creditRequest,
  };
};

export default useCreditRequest;
