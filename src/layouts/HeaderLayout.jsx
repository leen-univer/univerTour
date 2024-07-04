import {
  AccountBalance,
  ArrowBack,
  Key,
  Logout,
  Menu as MenuIcon,
  Notifications,
  Settings
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Chip,
  CssBaseline,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { LOGO } from "assets";
import { MenuItems, UniversityMenuItems } from "configs";
import SchoolMenuItems from "configs/SchoolMenuItems";
import UserMenuItems from "configs/UserMenuItems";
import { useAppContext } from "contexts";
import { useNotifications } from "hooks";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CustomAppBar } from "./custom";
const HeaderLayout = ({ handleDrawerOpen, isDrawerOpen }) => {
  const { notifications } = useNotifications();
  // const Notifications = notifications.filter(
  //   (notification) => notification.read === false
  // );
  const navigate = useNavigate();
  const { user, logout } = useAppContext();
  // console.log(user, "user panel")
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const superadminPageTitle = MenuItems.find(
    (item) => item.route === location.pathname
  )?.title;
  const UniversityPageTitle = UniversityMenuItems.find(
    (item) => item.route === location.pathname
  )?.title;
  const SchoolPageTitle = SchoolMenuItems.find(
    (item) => item.route === location.pathname
  )?.title;
  const UserPageTitle = UserMenuItems.find(
    (item) => item.route === location.pathname
  )?.title;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    // alert("logout");
    try {
      logout();
      // setUser({});
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const unreadMessage = notifications.filter(
    (notification) => notification.read === false
  );
  return (
    <>
      <CssBaseline />
      <CustomAppBar position="fixed" open={isDrawerOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: "36px",
              ...(isDrawerOpen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ textTransform: "capitalize", fontWeight: "bold" }}
          >
            {user.role}
          </Typography>
          <Typography
            variant="body1"
            noWrap
            sx={{ textTransform: "capitalize", color: "#000" }}
          >
            /
            {user?.role === "superadmin" || user?.role === "multiadmin"
              ? superadminPageTitle
              : user?.role === "university"
                ? UniversityPageTitle
                : user?.role === "user"
                  ? UserPageTitle
                  : SchoolPageTitle}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {user.role === "superadmin" ? (
            <>

              <Tooltip title="Go to all-universities">
                <IconButton sx={{ mr: 2 }} component={Link} to="/all-universities">
                  <Key sx={{ color: "rgb(37, 82, 167)" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Universities">
                <IconButton sx={{ mr: 2 }} component={Link} to="/universities">
                  <AccountBalance sx={{ color: "rgb(37, 82, 167)" }} />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Attended Fairs">
              <IconButton sx={{ mr: 2 }} component={Link} to="/exclusive-leads">
                <ArrowBack sx={{ color: "rgb(37, 82, 167)" }} />
              </IconButton>
            </Tooltip>
          )}
          <>
            <Tooltip title="Notifications">
              <IconButton sx={{ mr: 2 }} component={Link} to="/notifications">
                <Badge badgeContent={unreadMessage?.length} color="error">
                  <Notifications
                    color="inherit"
                    sx={{ color: "rgb(37, 82, 167)" }}
                  />
                </Badge>
              </IconButton>
            </Tooltip>
          </>
          <Chip
            onClick={handleClick}
            avatar={<Avatar alt="" src={LOGO} />}
            label="Profile"
            variant="outlined"
          />
        </Toolbar>
      </CustomAppBar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Avatar alt="" src={LOGO} />
          <ListItemText primary={user?.displayName} secondary={user?.email} />
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to="/account-settings">
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default HeaderLayout;
