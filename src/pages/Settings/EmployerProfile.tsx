import { Formik, Form, FormikHelpers } from "formik";
import { Button } from "../../components/ui/button";
import { FormField } from "../../components/custom/FormField";
import {
  EMPLOYER_FORM_LABELS,
  EMPLOYER_PLACEHOLDERS,
  FORM_LABELS,
} from "../../utility/constant";
import {
  EmployerProfileFormValues,
  employerProfileSchema,
} from "../../schemas/profile.schema";
import { Textarea } from "../../components/ui/textarea";
import { UI_TEXT } from "../../config/config";
import profileService from "../../services/profile-service";
import { useEffect, useState } from "react";
import { IEmployerProfileDataResponse } from "../../utility/interface/IEmployerProfile";
import locationService from "../../services/location-service";
import { LocationRS } from "../../utility/interface/ILocationResponse";
import { SelectField } from "../../components/custom/SelectField";
import PhotoUpload from "../../components/custom/PhotoUpload";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { setProfileURL } from "../../features/auth/authSlice";
import { LoadingSpinner } from "../../components/Common";

interface Option {
  label: string;
  value: string;
}

const EmployerProfile = () => {
  const dispatch: AppDispatch = useDispatch();
  const [employerProfileData, setEmployerProfileData] =
    useState<IEmployerProfileDataResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues: EmployerProfileFormValues = {
    profile_pic: employerProfileData?.profile_url || null,
    phone_number: employerProfileData?.phone_number || "",
    location: employerProfileData?.location || "",
    website: employerProfileData?.website || "",
    about_us: employerProfileData?.about_us || "",
    est_year: String(employerProfileData?.est_year) || "",
    industry_type: employerProfileData?.industry_type || "",
    total_working_employees:
      String(employerProfileData?.total_working_employees) || "",
    vision: employerProfileData?.vision || "",
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
      getEmployerProfileData();
    } catch (e) {}
  };

  const getEmployerProfileData = async () => {
    try {
      const response = await profileService.getEmployerProfileData();
      setEmployerProfileData(response?.data?.data);
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
    values: EmployerProfileFormValues,
    { setSubmitting }: FormikHelpers<EmployerProfileFormValues>
  ) => {
    try {
      const formData = new FormData();
      formData.append("est_year", values.est_year);
      formData.append(
        "total_working_employees",
        values.total_working_employees
      );
      formData.append("phone_number", values.phone_number);
      formData.append("location", values.location);
      formData.append("website", values.website);
      formData.append("about_us", values.about_us);
      formData.append("industry_type", values.industry_type);
      formData.append("vision", values.vision);
      if (
        !employerProfileData?.profile_url ||
        values.profile_pic instanceof File
      ) {
        if (values.profile_pic) {
          formData.append("profile_pic", values.profile_pic);
        }
      }
      await profileService.employerProfileUpdate(formData);
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
        {UI_TEXT.employerProfileSettingsTitle}
      </div>
      {loading ? (
        <div className="p-4 border border-gray-400  mt-6 rounded-lg">
          <LoadingSpinner message="Loading profile data.." />
        </div>
      ) : (
        <div className="p-4 border border-gray-400  mt-6 rounded-lg">
          <Formik
            initialValues={initialValues}
            validationSchema={employerProfileSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, values, isSubmitting }) => (
              <Form className="grid grid-cols-1 gap-6 w-full">
                <div className="grid grid-cols-4 gap-4">
                  <div className="w-full col-span-4 md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {FORM_LABELS.PROFILE_PIC}
                    </label>
                    <PhotoUpload
                      profile_pic={values.profile_pic ? values.profile_pic : ""}
                      aspectRatio="wide"
                      setFieldValue={setFieldValue}
                      error={errors.profile_pic}
                      touched={touched.profile_pic}
                    />
                    {errors.profile_pic && touched.profile_pic && (
                      <div className="text-red-500 text-sm">
                        {errors.profile_pic}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id="phone_number"
                    label={EMPLOYER_FORM_LABELS.PHONE_NUMBER}
                    value={values.phone_number}
                    error={errors.phone_number}
                    touched={touched.phone_number}
                    onChange={(e) =>
                      setFieldValue("phone_number", e.target.value)
                    }
                    placeholder={EMPLOYER_PLACEHOLDERS.PHONE_NUMBER}
                  />
                  <SelectField
                    id="location"
                    label={EMPLOYER_FORM_LABELS.LOCATION}
                    value={values.location}
                    error={errors.location}
                    touched={touched.location}
                    options={locationOptions}
                    onValueChange={(value) => setFieldValue("location", value)}
                    placeholder={EMPLOYER_PLACEHOLDERS.LOCATION}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id="website"
                    label={EMPLOYER_FORM_LABELS.WEBSITE}
                    value={values.website}
                    error={errors.website}
                    touched={touched.website}
                    onChange={(e) => setFieldValue("website", e.target.value)}
                    placeholder={EMPLOYER_PLACEHOLDERS.WEBSITE}
                  />
                  <FormField
                    id="est_year"
                    label={EMPLOYER_FORM_LABELS.ESTABLISHED_YEAR}
                    type="number"
                    value={String(values.est_year)}
                    error={errors.est_year}
                    touched={touched.est_year}
                    onChange={(e) =>
                      setFieldValue("est_year", Number(e.target.value))
                    }
                    placeholder={EMPLOYER_PLACEHOLDERS.ESTABLISHED_YEAR}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id="industry_type"
                    label={EMPLOYER_FORM_LABELS.INDUSTRY_TYPE}
                    value={values.industry_type}
                    error={errors.industry_type}
                    touched={touched.industry_type}
                    onChange={(e) =>
                      setFieldValue("industry_type", e.target.value)
                    }
                    placeholder={EMPLOYER_PLACEHOLDERS.INDUSTRY_TYPE}
                  />
                  <FormField
                    id="total_working_employees"
                    label={EMPLOYER_FORM_LABELS.TOTAL_EMPLOYEES}
                    type="number"
                    value={values.total_working_employees || ""}
                    error={errors.total_working_employees}
                    touched={touched.total_working_employees}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericValue = value ? Number(value) : "";
                      setFieldValue("total_working_employees", numericValue);
                    }}
                    placeholder={EMPLOYER_PLACEHOLDERS.TOTAL_EMPLOYEES}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {EMPLOYER_FORM_LABELS.ABOUT_US}
                    </label>
                    <Textarea
                      id="about_us"
                      name="about_us"
                      value={values.about_us}
                      onChange={(e) =>
                        setFieldValue("about_us", e.target.value)
                      }
                      placeholder={EMPLOYER_PLACEHOLDERS.ABOUT_US}
                      className={`min-h-[150px] ${
                        errors.about_us && touched.about_us
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    {errors.about_us && touched.about_us && (
                      <div className="text-red-500 text-sm">
                        {errors.about_us}
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {EMPLOYER_FORM_LABELS.VISION}
                    </label>
                    <Textarea
                      id="vision"
                      name="vision"
                      value={values.vision}
                      onChange={(e) => setFieldValue("vision", e.target.value)}
                      placeholder={EMPLOYER_PLACEHOLDERS.VISION}
                      className={`min-h-[150px] ${
                        errors.vision && touched.vision
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    {errors.vision && touched.vision && (
                      <div className="text-red-500 text-sm">
                        {errors.vision}
                      </div>
                    )}
                  </div>
                </div>

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

export default EmployerProfile;
