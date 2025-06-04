import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { UI_TEXT } from "../../config/config";
import schedulemeetingService, {
  Meeting,
} from "../../services/schedulemeeting-service";
import { Formik, Field, ErrorMessage, FormikHelpers, Form } from "formik";
import { ScheduleSchema } from "../../schemas/profile.schema";

interface EditMeetingProp {
  meetingData: Meeting;
  onClickBack: () => void;
  onSuccess: () => void;
}

interface MeetingValues {
  date: string;
  startTime: string;
  endTime: string;
}

const EditMeetingForm = ({
  meetingData,
  onClickBack,
  onSuccess,
}: EditMeetingProp) => {
  const initialValues: MeetingValues = {
    date: meetingData.date,
    startTime: meetingData.start_time,
    endTime: meetingData.end_time,
  };

  const editMeeting = async (
    values: MeetingValues,
    { setSubmitting }: FormikHelpers<MeetingValues>
  ) => {
    try {
      const formData = new FormData();
      formData.append("date", values.date);
      formData.append("start_time", values.startTime);
      formData.append("end_time", values.endTime);
      await schedulemeetingService.editMeeting(meetingData._id, formData);
      onSuccess();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="sm:p-6">
      <div className="flex justify-between items-center">
        <div className="text-black font-bold text-2xl">
          {UI_TEXT.editMeeting}
        </div>
        <Button
          onClick={() => onClickBack()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
      </div>
      <div className="p-4 border border-gray-400  mt-6 rounded-lg">
        <Formik
          initialValues={initialValues}
          validationSchema={ScheduleSchema}
          onSubmit={editMeeting}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting ? UI_TEXT.proccesing : UI_TEXT.editMeeting}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditMeetingForm;
