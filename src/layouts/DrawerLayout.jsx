import { ChevronLeft, ChevronRight, ExitToApp } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme
} from "@mui/material";
import { LOGO } from "assets";
import { MenuItems, UniversityMenuItems } from "configs";
import SchoolMenuItems from "configs/SchoolMenuItems";
import UserMenuItems from "configs/UserMenuItems";
import { useAppContext } from "contexts";
import { Fragment } from "react";
import Scrollbars from "react-custom-scrollbars";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CustomDrawer, CustomDrawerHeader } from "./custom";
const DrawerLayout = ({ isDrawerOpen, handleDrawerClose }) => {
  const { user } = useAppContext();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAppContext();
  const handleLogout = () => {
    try {
      logout();
      // setUser({});
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const renderMenuByRole = () => {
    switch (user?.role) {
      case "superadmin":
        return MenuItems.map((item) => (
          <Fragment key={item.key}>
            <Tooltip title={item.title} followCursor arrow placement="top-end">
              <ListItemButton
                component={Link}
                to={item.route}
                selected={location.pathname === item.route}
                className={
                  location.pathname === item.route ? "selectedItem" : "listItem"
                }
              >
                <ListItemIcon className="itemIcon">{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} className="listItemText" />
              </ListItemButton>
            </Tooltip>
            {/* <Divider /> */}
          </Fragment>
        ));
      case "multiadmin":
        return MenuItems.map((item) => (
          <Fragment key={item.key}>
            <Tooltip title={item.title} followCursor arrow placement="top-end">
              <ListItemButton
                component={Link}
                to={item.route}
                selected={location.pathname === item.route}
                className={
                  location.pathname === item.route ? "selectedItem" : "listItem"
                }
              >
                <ListItemIcon className="itemIcon">{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} className="listItemText" />
              </ListItemButton>
            </Tooltip>
            {/* <Divider /> */}
          </Fragment>
        ));
      case "university":
        return UniversityMenuItems.map((item) => (
          <Fragment key={item.key}>
            <Tooltip title={item.title} followCursor arrow placement="top-end">
              <ListItemButton
                component={Link}
                to={item.route}
                selected={location.pathname === item.route}
                className={
                  location.pathname === item.route ? "selectedItem" : "listItem"
                }
              >
                <ListItemIcon className="itemIcon">{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} className="listItemText" />
              </ListItemButton>
            </Tooltip>
            {/* <Divider /> */}
          </Fragment>
        ));
      case "user":
        return UserMenuItems?.map((item) => (
          <Fragment key={item.key}>
            <Tooltip title={item.title} followCursor arrow placement="top-end">
              <ListItemButton
                component={Link}
                to={item.route}
                selected={location.pathname === item.route}
                className={
                  location.pathname === item.route ? "selectedItem" : "listItem"
                }
              >
                <ListItemIcon className="itemIcon">{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} className="listItemText" />
              </ListItemButton>
            </Tooltip>
            {/* <Divider /> */}
          </Fragment>
        ));
      case "school":
        return SchoolMenuItems.map((item) => (
          <Fragment key={item.key}>
            <Tooltip title={item.title} followCursor arrow placement="top-end">
              <ListItemButton
                component={Link}
                to={item.route}
                selected={location.pathname === item.route}
                className={
                  location.pathname === item.route ? "selectedItem" : "listItem"
                }
              >
                <ListItemIcon className="itemIcon">{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} className="listItemText" />
              </ListItemButton>
            </Tooltip>
            {/* <Divider /> */}
          </Fragment>
        ));
      default:
        break;
    }
  };
  return (
    <>
      <CustomDrawer variant="permanent" open={isDrawerOpen}>
        <CustomDrawerHeader>
          <div style={{ paddingRight: "10px" }}>
            <img
              src={LOGO}
              alt=""
              width="140"
              className="layoutLogo"
              style={{ paddingRight: "5px" }}
            />
          </div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </CustomDrawerHeader>
        {/* <Divider /> */}
        {/* Render Menu Items */}
        <Scrollbars autoHide autoHideTimeout={1000} autoHideDuration={200}>
          <List sx={{ marginTop: "1px" }}>
            {renderMenuByRole()}
            <Box hidden={isDrawerOpen}>
              <Tooltip
                title={"Click Here To Logout"}
                followCursor
                arrow
                placement="top-end"
              >
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToApp className="iconColor" />
                  </ListItemIcon>
                  <ListItemText primary={"Logout"} />
                </ListItemButton>
              </Tooltip>
            </Box>
          </List>

          <Box
            hidden={!isDrawerOpen}
            sx={{
              textAlign: "center",
            }}
          >
            {/* <Typography>Hi User,</Typography>
            <Typography variant="caption">
              Click here to logout from panel
            </Typography> */}
            <div className="">
              <Button
                variant="contained"
                onClick={handleLogout}
                startIcon={<ExitToApp />}
                color="error"
                className="mt-1vh gradient"
              >
                Logout
              </Button>
            </div>
          </Box>
        </Scrollbars>
      </CustomDrawer>
    </>
  );
};

export default DrawerLayout;
