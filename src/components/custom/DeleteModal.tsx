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
import jobService from "../../services/job-service";
interface DeleteDialogProps {
  children: React.ReactNode;
  jobId: string;
  onSuccessDelete: () => void;
}

const DeleteDialog = ({
  children,
  jobId,
  onSuccessDelete,
}: DeleteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const deleteAJob = async () => {
    try {
      await jobService.deleteAJob(jobId);
      handleClose();
      onSuccessDelete();
    } catch (e) {}
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
                Confirm Delete
              </DialogTitle>
              <DialogDescription className="mt-2 text-gray-500">
                Are you sure you want delete a job?
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
                onClick={deleteAJob}
                className="w-full sm:w-auto"
              >
                Yes, Delete
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default DeleteDialog;
