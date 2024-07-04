import { getArrFromSnap } from "@ashirbad/js-core";
import { auth, database } from "configs";
import { useIsMounted } from "hooks";
import { useEffect, useState } from "react";

const useNotifications = () => {
	const [notifications, setNotifications] = useState([]);
	const { isMounted } = useIsMounted();
	useEffect(() => {
		const fetchNotifications = () => {
			try {
				database
					.ref(`Notifications/${auth?.currentUser?.uid}`)
					.on("value", (snap) => {
						const arr = getArrFromSnap(snap).map((item, i) => ({
							...item,
							sl: i + 1,
						}));
						arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
						isMounted.current && setNotifications(arr);
					});
			} catch (error) {
				console.log(error);
			}
		};
		fetchNotifications();
	}, [isMounted]);
	return {
		notifications,
	};
};

export default useNotifications;
