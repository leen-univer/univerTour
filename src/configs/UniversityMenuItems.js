import {
  Dashboard,
  Event,
  Image,
  InsertDriveFile,
  ManageAccounts,
  NotificationsRounded,
  People,
  Support
} from "@mui/icons-material";
const UniversityMenuItems = [
  {
    key: "1",
    title: "Dashboard",
    icon: <Dashboard className="iconColor" />,
    route: "/dashboard",
  },
  // {
  //   key: "12",
  //   title: "School Fairs",
  //   icon: <School className="iconColor" />,
  //   route: "/university-fairs",
  // },
  {
    key: "2",
    title: "My Itinerary",
    icon: <Event className="iconColor" />,
    route: "/itinerary",
  },

  // {
  // 	key: "4",
  // 	title: "Upcoming Fairs",
  // 	icon: <ArrowForwardIos className="iconColor" />,
  // 	route: "/upcoming-fairs",
  // },
  // {
  // 	key: "9",
  // 	title: "Attended Fairs",
  // 	icon: <ArrowBack className="iconColor" />,
  // 	route: "/exclusive-leads",
  // },
  {
    key: "10",
    title: "Documents",
    icon: <InsertDriveFile className="iconColor" />,
    route: "/documents",
  },
  {
    key: "11",
    title: "Photos",
    icon: <Image className="iconColor" />,
    route: "/photos",
  },
  {
    key: "7",
    title: "Users",
    icon: <People className="iconColor" />,
    route: "/users",
  },
  {
    key: "8",
    title: "University Support",
    icon: <Support className="iconColor" />,
    route: "/university-support",
  },
  {
    key: "6",
    title: "Notifications",
    icon: <NotificationsRounded className="iconColor" />,
    route: "/notifications",
  },
  {
    key: "5",
    title: "Account Settings",
    icon: <ManageAccounts className="iconColor" />,
    route: "/account-settings",
  },
];
export default UniversityMenuItems;
