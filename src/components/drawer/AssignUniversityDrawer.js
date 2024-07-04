import { Cancel, Done, School } from "@mui/icons-material";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  Container,
  Drawer,
  Typography,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  List,
} from "@mui/material";
import { useFetch } from "hooks";
import Swal from "sweetalert2";
import { database } from "configs";

const AssignUniversityDrawer = ({
  mainId,
  open,
  setOpenAssignDriverDrawer,
  setRealtime,
}) => {
  const [data, loading] = useFetch(`/Users`);

  const handleAssign = async (universityId) => {
    try {
      const updatedUniversities = open?.universities
        ? [...new Set([universityId, ...open?.universities])]
        : [universityId];

      await database.ref(`Countries/${mainId}`).update({
        universities: updatedUniversities,
      });
      await database.ref(`Countries/${mainId}/cities/${open?.id}`).update({
        universities: updatedUniversities,
      });
      // Fetch the existing countries array for the user (university)
      const userSnap = await database
        .ref(`Users/${universityId}`)
        .once("value");
      const existingCountries = userSnap.val()?.countries || [];
      const existingCities = userSnap.val()?.cities || [];
      // Add the current country ID to the user's countries array
      const updatedCountries = [...new Set([mainId, ...existingCountries])];
      await database.ref(`Users/${universityId}`).update({
        countries: updatedCountries,
      });
      const updatedCities = [...new Set([open?.id, ...existingCities])];
      await database.ref(`Users/${universityId}`).update({
        cities: updatedCities,
      });
      setOpenAssignDriverDrawer(false);

      Swal.fire({
        text: "University Assigned Successfully",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (universityId) => {
    try {
      const updatedUniversities = open?.universities?.filter(
        (id) => id !== universityId
      );

      await database.ref(`Countries/${mainId}`).update({
        universities: updatedUniversities,
      });
      await database.ref(`Countries/${mainId}/cities/${open?.id}`).update({
        universities: updatedUniversities,
      });

      // Fetch the existing countries array for the user (university)
      const userSnap = await database
        .ref(`Users/${universityId}`)
        .once("value");
      const existingCountries = userSnap.val()?.countries || [];
      const existingCities = userSnap.val()?.cities || [];

      // Remove the current country ID from the user's countries array
      const updatedCountries = existingCountries.filter(
        (countryId) => countryId !== mainId
      );
      await database.ref(`Users/${universityId}`).update({
        countries: updatedCountries,
      });
      const updatedCities = existingCities.filter(
        (cityId) => cityId !== open?.id
      );
      await database.ref(`Users/${universityId}`).update({
        cities: updatedCities,
      });

      setOpenAssignDriverDrawer(false);

      Swal.fire({
        text: "University Removed Successfully",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open?.id}
        onClose={() => setOpenAssignDriverDrawer(false)}
      >
        <Container
          style={{
            width: "30vw",
            marginTop: "12vh",
          }}
        >
          <Typography
            align="left"
            color="Highlight"
            sx={{ fontWeight: "bold", marginLeft: "1.8vw" }}
            variant="h6"
          >
            Assign Universities
          </Typography>
          <List>
            {data
              ?.filter((user) => user?.role === "university")
              ?.map((university) => (
                <ListItem key={university?.id} sx={{ marginTop: "" }}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#1877f2" }}>
                      <School className="!text-2xl" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={university?.displayName}
                    secondary={university?.email}
                    primaryTypographyProps={{
                      fontWeight: "bold",
                      fontSize: "1vw",
                      color: "#1877f2",
                    }}
                    secondaryTypographyProps={{
                      fontSize: "1vw",
                    }}
                  />
                  {open?.universities?.includes(university?.id) ? (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="remove"
                        onClick={() => handleRemove(university?.id)}
                      >
                        <Cancel color="secondary" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  ) : (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="assign"
                        onClick={() => handleAssign(university?.id)}
                      >
                        <Done color="success" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
          </List>
        </Container>
      </Drawer>
    </>
  );
};

export default AssignUniversityDrawer;
