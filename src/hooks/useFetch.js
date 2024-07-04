import { useEffect, useReducer, useState } from "react";
import { getArrFromNestedSnap, getArrFromSnap } from "@ashirbad/js-core";

import { database } from "configs";

const dataReducer = (state, action) => {
  switch (action.type) {
    case "needArray":
      return {
        data: getArrFromSnap(action.payload.snap),
        isLoading: false,
      };
    case "needNested":
      return {
        data: getArrFromNestedSnap(action.payload.snap),
        isLoading: false,
      };
    case "raw":
      return {
        data: action.payload.snap.val(),
        isLoading: false,
      };
    default:
      return state;
  }
};

export default function useFetch(path, options) {
  const needArray = options?.needArray === false ? false : true;
  const needNested = Boolean(options?.needNested);
  const filter = options?.filter || (() => true);

  // Use local state to handle loading
  const [isLoading, setLoading] = useState(true);
  const [data, dispatch] = useReducer(dataReducer, {
    data: null,
  });

  useEffect(() => {
    // Set loading to true when new data is requested
    setLoading(true);
    const firebaseRef = database.ref(path);

    const onDataReceived = (snap) => {
      let type = "raw";
      if (needNested) type = "needNested";
      if (!needNested && needArray) type = "needArray";
      dispatch({ type, payload: { snap } });

      // After data is fetched, set loading to false
      setLoading(false);
    };

    // Attach the listener
    firebaseRef.on("value", onDataReceived);

    return () => {
      // Detach the listener on unmount to avoid memory leaks
      firebaseRef.off("value", onDataReceived);
    };
  }, [needArray, needNested, path]);

  // Return data and loading state
  const filteredData = needArray ? data.data?.filter(filter) : data.data;
  return [filteredData, isLoading];
}
