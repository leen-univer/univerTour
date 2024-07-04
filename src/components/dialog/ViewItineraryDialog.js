import {
  Avatar,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { CONTACTIMG } from "assets";
import { useParams } from "react-router-dom";

import { useHistory } from "react-router-dom";

const ViewItineraryDialog = ({ rowData, handleClose }) => {
  const params = useParams();
  console.log("Fair ID:", params.fairId);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={rowData}
      maxWidth="md"
      fullWidth
      className=""
    >
      <DialogTitle className="" id="customized-dialog-title">
        <p className="text-center text-xl font-bold text-theme tracking-wide">
          VIEW ITINERARY DETAILS
        </p>
      </DialogTitle>
      <DialogContent className="app-scrollbar" sx={{ p: 2 }}>
        <div className="md:w-full md:px-4 px-2 tracking-wide">
          <div
            style={{
              padding: "2px",
              margin: "auto",
              backgroundColor: "#eef5f9",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom align="left">
                Registration Link:
                <a
                  href={rowData?.regLink}
                  style={{
                    textDecoration: "none",
                    fontSize: "1rem",
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {rowData?.regLink}
                </a>
              </Typography>
              <Typography variant="h6" gutterBottom align="left">
                Student Major Link:{" "}
                {rowData?.MajorUrl ? (
                  <a
                    href={rowData?.MajorUrl}
                    style={{ textDecoration: "none", fontSize: "1rem" }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {rowData?.MajorUrl}
                  </a>
                ) : (
                  "Major Link is not defined"
                )}
              </Typography>
              <Typography variant="h6" gutterBottom align="left">
                Location Link:
                <a
                  href={rowData?.link}
                  style={{
                    textDecoration: "none",
                    fontSize: "1rem",
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {rowData?.link}
                </a>
              </Typography>
              <Typography variant="h6" gutterBottom align="left">
                Notes:
                <span
                  style={{
                    color: "rgb(30, 136, 229)",
                    fontSize: "15px",
                    wordBreak: "break-word",
                    wordWrap: "break-word",
                  }}
                >
                  {" "}
                  {rowData?.notes}{" "}
                </span>
              </Typography>
              <Typography variant="h6" gutterBottom align="left">
                School System:
                <span
                  style={{
                    color: "rgb(30, 136, 229)",
                    fontSize: "15px",
                    wordBreak: "break-word",
                    wordWrap: "break-word",
                  }}
                >
                  {" "}
                  {rowData?.schoolName}{" "}
                </span>
              </Typography>
              <Typography variant="h6" gutterBottom align="left">
                Number Of Students:
                <span
                  style={{
                    color: "rgb(30, 136, 229)",
                    fontSize: "15px",
                    wordBreak: "break-word",
                    wordWrap: "break-word",
                  }}
                >
                  {" "}
                  {rowData?.studentCount}{" "}
                </span>
              </Typography>
            </CardContent>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewItineraryDialog;
