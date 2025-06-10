import {
  Calendar,
  Download,
  FileText,
  GraduationCap,
  Layers3,
  Mail,
  Map,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { UI_TEXT } from "../../config/config";
import { Application } from "../../utility/interface/IApplicationResponse";
import { getEducation } from "../Common";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { ScheduleSchema } from "../../schemas/profile.schema";
import schedulemeetingService from "../../services/schedulemeeting-service";

interface MeetingValues {
  date: string;
  startTime: string;
  endTime: string;
}

interface CandidateOverviewModalProps {
  visible: boolean;
  onClose: () => void;
  application: Application;
}

const CandidateOverviewModal = ({
  application,
  visible,
  onClose,
}: CandidateOverviewModalProps) => {
  const [shouldRender, setShouldRender] = useState(visible);
  const [showPicker, setShowPicker] = useState(false);
  const togglePicker = () => setShowPicker(!showPicker);
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!shouldRender) return null;
  const profile = application.candidate["candidate-profile-info"];

  const scheduleMeetingWithCandidate = async (
    values: MeetingValues,
    { setSubmitting }: FormikHelpers<MeetingValues>
  ) => {
    try {
      const formData = new FormData();
      formData.append("candidateId", application.candidate.id);
      formData.append("date", values.date);
      formData.append("start_time", values.startTime);
      formData.append("end_time", values.endTime);
      await schedulemeetingService.scheduleMeetingWithCandidate(
        application.job,
        formData
      );
    } catch (error) {
      console.error("Error scheduling meeting:", error);
    } finally {
      setSubmitting(false);
      togglePicker();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-4 bg-black/50 transition-opacity duration-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white w-full max-w-5xl rounded-xl shadow-lg p-4 sm:p-6 overflow-y-scroll relative transition-all duration-400 transform ${
          visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        } max-h-[90vh] scrollbar-hide`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {profile.profile_url && profile.profile_url !== "" ? (
              <img
                src={profile.profile_url}
                alt={application.candidate.full_name}
                className="w-[60px] h-[60px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[60px] h-[60px] rounded-full bg-[#767F8C] flex items-center justify-center">
                <span className="text-white text-xl">
                  {application.candidate.full_name.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <h2 className="text-base sm:text-lg font-semibold">
                {application.candidate.full_name}
              </h2>
              <p className="text-sm text-gray-500">{profile.position}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            {/* <Button
              variant="outline"
              className="bg-white cursor-pointer text-[#0A65CC] border-[#0A65CC] rounded-sm px-4 py-2 hover:bg-white hover:text-[#0A65CC] flex items-center justify-center gap-2"
            >
              <Mail className="w-[20px] h-[20px]" />
              <span>{UI_TEXT.sendMail}</span>
            </Button> */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <Button
                variant="outline"
                onClick={togglePicker}
                className="bg-white cursor-pointer w-full text-[#0A65CC] border-[#0A65CC] rounded-sm px-4 py-2 hover:bg-white hover:text-[#0A65CC] flex items-center justify-center gap-2"
              >
                <Calendar className="w-[20px] h-[20px]" />
                <span>{UI_TEXT.scheduleMeeting}</span>
              </Button>
              {showPicker && (
                <div className="absolute min-w-[250px] top-full w-full sm:w-auto right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-50">
                  <Formik
                    initialValues={{ date: "", startTime: "", endTime: "" }}
                    validationSchema={ScheduleSchema}
                    onSubmit={scheduleMeetingWithCandidate}
                  >
                    {({ touched, errors, isSubmitting }) => (
                      <Form className="flex flex-col gap-2 w-full">
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-1">
                            {UI_TEXT.selectDate}
                          </label>
                          <Field
                            name="date"
                            type="date"
                            className={`px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                              touched.date && errors.date
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                          />
                          <ErrorMessage
                            name="date"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <Field
                            name="startTime"
                            type="time"
                            className={`px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                              touched.startTime && errors.startTime
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                          />
                          <ErrorMessage
                            name="startTime"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <Field
                            name="endTime"
                            type="time"
                            className={`px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                              touched.endTime && errors.endTime
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                          />
                          <ErrorMessage
                            name="endTime"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowPicker(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-600  border border-gray-300 rounded-sm"
                          >
                            {UI_TEXT.Cancel}
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#0A65CC] text-white rounded-sm hover:bg-[#0A65CC]"
                          >
                            {isSubmitting
                              ? UI_TEXT.proccesing
                              : UI_TEXT.Schedule}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
            </div>
            {/* <Button className="bg-[#0A65CC] cursor-pointer text-white border-[#0A65CC] rounded-sm px-4 py-2 hover:bg-[#0A65CC] flex items-center justify-center gap-2">
              <CircleArrowRight className="w-[20px] h-[20px]" />
              <span>{UI_TEXT.hireCandidates}</span>
            </Button> */}
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-4 md:p-0 border-[#E7F0FA] rounded-lg border-2 md:border-none">
              {profile.bio && (
                <>
                  <h2 className="text-xl font-semibold text-[#18191C] mb-3">
                    {UI_TEXT.biography}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 break-words">
                    {profile.bio}
                  </p>
                  <div className="border-t border-gray-200 mb-3"></div>
                </>
              )}
              <h2 className="text-xl font-semibold text-[#18191C] mb-3">
                {UI_TEXT.coverLetter}
              </h2>
              <div className="max-w-full overflow-x-auto">
                <p
                  className="text-gray-600 text-sm leading-relaxed break-words whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: application.cover_letter }}
                ></p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-white p-4 rounded-lg border-2 border-[#E7F0FA]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
                  <div className="flex flex-col items-start gap-1">
                    <Map className="text-[#0A65CC]" />
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      {UI_TEXT.nationality}
                    </span>
                    <span className="font-medium text-[#18191C] text-sm">
                      {profile.nationality ?? "Not Updated"}
                    </span>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <Layers3 className="text-[#0A65CC]" />
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      {UI_TEXT.educations}
                    </span>
                    <span className="font-medium text-[#18191C] text-sm">
                      {getEducation(profile.education) ?? "Not Updated"}
                    </span>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <GraduationCap className="text-[#0A65CC]" />
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      {UI_TEXT.experience}
                    </span>
                    <span className="font-medium text-[#18191C] text-sm">
                      {profile.total_experience != null
                        ? `${profile.total_experience} years`
                        : "Not Updated"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-[#E7F0FA]">
                <h3 className="text-base sm:text-lg text-[#18191C] font-semibold mb-3">
                  {UI_TEXT.downloadResume}
                </h3>
                <div className="flex justify-between items-center">
                  <div className="flex flex-row items-center gap-2">
                    <FileText className="text-[#E4E5E8] w-[48px] h-[48px]" />
                    <div className="flex flex-col">
                      <h2 className="text-base text-[#767F8C]">
                        {application.candidate.full_name}
                      </h2>
                      <p className="text-md font-semibold text-[#18191C]">
                        PDF
                      </p>
                    </div>
                  </div>
                  <a
                    href={application.resume_url.replace(
                      "/raw/upload/",
                      "/raw/upload/fl_attachment/"
                    )}
                    download
                    className="flex justify-center items-center w-[48px] h-[48px] bg-[#E7F0FA] rounded-md"
                  >
                    <Download className="w-[24px] h-[24px] text-[#0A65CC]" />
                  </a>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-[#E7F0FA]">
                <h3 className="text-base sm:text-lg text-[#18191C] font-semibold mb-4">
                  {UI_TEXT.contactInformation}
                </h3>
                <div className="flex flex-row flex-wrap items-center gap-4 mb-3">
                  <Mail className="text-[#0A65CC] shrink-0" />
                  <div className="flex flex-col">
                    <h2 className="text-sm text-[#767F8C]">
                      {UI_TEXT.emailAddress}
                    </h2>
                    <p className="text-sm font-semibold text-[#18191C]">
                      {application.candidate.email}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200 mb-3"></div>
                <div className="flex flex-row flex-wrap items-center gap-4 mb-3">
                  <Phone className="text-[#0A65CC] shrink-0" />
                  <div className="flex flex-col">
                    <h2 className="text-sm text-[#767F8C]">{UI_TEXT.phone}</h2>
                    <p className="text-sm font-semibold text-[#18191C]">
                      {profile.phone_number ?? "Not Updated"}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200 mb-3"></div>
                <div className="flex flex-row flex-wrap items-center gap-4">
                  <MapPin className="text-[#0A65CC] shrink-0" />
                  <div className="flex flex-col">
                    <h2 className="text-sm text-[#767F8C]">
                      {UI_TEXT.location}
                    </h2>
                    <p className="text-sm font-semibold text-[#18191C]">
                      {profile.location ?? "Not Updated"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateOverviewModal;
