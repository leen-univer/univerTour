import { PanelLayout } from "layouts";
import {
  AddCredit,
  AllCountries,
  AllSchoolFairs,
  AllUniversities,
  Announcements,
  Archive,
  Categories,
  Contacts,
  CreditManagement,
  Dashboard,
  ManageFAQs,
  Notifications,
  PreviousFairs,
  Products,
  RequestedExclusiveCredits,
  RequestedUniversities,
  SchoolFairRequests,
  Schools,
  Settings,
  StudentManagement,
  Supports,
  Universities,
  Users,

} from "pages";
import AddMultiAdmin from "pages/AddMultiAdmin";
import FolderDetail from "pages/FolderDetail";
import PhotoWall from "pages/PhotoWall";
import RequestedNormalCredits from "pages/RequestedNormalCredits";
import RequestEvent from "pages/RequestEvent";
import { Route, Routes } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ViewItineraryDialog } from "components/dialog";
import { Navigate } from "react-router-dom";





import StudentPulse from 'pages/StudentPulse'; 


const PrivateRoutes = () => {
  const params = useParams();
  return (
    <PanelLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account-settings" element={<Settings />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/all-universities" element={<AllUniversities />} />
        <Route path="/credit-management" element={<CreditManagement />} />
        <Route path="/student-management" element={<StudentManagement />} />
        <Route path="/previous-fairs" element={<PreviousFairs />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/supports" element={<Supports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/users" element={<Users />} />
        <Route path="/requested-universities" element={<RequestedUniversities />}/>
        <Route path="/schools" element={<Schools />} />
        <Route path="/requested-event" element={<RequestEvent />} />
        <Route path="/add-credits" element={<AddCredit />} />
        <Route path="/requested-normal-leads" element={<RequestedNormalCredits />}/>
        <Route path="/requested-exclusive-leads" element={<RequestedExclusiveCredits />}/>
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/manage-faqs" element={<ManageFAQs />} />
        <Route path="/school-fairs" element={<AllSchoolFairs />} />
        <Route path="/school-fair-requests" element={<SchoolFairRequests />} />
        <Route path="/all-countries" element={<AllCountries />} />
        <Route path="/photo-wall" element={<PhotoWall />} />
        <Route path="/photo-wall/:folderIndex" element={<FolderDetail />} />
        <Route path="/add-multi-admin" element={<AddMultiAdmin />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/StudentPulse" element={<StudentPulse />} />
        <Route path="/view-itinerary/:fairId" component={ViewItineraryDialog} />
        {/* <Route path="/:schoolName/:fairName/:schoolId" element={<StudentMajorReg />}/> */}

      </Routes>
    </PanelLayout>
  );
};

export default PrivateRoutes;
