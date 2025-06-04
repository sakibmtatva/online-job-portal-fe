import { Formik, Form, FormikHelpers } from "formik";
import { FormField } from "../../components/custom/FormField";
import { SelectField } from "../../components/custom/SelectField";
import {
  educationOptions,
  FORM_LABELS,
  PLACEHOLDERS,
} from "../../utility/constant";
import {
  CandidateProfileFormValues,
  candidateProfileSchema,
} from "../../schemas/profile.schema";
import { UI_TEXT } from "../../config/config";
import { Button } from "../../components/ui/button";
import { ICandidateProfileDataResponse } from "../../utility/interface/ICandidateProfile";
import profileService from "../../services/profile-service";
import { Textarea } from "../../components/ui/textarea";
import { useEffect, useState } from "react";
import { LocationRS } from "../../utility/interface/ILocationResponse";
import locationService from "../../services/location-service";
import ResumeUpload from "../../components/custom/FileUpload";
import PhotoUpload from "../../components/custom/PhotoUpload";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { setProfileURL } from "../../features/auth/authSlice";
import { LoadingSpinner } from "../../components/Common";

interface Option {
  label: string;
  value: string;
}

const CandidateProfile = () => {
  const dispatch: AppDispatch = useDispatch();
  const [candidateProfileData, setCandidateProfileData] =
    useState<ICandidateProfileDataResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  const candidateProfileInitialValues: CandidateProfileFormValues = {
    phone_number: candidateProfileData?.phone_number || "",
    resume: candidateProfileData?.resume_url || "",
    profile_pic: candidateProfileData?.profile_url || null,
    position: candidateProfileData?.position || "",
    previous_experience: candidateProfileData?.previous_experience || "",
    total_experience: String(candidateProfileData?.total_experience) || "",
    current_sal: String(candidateProfileData?.current_sal) || "",
    expected_sal: String(candidateProfileData?.expected_sal) || "",
    location: candidateProfileData?.location || "",
    education: candidateProfileData?.education || "",
    nationality: candidateProfileData?.nationality || "",
    bio: candidateProfileData?.bio || "",
    headline: candidateProfileData?.headline || "",
  };

  const [locationOptions, setLocationOptions] = useState<Option[]>([]);

  const getLocationData = async (loading: boolean) => {
    try {
      setLoading(loading);
      const response = await locationService.getLocationData();
      const data: LocationRS[] = response.data?.data;

      const formattedLocations = data.map((location) => ({
        label: location.name,
        value: location.name,
      }));
      setLocationOptions(formattedLocations);
      getCandidateProfileData();
    } catch (e) {}
  };

  const getCandidateProfileData = async () => {
    try {
      const response = await profileService.getCandidateProfileData();
      setCandidateProfileData(response?.data?.data);
      dispatch(
        setProfileURL({ profile_url: response?.data?.data?.profile_url })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationData(true);
  }, []);

  const handleSubmit = async (
    values: CandidateProfileFormValues,
    { setSubmitting }: FormikHelpers<CandidateProfileFormValues>
  ) => {
    try {
      const formData = new FormData();
      formData.append("phone_number", values.phone_number);
      formData.append("education", values.education);
      formData.append("position", values.position);
      formData.append("previous_experience", values.previous_experience);
      formData.append("total_experience", values.total_experience);
      formData.append("current_sal", values.current_sal);
      formData.append("expected_sal", values.expected_sal);
      formData.append("location", values.location);
      formData.append("nationality", values.nationality);
      formData.append("headline", values.headline);
      formData.append("bio", values.bio);
      if (
        !candidateProfileData?.profile_url ||
        values.profile_pic instanceof File
      ) {
        if (values.profile_pic) {
          formData.append("profile_pic", values.profile_pic);
        }
      }
      if (!candidateProfileData?.resume_url || values.resume instanceof File) {
        if (values.resume) {
          formData.append("resume", values.resume);
        }
      }
      await profileService.candidateProfileUpdate(formData);
      getLocationData(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sm:p-6">
      <div className="text-black font-bold text-2xl">
        {UI_TEXT.candidateProfileSettingsTitle}
      </div>
      {loading ? (
        <div className="p-4 border border-gray-400  mt-6 rounded-lg">
          <LoadingSpinner message="Loading profile data.." />
        </div>
      ) : (
        <div className="p-4 border border-gray-400  mt-6 rounded-lg">
          <Formik
            initialValues={candidateProfileInitialValues}
            validationSchema={candidateProfileSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, values, isSubmitting }) => (
           <Form className="grid grid-cols-1 gap-6 w-full">

            {/* Personal Details */}
            <div className="text-lg font-semibold text-black-800">Personal Details</div>
            <div className="grid grid-cols-4 gap-4">
              <div className="w-full col-span-4 md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {FORM_LABELS.PROFILE_PIC}
                </label>
                <PhotoUpload
                  profile_pic={values.profile_pic || ""}
                  aspectRatio="wide"
                  setFieldValue={setFieldValue}
                  error={errors.profile_pic}
                  touched={touched.profile_pic}
                />
                {errors.profile_pic && touched.profile_pic && (
                  <div className="text-red-500 text-sm">{errors.profile_pic}</div>
                )}
              </div>
              <div className="w-full col-span-4 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {FORM_LABELS.RESUME}
                </label>
                <ResumeUpload
                  resume_url={values.resume || ""}
                  setFieldValue={setFieldValue}
                  helpText="Max file size: 1MB"
                  error={errors.resume}
                  touched={touched.resume}
                />
                {errors.resume && touched.resume && (
                  <div className="text-red-500 text-sm">{errors.resume}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="phone_number"
                label={FORM_LABELS.PHONE_NUMBER}
                value={values.phone_number}
                error={errors.phone_number}
                touched={touched.phone_number}
                onChange={(e) => setFieldValue("phone_number", e.target.value)}
                placeholder={PLACEHOLDERS.PHONE_NUMBER}
              />
              <FormField
                id="nationality"
                label={FORM_LABELS.NATIONALITY}
                value={values.nationality}
                error={errors.nationality}
                touched={touched.nationality}
                onChange={(e) => setFieldValue("nationality", e.target.value)}
                placeholder={PLACEHOLDERS.NATIONALITY}
              />
            </div>

            {/* Professional Details */}
            <div className="text-lg font-semibold text-black-800 mt-4">Professional Details</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="position"
                label={FORM_LABELS.POSITION}
                value={values.position}
                error={errors.position}
                touched={touched.position}
                onChange={(e) => setFieldValue("position", e.target.value)}
                placeholder={PLACEHOLDERS.POSITION}
              />
              <FormField
                id="previous_experience"
                label={FORM_LABELS.PREVIOUS_EXPERIENCE}
                value={values.previous_experience}
                error={errors.previous_experience}
                touched={touched.previous_experience}
                onChange={(e) => setFieldValue("previous_experience", e.target.value)}
                placeholder={PLACEHOLDERS.PREVIOUS_EXPERIENCE}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="total_experience"
                label={FORM_LABELS.TOTAL_EXPERIENCE}
                type="number"
                value={String(values.total_experience)}
                error={errors.total_experience}
                touched={touched.total_experience}
                onChange={(e) => setFieldValue("total_experience", Number(e.target.value))}
                placeholder={PLACEHOLDERS.TOTAL_EXPERIENCE}
              />
              <SelectField
                id="location"
                label={FORM_LABELS.LOCATION}
                value={values.location}
                error={errors.location}
                touched={touched.location}
                options={locationOptions}
                onValueChange={(value) => setFieldValue("location", value)}
                placeholder={PLACEHOLDERS.LOCATION}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="current_sal"
                label={FORM_LABELS.CURRENT_SALARY}
                type="number"
                value={String(values.current_sal)}
                error={errors.current_sal}
                touched={touched.current_sal}
                onChange={(e) => setFieldValue("current_sal", Number(e.target.value))}
                placeholder={PLACEHOLDERS.CURRENT_SALARY}
              />
              <FormField
                id="expected_sal"
                label={FORM_LABELS.EXPECTED_SALARY}
                type="number"
                value={String(values.expected_sal)}
                error={errors.expected_sal}
                touched={touched.expected_sal}
                onChange={(e) => setFieldValue("expected_sal", Number(e.target.value))}
                placeholder={PLACEHOLDERS.EXPECTED_SALARY}
              />
            </div>

            <FormField
              id="headline"
              label={FORM_LABELS.HEADLINE}
              value={values.headline}
              error={errors.headline}
              touched={touched.headline}
              onChange={(e) => setFieldValue("headline", e.target.value)}
              placeholder={PLACEHOLDERS.HEADLINE}
            />

            {/* Educational Details */}
            <div className="text-lg font-semibold text-black-800 mt-4">Educational Details</div>
            <SelectField
              id="education"
              label={FORM_LABELS.EDUCATION}
              value={values.education}
              options={educationOptions}
              error={errors.education}
              touched={touched.education}
              onValueChange={(value) => setFieldValue("education", value)}
              placeholder={PLACEHOLDERS.EDUCATION}
            />

            {/* Bio */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {FORM_LABELS.BIO}
              </label>
              <Textarea
                id="bio"
                name="bio"
                value={values.bio}
                onChange={(e) => setFieldValue("bio", e.target.value)}
                placeholder={PLACEHOLDERS.BIO}
                className={`min-h-[200px] ${
                  errors.bio && touched.bio
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.bio && touched.bio && (
                <div className="text-red-500 text-sm">{errors.bio}</div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                {isSubmitting ? UI_TEXT.proccesing : UI_TEXT.saveProfile}
              </Button>
            </div>
          </Form>

            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default CandidateProfile;
