import {
  ForgotPassword,
  Home,
  Login,
  ParticipatedUniversities,
  Register,
  StudentRegistration,
  StudentMajorReg,
  
  
} from "pages";
import Calendar from "pages/Calendar";
import ProfileVisit from "pages/ProfileVisit";
import { Route, Routes } from "react-router-dom";
// import StudentMajorReg from "pages/StudentMajorReg";


const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/university-register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/calendar" element={<Calendar />} />
     <Route path="/:schoolName/:fairName/:schoolId/:fairId" element={<StudentRegistration />}/>
     <Route path="/StudentMajorReg/:displayName/:fairId/:city/:country" element={<StudentMajorReg />} />

    


      <Route
        path="/:countryId/:cityId"
        element={<ParticipatedUniversities />}
      />
      <Route path="/university/:universityId" element={<ProfileVisit />} />
      {/* <Route path="/fairs/:fairId" component={StudentFairReg} /> */}

      
    </Routes>
  );
};

export default PublicRoutes;
