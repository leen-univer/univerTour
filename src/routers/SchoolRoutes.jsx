import { PanelLayout } from "layouts";
import {
  AddNewFair,
  CompletedFairs,
  Credits,
  ExclusiveLeads,
  FairRequests,
  Leads,
  MyLeads,
  Notifications,
  SchoolDashboard,
  SchoolFairs,
  Settings,
  StudentRegistration,
  // UniversityDashboard,
  UniversitySupport,
} from "pages";
import { Route, Routes } from "react-router-dom";
import StudentFairReg from "pages/StudentMajorReg";


// import SchoolDashboard from "pages/SchoolDashboard";
const SchoolRoutes = () => {
  return (
    <PanelLayout>
      <Routes>
        <Route path="/" element={<SchoolDashboard />} />
        <Route path="/dashboard" element={<SchoolDashboard />} />
        <Route path="/account-settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/normal-leads" element={<MyLeads />} />
        <Route path="/exclusive-leads" element={<ExclusiveLeads />} />
        <Route path="/completed-fairs" element={<CompletedFairs />} />
        <Route path="/fair-requests" element={<FairRequests />} />
        <Route path="/upcoming-fairs" element={<SchoolFairs />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/add-fairs" element={<AddNewFair />} />
        <Route path="/student-register" element={<StudentRegistration />} />
        <Route path="/fairs/:fairId" component={StudentFairReg} />
        <Route path="/university-support" element={<UniversitySupport />} />
      </Routes>
    </PanelLayout>
  );
};

export default SchoolRoutes;
