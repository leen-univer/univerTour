import {
  AccountBalance,
  Approval,
  ApprovalOutlined,
  Archive,
  Campaign,
  // ArrowForwardIos,
  ContactMail,
  // CreditScore,
  Dashboard,
  Event,
  Flag,
  ManageAccounts,
  NotificationsRounded,
  Photo,
  School,
  Support
} from "@mui/icons-material";
import BoyIcon from '@mui/icons-material/Boy';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
// import AddCardIcon from "@mui/icons-material/AddCard";

const MenuItems = [
  {
    key: "1",
    title: "Dashboard",
    icon: <Dashboard className="iconColor" />,
    route: "/dashboard",
  },
  {
    key: "2",
    title: "Schools",
    icon: <School className="iconColor" />,
    route: "/schools",
  },
  {
    key: "3",
    title: "Student Pulse",
    icon: <BoyIcon className="BoyIcon" style={{ color: '#2552a7' }} />,
    route: "/StudentPulse",
  },
  
  {
    key: "4",
    title: "Universities",
    icon: <AccountBalance className="iconColor" />,
    route: "/universities",
  },
  {
    key: "5",
    title: "University/School Requests",
    icon: <Approval className="iconColor" />,
    route: "/requested-universities",
  },
  {
    key: "6",
    title: "Add Mutli Admins",
    icon: <SupervisorAccountIcon className="iconColor" />,
    route: "/add-multi-admin",
  },
  {
    key: "7",
    title: "Photo Wall",
    icon: <Photo className="iconColor" />,
    route: "/photo-wall",
  },
  // {
  // 	key: "25",
  // 	title: "Event Request",
  // 	icon: <ArrowForwardIos className="iconColor" />,
  // 	route: "/requested-event",
  // },

  // {
  //   key: "26",
  //   title: "Add Credits",
  //   icon: <LibraryAdd className="iconColor" />,
  //   route: "/add-credits",
  // },

  // {
  //   key: "11",
  //   title: "Credit Request",
  //   icon: <SupportOutlined className="iconColor" />,
  //   route: "/credit-management",
  // },
  {
    key: "16asd",
    title: "School Fair Requests",
    icon: <ApprovalOutlined className="iconColor" />,
    route: "/school-fair-requests",
  },
  {
    key: "16",
    title: "School Fairs",
    icon: <School className="iconColor" />,
    route: "/school-fairs",
  },
  {
    key: "15x",
    title: "Countries",
    icon: <Flag className="iconColor" />,
    route: "/all-countries",
  },
  {
    key: "15",
    title: "Events",
    icon: <Event className="iconColor" />,
    route: "/student-management",
  },
  {
    key: "17",
    title: "Announcements",
    icon: <Campaign className="iconColor" />,
    route: "/announcements",
  },

  // {
  // 	key: "7",
  // 	title: "Previous Fairs",
  // 	icon: <ArrowBack className="iconColor" />,
  // 	route: "/previous-fairs",
  // },
  {
    key: "9",
    title: "Contacts",
    icon: <ContactMail className="iconColor" />,
    route: "/contacts",
  },
  {
    key: "19",
    title: "Archive",
    icon: <Archive className="iconColor" />,
    route: "/archive",
  },
  {
    key: "10",
    title: "Supports",
    icon: <Support className="iconColor" />,
    route: "/supports",
  },

  {
    key: "3",
    title: "Notifications",
    icon: <NotificationsRounded className="iconColor" />,
    route: "/notifications",
  },
  {
    key: "2",
    title: "Account Settings",
    icon: <ManageAccounts className="iconColor" />,
    route: "/account-settings",
  },
];

export default MenuItems;
