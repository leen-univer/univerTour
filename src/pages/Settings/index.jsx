import { Lock, Person } from "@mui/icons-material";
import { Card, CardContent, Tab, Tabs } from "@mui/material";
import { useAppContext } from "contexts";
import { useState } from "react";
import ChangePassword from "./ChangePassword";
import Profile from "./Profile";

const Settings = () => {
	const { user } = useAppContext();
	const [value, setValue] = useState(0);
	return (
		<section className="py-2">
			<Card>
				{user.role === "university" ? (
					<>
						<Tabs
							value={value}
							onChange={(e, i) => setValue(i)}
							aria-label="icon position tabs example"
						>
							<Tab icon={<Person />} iconPosition="start" label="Profile" />

							<Tab
								icon={<Lock />}
								iconPosition="start"
								label="Change Password"
							/>
						</Tabs>
						<CardContent>
							{value === 0 && <Profile />}
							{value === 1 && <ChangePassword />}
						</CardContent>
					</>
				) : (
					<>
						<Tabs
							value={value}
							onChange={(e, i) => setValue(i)}
							aria-label="icon position tabs example"
						>
							<Tab
								icon={<Lock />}
								iconPosition="start"
								label="Change Password"
							/>
						</Tabs>
						<CardContent>{value === 0 && <ChangePassword />}</CardContent>
					</>
				)}
			</Card>
		</section>
	);
};

export default Settings;
