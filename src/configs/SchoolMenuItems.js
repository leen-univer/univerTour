import {
  Add,
  Approval,
  ArrowBack,
  ArrowForwardIos,
  CreditScore,
  Dashboard,
  Event,
  ManageAccounts,
  NotificationsRounded,
  Support,
} from "@mui/icons-material";
const SchoolMenuItems = [
  {
    key: "1",
    title: "Dashboard",
    icon: <Dashboard className="iconColor" />,
    route: "/dashboard",
  },
  //   {
  //     key: "2",
  //     title: "Fairs",
  //     icon: <Event className="iconColor" />,
  //     route: "/leads",
  //   },
  {
    key: "4sds",
    title: "Add New Fair",
    icon: <Add className="iconColor" />,
    route: "/add-fairs",
  },
  {
    key: "4ssds",
    title: "Fair Requests",
    icon: <Approval className="iconColor" />,
    route: "/fair-requests",
  },
  {
    key: "4",
    title: "Upcoming Fairs",
    icon: <ArrowForwardIos className="iconColor" />,
    route: "/upcoming-fairs",
  },
  {
    key: "9",
    title: "Completed Fairs",
    icon: <ArrowBack className="iconColor" />,
    route: "/completed-fairs",
  },
  //   {
  //     key: "7",
  //     title: "Credits",
  //     icon: <CreditScore className="iconColor" />,
  //     route: "/credits",
  //   },
  {
    key: "8",
    title: "School Support",
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
export default SchoolMenuItems;
