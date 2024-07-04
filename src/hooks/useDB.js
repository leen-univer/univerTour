import { get, onValue, ref as dbRef } from "firebase/database";
import { useEffect, useState } from "react";
import useIsMounted from "./useIsMounted";
import { db } from "@/app";

const useDB = (path, options) => {
  const needArr = options?.needArr ?? true;
  const needOnce = options?.needOnce ?? false;
  const [data, setData] = useState();
  const isMounted = useIsMounted();

  useEffect(() => {
    (async () => {
      try {
        if (needOnce) {
          const snap = await get(dbRef(db, path));
          const arr = needArr ? getArrayWithId(snap) : snap.val();
          isMounted.current && setData(arr);
        } else {
          onValue(dbRef(db, path), (snap) => {
            const arr = needArr ? getArrayWithId(snap) : snap.val();
            isMounted.current && setData(arr);
          });
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [isMounted, needArr, needOnce, path]);

  return [data];
};

const getArrayWithId = (snap) => {
  if (snap.exists()) {
    const value = snap.val();
    const data = [];
    for (let x in value) {
      const obj = {
        id: x,
        ...value[x],
      };
      data.push(obj);
    }
    return data;
  }
};
