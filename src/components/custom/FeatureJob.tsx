import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { feturejob } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import jobService from "../../services/job-service";
interface PromoteJobModalProps {
  visible: boolean;
  onClose: () => void;
  id: string;
  jobName: string;
}

export default function PromoteJobModal({
  visible,
  onClose,
  id,
  jobName,
}: PromoteJobModalProps) {
  const [selected, setSelected] = useState("featured");
  const [shouldRender, setShouldRender] = useState(visible);
  const navigate = useNavigate();
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(timer);
    }
  }, [visible]);
  const handleSubmit = async (id: string) => {
    try {
      await jobService.featureJob(id,true);
      onClose();
    } catch (e) {}
  };
  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 overflow-y-scroll relative transition-all duration-400 transform ${
          visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        } max-h-[90vh] scrollbar-hide`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-1">
            🎉 Congratulations, Your Job is successfully posted!
          </h2>
          <p className="text-sm text-gray-600">
            You can manage your form in the my-jobs section in your dashboard
          </p>
          <button
            onClick={() => {
              navigate("/myjobs");
            }}
            className="mt-3 px-4 py-2 border-2 border-blue-600 text-blue-600 font-bold rounded-xs flex items-center gap-3 hover:bg-blue-50"
          >
            View Jobs
            <ArrowRight />
          </button>
        </div>

        <hr className="my-6" />

        <h3 className="text-lg font-semibold mb-1">Promote Job: {jobName}</h3>
        <p className="text-sm text-gray-600 mb-4">
          Make your job listing stand out and attract top talent by promoting
          it. Promoted jobs appear higher in search results, gain more
          visibility, and draw attention from experienced candidates actively
          looking for design roles.
        </p>

        <div className="flex gap-4 md:flex-row flex-col">
          {/* Featured Option */}
          <div
            className={`border md:w-1/2 w-full rounded-lg p-4 cursor-pointer ${
              selected === "featured" ? "border-blue-600" : "border-gray-200"
            }`}
            onClick={() => setSelected("featured")}
          >
            <div className="mb-2 text-sm font-medium text-gray-700">
              ALWAYS ON THE TOP
            </div>
            {/* <div className="bg-gray-100 h-20 mb-2 rounded">
              <div className="bg-blue-600 h-4 w-2/3 mt-4 ml-4 rounded"></div>
            </div> */}
            <img src={feturejob} />
            <div className="flex items-start gap-2 ">
              <input
                type="radio"
                className="mt-4"
                checked={selected === "featured"}
                readOnly
              />
              <div className="mt-2">
                <div className="font-semibold">Featured Your Job</div>
                <p className="text-sm text-gray-500">
                  Featured Your Job to show this job on top of listings
                </p>
              </div>
            </div>
          </div>

          {/* Highlight Option */}
          {/* <div
            className={`border md:w-1/2 w-full rounded-lg p-4 cursor-pointer ${
              selected === "highlight" ? "border-blue-600" : "border-gray-200"
            }`}
            onClick={() => setSelected("highlight")}
          >
            <div className="mb-2 text-sm font-medium text-gray-700">
              HIGHLIGHT JOB WITH COLOR
            </div>
            <div className="bg-gray-100 h-20 mb-2 rounded">
              <div className="bg-yellow-400 h-4 w-2/3 mt-4 ml-4 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" checked={selected === "highlight"} readOnly />
              <div>
                <div className="font-semibold">Highlight Your Job</div>
                <p className="text-sm text-gray-500">
                  Sed neque diam, lacinia nec dolor et, euismod bibendum turpis.
                  Sed feugiat fauc.
                </p>
              </div>
            </div>
          </div> */}
        </div>
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={onClose}
            className="text-gray-500 font-medium hover:text-gray-700 text-sm"
          >
            Skip Now
          </button>
          <button
            onClick={() => handleSubmit(id)}
            className="bg-blue-600 text-white px-8 py-3 rounded-sm text-sm hover:bg-blue-700 flex items-center gap-2"
          >
            PROMOTE JOB <ArrowRight className="text-sm font-light" />
          </button>
        </div>
      </div>
    </div>
  );
}
