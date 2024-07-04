import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

const Popup = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasDisclaimerShown = localStorage.getItem("hasDisclaimerShown");
    if (!hasDisclaimerShown) {
      const timeout = setTimeout(() => {
        setShowModal(true);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
    localStorage.setItem("hasDisclaimerShown", "true");
  };


  const handleBackdropClick = () => {
    setShowModal(false);
    localStorage.setItem("hasDisclaimerShown", "true");
  };

  return (
    <Dialog open={showModal} onClick={handleBackdropClick}>
      <div className="relative">
        <button
          onClick={closeModal}
          className="p-0.5 rounded-full bg-red-600 absolute top-1 right-1"
        >
          <CloseIcon className="text-white" />
        </button>
        <div className="bg-white h-[15rem] w-[35rem] flex flex-col gap-10 justify-center items-center">
          <div className="absolute bg-theme h-1.5 w-40 -rotate-45 top-2 -left-8"></div>
          <div className="absolute bg-theme h-1.5 w-40 -rotate-45 top-8 -left-8"></div>
          <img src="logo.png" alt="logo" className="h-12 w-40" />
          <h1 className="text-2xl font-semibold text-secondary text-facebook">
            Please Select the City :
          </h1>
        </div>
      </div>
    </Dialog>
  );
};

export default Popup;
