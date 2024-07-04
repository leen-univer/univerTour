import { getArrFromSnap } from "@ashirbad/js-core";
import { database } from "configs";
import { useAppContext } from "contexts";
import { useIsMounted } from "hooks";
import { useEffect, useState } from "react";

const useRequestFairs = () => {
  const { user } = useAppContext();
  const [requestFairs, setRequestFairs] = useState([]);
  const { isMounted } = useIsMounted();
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        await database.ref(`FairRequests/${user?.uid}`).on("value", (snap) => {
          const arr = getArrFromSnap(snap).map((item, i) => {
            if (item?.requestedBy) {
              const arr = [];
              for (let i in item?.requestedBy) {
                arr.push({
                  timestamp: item?.requestedBy[i],
                  universityUid: i,
                });
                item = { ...item, requestedBy: arr };
              }
            }
            return {
              ...item,
              sl: i + 1,
            };
          });
          arr.sort((a, b) => new Date(a?.date) - new Date(b?.date));
          isMounted.current && setRequestFairs(arr);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchStudents();
  }, [isMounted, user?.uid]);
  return {
    requestFairs,
  };
};

export default useRequestFairs;
