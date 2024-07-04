import { useEffect, useRef, useState } from "react";
import { database } from "configs";
const useSupports = () => {
  const [supports, setSupports] = useState();
  const isMounted = useRef(false);
  const fetchSupports = async () => {
    try {
      await database.ref(`Supports`).on("value", (snap) => {
        const arr = [];
        if (snap.exists()) {
          const obj = snap.val();
          for (const key in obj) {
            const uid = obj[key];

            for (const evaluateId in uid) {
              arr.push({
                uid: key,
                ...uid[evaluateId],
                id: evaluateId,
              });
            }
          }
        }
        arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        isMounted.current && setSupports(arr);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    isMounted.current = true;
    fetchSupports();
    return () => (isMounted.current = false);
  }, []);

  return {
    supports,
  };
};
export default useSupports;
