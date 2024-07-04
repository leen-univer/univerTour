import { getArrFromSnap } from "@ashirbad/js-core";
import { database } from "configs";
import { useIsMounted } from "hooks";
import { useEffect, useState } from "react";

const useUniversities = () => {
  const [universities, setUniversities] = useState([]);
  const { isMounted } = useIsMounted();
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        await database.ref(`Users/`).on("value", (snap) => {
          const arr = getArrFromSnap(snap).map((item, i) => ({
            ...item,
            sl: i + 1,
          }));
          arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          isMounted.current && setUniversities(arr);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchUniversities();
  }, [isMounted]);
  return {
    universities,
  };
};

export default useUniversities;
