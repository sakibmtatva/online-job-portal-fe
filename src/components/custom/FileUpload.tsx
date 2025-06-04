import { useState, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";

interface ResumeUploadProps {
  resume_url?: string | File;
  setFieldValue: (field: string, value: any) => void;
  helpText?: string;
  error?: string;
  touched?: boolean;
}

const MAX_FILE_SIZE_MB = 1;

const ResumeUpload = ({
  resume_url,
  setFieldValue,
  helpText,
  error,
  touched,
}: ResumeUploadProps) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFieldValue("resume", file);
      setSelectedFileName(file.name);
    }
  };

  const handleDeleteFile = () => {
    setFieldValue("resume", null);
    setSelectedFileName(null);
  };

  return (
    <div
      className={`w-full border-2 border-dashed rounded-lg p-2 relative ${
        error && touched ? "border-red-500" : "border-gray-300"
      }`}
    >
      {resume_url || selectedFileName ? (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 truncate">
            {typeof resume_url === "string" && resume_url !== "" ? (
              <a
                href={resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                View Resume
              </a>
            ) : (
              selectedFileName
            )}
          </div>
          <button
            onClick={handleDeleteFile}
            className="text-red-600 hover:bg-gray-200 p-1 rounded-full"
            aria-label="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-gray-600 cursor-pointer">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="w-8 h-8 mb-2" />
            <span className="font-medium">
              Click to upload your resume (PDF)
            </span>
            <p className="mt-1 text-xs text-gray-500">
              {helpText || `Max file size: ${MAX_FILE_SIZE_MB}MB`}
            </p>
          </label>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
