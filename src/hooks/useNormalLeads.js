import { getArrFromSnap } from "@ashirbad/js-core";
import { database } from "configs";
import { useIsMounted } from "hooks";
import { useEffect, useState } from "react";

const useNormalLeads = () => {
  const [normalLeads, setNormalLeads] = useState();
  const { isMounted } = useIsMounted();
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        await database.ref(`NormalLeads/`).on("value", (snap) => {
          const arr = getArrFromSnap(snap).map((item, i) => ({
            ...item,
            sl: i + 1,
          }));
          arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          isMounted.current && setNormalLeads(arr);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchUniversities();
  }, [isMounted]);
  return {
    normalLeads,
  };
};

export default useNormalLeads;
