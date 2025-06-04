import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth-service";
interface LogoutDialogProps {
  children: React.ReactNode;
}

const LogoutDialog = ({ children }: LogoutDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleConfirm = async () => {
    try {
      const fcmToken = localStorage.getItem("fcmToken");
      if (fcmToken) {
        const response = await authService.logout(fcmToken);
        if (response.status === 200) {
          localStorage.removeItem("fcmToken");
          dispatch(logout());
          navigate("/");
          handleClose();
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <div onClick={handleOpen}>{children}</div>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogPortal>
          <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[425px] gap-6">
            <div className="text-center sm:text-left">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Confirm Logout
              </DialogTitle>
              <DialogDescription className="mt-2 text-gray-500">
                Are you sure you want to log out? You'll need to sign in again
                to access your account.
              </DialogDescription>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                className="w-full sm:w-auto"
              >
                Yes, Logout
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default LogoutDialog;
