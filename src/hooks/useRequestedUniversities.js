import { getArrFromSnap } from "@ashirbad/js-core";
import { database } from "configs";
import { useIsMounted } from "hooks";
import { useEffect, useState } from "react";

const useRequestedUniversities = () => {
  const [requestedUniversities, setRequestedUniversities] = useState([]);
  const { isMounted } = useIsMounted();
  useEffect(() => {
    const fetchRequestedUniversities = async () => {
      try {
        await database.ref(`RequestedUniversities/`).on("value", (snap) => {
          const arr = getArrFromSnap(snap).map((item, i) => ({
            ...item,
            sl: i + 1,
          }));
          isMounted.current && setRequestedUniversities(arr);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchRequestedUniversities();
  }, [isMounted]);
  return {
    requestedUniversities,
  };
};

export default useRequestedUniversities;
