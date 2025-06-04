import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Job, SingleJob } from "../../utility/interface/IJobResponse";
import { useState } from "react";
import { UI_TEXT } from "../../config/config";
import { ArrowRight } from "lucide-react";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import ResumeUpload from "./FileUpload";
import jobService from "../../services/job-service";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface ApplyJobDialogProps {
  children: React.ReactNode;
  jobData: Job | SingleJob;
  isOpen: boolean;
  onStateChange: (open: boolean) => void;
  callParentFunction: () => void;
}

export interface ApplyJobInitialValueTypes {
  resume: File | null;
  cover_letter: string;
}

const ApplyJobDialog = ({
  jobData,
  children,
  isOpen,
  onStateChange,
  callParentFunction,
}: ApplyJobDialogProps) => {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);

  const initialValueApplyJob: ApplyJobInitialValueTypes = {
    resume: null,
    cover_letter: "",
  };

  const validationSchema = Yup.object({
    resume: Yup.mixed()
      .required("Resume is required")
      .test("fileType", "Only PDF files are allowed", (value) => {
        const file = value as File;
        return file ? file.type === "application/pdf" : true;
      })
      .test("fileSize", `File size should not exceed 1 MB`, (value) => {
        const file = value as File;
        return file ? file.size <= 1 * 1024 * 1024 : true;
      }),
    cover_letter: Yup.string()
      .trim()
      .min(100, "Cover letter must be at least 100 characters")
      .max(1000, "Cover letter must not exceed 1000 characters")
      .required("Cover letter is required"),
  });

  const handleOpen = () => {
    setLocalIsOpen(true);
    if (onStateChange) onStateChange(true);
  };

  const handleClose = () => {
    setLocalIsOpen(false);
    if (onStateChange) onStateChange(false);
  };

  const handleSubmit = async (
    values: ApplyJobInitialValueTypes,
    { setSubmitting }: FormikHelpers<ApplyJobInitialValueTypes>
  ) => {
    try {
      await jobService.applyForJob(jobData?._id, values);
      callParentFunction();
      handleClose();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOpen();
        }}
      >
        {children}
      </div>
      <Dialog open={localIsOpen} onOpenChange={handleClose}>
        <DialogPortal>
          <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[600px] gap-6">
            <div className="text-center sm:text-left">
              <DialogTitle className="flex items-start text-xl font-semibold text-gray-900">
                {UI_TEXT.applyNowTitle}: {jobData?.job_title}
              </DialogTitle>
              <div className="mt-2">
                <Formik
                  initialValues={initialValueApplyJob}
                  validationSchema={validationSchema}
                  enableReinitialize
                  onSubmit={handleSubmit}
                >
                  {({
                    errors,
                    touched,
                    setFieldValue,
                    values,
                    isSubmitting,
                  }) => (
                    <Form className="grid grid-cols-1 gap-6 w-full">
                      <div className="w-full">
                        <label className="flex items-start text-sm font-medium text-gray-700 mb-2">
                          Resume
                        </label>
                        <ResumeUpload
                          setFieldValue={setFieldValue}
                          helpText="Max file size: 1MB"
                          error={errors.resume}
                          touched={touched.resume}
                        />
                        {errors.resume && touched.resume && (
                          <div className="text-red-500 text-sm">
                            {errors.resume}
                          </div>
                        )}
                      </div>
                      <div className="w-full">
                        <label className="flex items-start text-sm font-medium text-gray-700 mb-2">
                          Cover Letter
                        </label>
                        <div
                          className={`border rounded-md ${
                            errors.cover_letter && touched.cover_letter
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        >
                          <ReactQuill
                            value={values.cover_letter}
                            onChange={(value) =>
                              setFieldValue("cover_letter", value)
                            }
                            modules={{
                              toolbar: [
                                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                [{ list: "ordered" }, { list: "bullet" }],
                                ["bold", "italic", "underline", "strike"],
                                [{ size: [] }],
                                [{ font: [] }],
                                [{ align: [] }],
                                ["blockquote", "code-block"],
                              ],
                            }}
                            className="h-[250px] max-h-[300px] overflow-y-auto scrollbar-hide"
                          />
                        </div>
                        {errors.cover_letter && touched.cover_letter && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.cover_letter}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClose();
                          }}
                          className="w-full sm:w-auto text-blue-500 bg-blue-100  hover:bg-blue-100"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-blue-500 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
                        >
                          {isSubmitting
                            ? UI_TEXT.proccesing
                            : UI_TEXT.applyNowTitle}
                          {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default ApplyJobDialog;
