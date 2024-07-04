

import AddSchoolVisit from "components/AddSchoolVisit";



const AddFair = ({ open, setOpenAddStudentDrawer }) => {
  

  return (
    <div className="flex justify-center mx-auto md:w-8/12 w-full">
      <div className="w-full">
        <h3 className="text-center text-2xl mb-5">Add New Fair</h3>
        <AddSchoolVisit />
      </div>
    </div>
    );
};

export default AddFair;
