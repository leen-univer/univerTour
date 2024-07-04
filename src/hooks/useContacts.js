import { getArrFromSnap } from "@ashirbad/js-core";
import { database } from "configs";
import { useIsMounted } from "hooks";
import { useEffect, useState } from "react";

const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const { isMounted } = useIsMounted();
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        await database.ref(`Contacts/`).on("value", (snap) => {
          const arr = getArrFromSnap(snap).map((item, i) => ({
            ...item,
            sl: i + 1,
          }));
          arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          isMounted.current && setContacts(arr);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchContacts();
  }, [isMounted]);
  return {
    contacts,
  };
};

export default useContacts;
