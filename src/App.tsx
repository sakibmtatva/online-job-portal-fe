import { BrowserRouter, RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import { useNotifications } from "./hooks/useNotification";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import MeetingPopup from "./components/custom/MeetingPopup";
import CandidateMeetingPopup from "./components/custom/CandidateMeetingPopup";

const App = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  useNotifications();
  return (
    <React.Fragment>
      <ToastContainer position="top-right" />
      <RouterProvider router={router} />
      <BrowserRouter>
        {currentUser && currentUser.user_type === "Employer" && (
          <MeetingPopup />
        )}
        {currentUser && currentUser.user_type === "Candidate" && (
          <CandidateMeetingPopup />
        )}
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
