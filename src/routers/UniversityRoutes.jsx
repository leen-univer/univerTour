import { PanelLayout } from "layouts";
import {
  Credits,
  Documents,
  ExclusiveLeads,
  Leads,
  MyLeads,
  Notifications,
  ParticipatedUniversities,
  PhotoWall,
  Settings,
  UniversityDashboard,
  UniversityFairs,
  UniversitySupport,
  Users
} from "pages";
import ProfileVisit from "pages/ProfileVisit";
import UniFolderDetails from "pages/UniFolderDetails";
import { Route, Routes } from "react-router-dom";
import UpcomingFairs from "./UpcomingFairs";
const UniversityRoutes = () => {
  return (
    <PanelLayout>
      <Routes>
        <Route path="/" element={<UniversityDashboard />} />
        <Route path="/dashboard" element={<UniversityDashboard />} />
        <Route path="/account-settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/itinerary" element={<Leads />} />
        <Route path="/normal-leads" element={<MyLeads />} />
        <Route path="/exclusive-leads" element={<ExclusiveLeads />} />
        <Route path="/upcoming-fairs" element={<UpcomingFairs />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/university-support" element={<UniversitySupport />} />
        <Route path="/university-fairs" element={<UniversityFairs />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/photos" element={<PhotoWall />} />
        <Route path="/photos/:folderIndex" element={<UniFolderDetails />} />

        <Route path="/users" element={<Users />} />
        <Route
          path="/:countryId/:cityId"
          element={<ParticipatedUniversities />}
        />
        <Route path="/university/:universityId" element={<ProfileVisit />} />

      </Routes>
    </PanelLayout>
  );
};

export default UniversityRoutes;
