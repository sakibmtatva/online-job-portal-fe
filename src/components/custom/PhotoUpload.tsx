import { useState, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { PHOTO_UPLOAD } from "../../utility/constant";

interface PhotoUploadProps {
  profile_pic: string | File;
  setFieldValue: (field: string, value: any) => void;
  aspectRatio?: "square" | "wide";
  helpText?: string;
  error?: string;
  touched?: boolean;
}

const PhotoUpload = ({
  setFieldValue,
  profile_pic,
  aspectRatio = "square",
  helpText,
  error,
  touched,
}: PhotoUploadProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        if (aspectRatio === "square") {
          if (Math.abs(width / height - 1) > 0.1) {
            alert("Please upload a square image (1:1 aspect ratio)");
            return;
          }
        }
        setFieldValue("profile_pic", file);
        setPreviewImage(URL.createObjectURL(file));
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleDeleteImage = () => {
    setPreviewImage(null);
    setFieldValue("profile_pic", null);
  };

  const containerStyles =
    aspectRatio === "wide"
      ? { width: "100%", height: "240px" }
      : { width: "240px", height: "240px" };

  return (
    <div className="flex items-center space-x-6">
      <div
        className={`w-full relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300 ${
          aspectRatio === "wide" ? "max-w-full" : "max-w-md"
        } ${error && touched ? "border-red-500" : "border-gray-300"}`}
        style={containerStyles}
      >
        {previewImage || profile_pic ? (
          <>
            <img
              src={previewImage ? previewImage : (profile_pic as string)}
              alt={PHOTO_UPLOAD.PREVIEW_ALT}
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleDeleteImage}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
              aria-label={PHOTO_UPLOAD.DELETE_BUTTON_LABEL}
            >
              <X className="h-5 w-5 text-red-600" />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-picture"
              />
              <label
                htmlFor="profile-picture"
                className="flex flex-col items-center justify-center h-full cursor-pointer text-center text-gray-600 p-4"
              >
                <Upload className="w-8 h-8 mb-2" />
                <span className="font-medium">{PHOTO_UPLOAD.LABEL_TEXT}</span>
                <p className="mt-1 text-xs text-gray-500">
                  {helpText || PHOTO_UPLOAD.HELP_TEXT}
                </p>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;
