import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

const ViewItineraryDialog = ({ rowData, handleClose }) => {
  const params = useParams();
  console.log("Fair ID:", params.fairId);

  // تحقق من أن rowData ليس كائنًا فارغًا
  if (!rowData || typeof rowData !== 'object' || Array.isArray(rowData)) {
    return null; // أو يمكنك عرض رسالة توضيحية هنا
  }

  // تأكد من أن جميع القيم المستخدمة في العرض هي قيم نصية أو روابط
  const regLink = typeof rowData.regLink === 'string' ? rowData.regLink : "No registration link provided";
  const majorUrl = typeof rowData.MajorUrl === 'string' ? rowData.MajorUrl : "Major Link is not defined";
  const locationLink = typeof rowData.link === 'string' ? rowData.link : "No location link provided";
  const notes = typeof rowData.notes === 'string' ? rowData.notes : "No notes available";
  const schoolName = typeof rowData.schoolName === 'string' ? rowData.schoolName : "No school system defined";
  const studentCount = typeof rowData.studentCount === 'number' ? rowData.studentCount : "No student count available";

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={Boolean(rowData)} // تأكد من أن open هي true إذا كان rowData موجودًا
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="customized-dialog-title">
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
                  href={regLink}
                  style={{ textDecoration: "none", fontSize: "1rem" }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {regLink}
                </a>
              </Typography>
              <Typography variant="h6" gutterBottom align="left">
                Student Major Link:{" "}
                <a
                  href={majorUrl}
                  style={{ textDecoration: "none", fontSize: "1rem" }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {majorUrl}
                </a>
              </Typography>
              <Typography variant="h6" gutterBottom align="left">
                Location Link:
                <a
                  href={locationLink}
                  style={{ textDecoration: "none", fontSize: "1rem" }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {locationLink}
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
                  {notes}
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
                  {schoolName}
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
                  {studentCount}
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
