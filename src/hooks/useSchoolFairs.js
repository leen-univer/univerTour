import { getArrFromSnap } from "@ashirbad/js-core";
import { database } from "configs";
import { useAppContext } from "contexts";
import { useIsMounted } from "hooks";
import { useEffect, useState } from "react";

const useSchoolFairs = () => {
  const { user } = useAppContext();
  const [schoolFairs, setSchoolFairs] = useState([]);
  const { isMounted } = useIsMounted();

  useEffect(() => {
    if (user?.displayName) {
      const fetchStudents = async () => {
        try {
          const ref = database.ref(`NewFairs`);
          ref.on("value", (snap) => {
            console.log("Data snapshot received:", snap.val());
            if (snap.exists()) {
              // Convert snapshot to array
              const arr = getArrFromSnap(snap)
                .filter(item => item.displayName === user.displayName) // Filter based on displayName
                .map((item, i) => {
                  if (item?.requestedBy) {
                    const requestedByArr = [];
                    for (let key in item.requestedBy) {
                      requestedByArr.push({
                        timestamp: item.requestedBy[key],
                        universityUid: key,
                      });
                    }
                    item = { ...item, requestedBy: requestedByArr };
                  }
                  return {
                    ...item,
                    sl: i + 1,
                  };
                });

              arr.sort((a, b) => new Date(a.date) - new Date(b.date));
              if (isMounted.current) {
                setSchoolFairs(arr);
                console.log("School fairs set:", arr);
              }
            } else {
              console.log("No data available for the given displayName");
            }
          });
        } catch (error) {
          console.error("Error fetching school fairs:", error);
        }
      };

      fetchStudents();

      return () => {
        const ref = database.ref(`NewFairs`);
        ref.off();
      };
    } else {
      console.log("User displayName is not available yet");
    }
  }, [isMounted, user?.displayName]);

  return {
    schoolFairs,
  };
};

export default useSchoolFairs;
