import { Form, Formik, FormikHelpers } from "formik";
import { UI_TEXT } from "../../config/config";
import {
  JobFormValues,
  jobValidationSchema,
} from "../../schemas/profile.schema";
import { FormField } from "../../components/custom/FormField";
import { SelectField } from "../../components/custom/SelectField";
import {
  experienceLevelOptions,
  Job_Form_Labels,
  Job_Form_Placeholder,
  jobTypeOptions,
} from "../../utility/constant";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { MultiSelectField } from "../../components/custom/MultiSelectField";
import { IJobPostRequest } from "../../utility/interface/IJobPost";
import jobService from "../../services/job-service";
import { Label } from "../../components/ui/label";
import { useEffect, useState } from "react";
import skillsService from "../../services/skills-service";
import { Skill } from "../../utility/interface/ISkillResponse";
import { ArrowLeft } from "lucide-react";
import locationService from "../../services/location-service";
import { LocationRS } from "../../utility/interface/ILocationResponse";
import { JobCategory } from "../../utility/interface/IJobCategories";
import PromoteJobModal from "../../components/custom/FeatureJob";

interface PostJobProp {
  jobData: JobFormValues | null;
  jobId: string | null;
  onClickBack?: () => void;
  onSuccess?: () => void;
}

export interface Option {
  label: string;
  value: string;
}

const PostJobForm = ({
  jobData,
  jobId,
  onClickBack,
  onSuccess,
}: PostJobProp) => {
  const [skillsOptions, setSkillsOptions] = useState<Option[]>([]);
  const [locationOptions, setLocationOptions] = useState<Option[]>([]);
  const [jobCategoryOptions, setJobCategoryOptions] = useState<Option[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [jobName, setjobName] = useState<string>("");

  const getSkillData = async () => {
    try {
      const response = await skillsService.getSkillsData();
      const data: Skill[] = response.data?.data;

      const formattedSkills = data.map((skill) => ({
        label: skill.name,
        value: skill.name,
      }));

      setSkillsOptions(formattedSkills);
    } catch (e) {}
  };

  const getLocationData = async () => {
    try {
      const response = await locationService.getLocationData();
      const data: LocationRS[] = response.data?.data;

      const formattedLocations = data.map((location) => ({
        label: location.name,
        value: location.name,
      }));
      setLocationOptions(formattedLocations);
    } catch (e) {}
  };

  const getJobCategoryData = async () => {
    try {
      const response = await jobService.getJobCategoryData();
      const data: JobCategory[] = response.data?.data;

      const formattedJobCategories = data.map((category) => ({
        label: category.name,
        value: category.name,
      }));
      setJobCategoryOptions(formattedJobCategories);
    } catch (e) {}
  };

  useEffect(() => {
    getSkillData();
    getLocationData();
    getJobCategoryData();
  }, []);

  const jobInitialValues: JobFormValues = {
    job_title: jobData ? jobData.job_title : "",
    job_description: jobData ? jobData.job_description : "",
    location: jobData ? jobData.location : "",
    min_salary: jobData ? jobData.min_salary : "",
    max_salary: jobData ? jobData.max_salary : "",
    jobType: jobData ? jobData.jobType : "",
    skills_required: jobData ? jobData.skills_required : [],
    experience_level: jobData ? jobData.experience_level : "",
    education: jobData ? jobData.education : "",
    category: jobData ? jobData.category : "",
    closing_date: jobData ? jobData.closing_date : null,
    is_featured: jobData ? jobData.is_featured : false,
  };

  const handleSubmit = async (
    values: JobFormValues,
    { setSubmitting, resetForm }: FormikHelpers<JobFormValues>
  ) => {
    try {
      const payload: IJobPostRequest = {
        job_title: values.job_title,
        job_description: values.job_description,
        location: values.location,
        salary_min: values.min_salary,
        salary_max: values.max_salary,
        jobType: values.jobType,
        skills_required: values.skills_required,
        experience_level: values.experience_level,
        education: values.education,
        category: values.category,
        closing_date: values.closing_date,
        is_featured: values.is_featured ? values.is_featured : false,
      };
      if (jobData && jobId) {
        await jobService.editAJob(jobId, payload);
        onSuccess?.();
      } else {
        const response = await jobService.postAJob(payload);
        setId(response.data.data._id), setjobName(response.data.data.job_title);
        resetForm();
        setOpenModal(true);
      }
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="sm:p-6">
      <div className="flex justify-between items-center">
        <div className="text-black font-bold text-2xl">
          {jobData ? UI_TEXT.editAJob : UI_TEXT.postAJob}
        </div>
        {jobData && (
          <Button
            onClick={() => onClickBack?.()}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
        )}
      </div>
      <div className="p-4 border border-gray-400  mt-6 rounded-lg">
        <Formik
          initialValues={jobInitialValues}
          validationSchema={jobValidationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values, isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  id="job_title"
                  label={Job_Form_Labels.JOB_TITLE}
                  value={values.job_title}
                  error={errors.job_title}
                  touched={touched.job_title}
                  onChange={(e) => {
                    setFieldValue("job_title", e.target.value);
                  }}
                  placeholder={Job_Form_Placeholder.JOB_TITLE_PLACEHOLDER}
                />
                <SelectField
                  id="category"
                  label={Job_Form_Labels.CATEGORY}
                  value={values.category}
                  error={errors.category}
                  touched={touched.category}
                  options={jobCategoryOptions}
                  onValueChange={(value) => setFieldValue("category", value)}
                  placeholder={Job_Form_Placeholder.CATEGORY}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  id="location"
                  label={Job_Form_Labels.LOCATION}
                  value={values.location}
                  error={errors.location}
                  touched={touched.location}
                  options={locationOptions}
                  onValueChange={(value) => setFieldValue("location", value)}
                  placeholder={Job_Form_Placeholder.LOCATION}
                />
                <div>
                  <Label className="mb-2 block">Job Expiry Date</Label>
                  <input
                    type="date"
                    value={
                      values.closing_date
                        ? values.closing_date.toString().split("T")[0]
                        : ""
                    }
                    placeholder="Enter Closing Date"
                    onChange={(e) =>
                      setFieldValue(
                        "closing_date",
                        e.target.value ? e.target.value : null
                      )
                    }
                    className={`w-full border px-2 py-1 rounded-md ${
                      errors.closing_date && touched.closing_date
                        ? "border-red-500"
                        : "border-input"
                    }`}
                  />
                  {errors.closing_date && touched.closing_date && (
                    <div className="text-red-500 text-sm">
                      {errors.closing_date}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  id="min_salary"
                  label={Job_Form_Labels.MINIMUM_SALARY}
                  type="number"
                  value={String(values.min_salary)}
                  error={errors.min_salary}
                  touched={touched.min_salary}
                  onChange={(e) =>
                    setFieldValue("min_salary", Number(e.target.value))
                  }
                  placeholder={Job_Form_Placeholder.MINIMUM_SALARY_PLACEHOLDER}
                />
                <FormField
                  id="max_salary"
                  label={Job_Form_Labels.MAXIMUM_SALARY}
                  type="number"
                  value={String(values.max_salary)}
                  error={errors.max_salary}
                  touched={touched.max_salary}
                  onChange={(e) =>
                    setFieldValue("max_salary", Number(e.target.value))
                  }
                  placeholder={Job_Form_Placeholder.MAXIMUM_SALARY_PLACEHOLDER}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  id="jobType"
                  label={Job_Form_Labels.JOB_TYPE}
                  value={values.jobType}
                  error={errors.jobType}
                  options={jobTypeOptions}
                  touched={touched.jobType}
                  onValueChange={(value) => setFieldValue("jobType", value)}
                  placeholder={Job_Form_Placeholder.JOB_TYPE_PLACEHOLDER}
                />
                <SelectField
                  id="experience_level"
                  label={Job_Form_Labels.EXPERIENCE_LEVEL}
                  value={values.experience_level}
                  error={errors.experience_level}
                  touched={touched.experience_level}
                  options={experienceLevelOptions}
                  onValueChange={(value) =>
                    setFieldValue("experience_level", value)
                  }
                  placeholder={
                    Job_Form_Placeholder.EXPERIENCE_LEVEL_PLACEHOLDER
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  id="education"
                  label={Job_Form_Labels.EDUCATION}
                  value={values.education}
                  error={errors.education}
                  touched={touched.education}
                  onChange={(e) => setFieldValue("education", e.target.value)}
                  placeholder={Job_Form_Placeholder.EDUCATION_PLACEHOLDER}
                />
                <MultiSelectField
                  id="skills_required"
                  label={Job_Form_Labels.SKILLS}
                  value={values.skills_required}
                  options={skillsOptions}
                  onChange={(selectedSkills) =>
                    setFieldValue("skills_required", selectedSkills)
                  }
                  placeholder={Job_Form_Placeholder.SKILLS_PLACEHOLDER}
                  error={errors.skills_required as unknown as string}
                  touched={touched.skills_required as unknown as boolean}
                />
              </div>
              <div className="w-full">
                <Label className="mb-2">{UI_TEXT.jobDescription}</Label>
                <Textarea
                  id="job_description"
                  name="job_description"
                  value={values.job_description}
                  onChange={(e) =>
                    setFieldValue("job_description", e.target.value)
                  }
                  placeholder={Job_Form_Placeholder.JOB_DESCRIPTION_PLACEHOLDER}
                  className={`min-h-[150px] ${
                    errors.job_description && touched.job_description
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.job_description && touched.job_description && (
                  <div className="text-red-500 text-sm">
                    {errors.job_description}
                  </div>
                )}
              </div>
              {jobData && jobId && (
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    name="is_featured"
                    type="checkbox"
                    className="w-5 h-5"
                    checked={values.is_featured}
                    onChange={(e) =>
                      setFieldValue("is_featured", e.target.checked)
                    }
                  />
                  <span className="text-blue-600 font-medium">
                    {values.is_featured
                      ? "Unchecked to Make this Job Unfeatured"
                      : "Make this Job Featured to Place it on top of Job Listing"}
                  </span>
                </label>
              )}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting
                    ? UI_TEXT.proccesing
                    : jobData
                    ? UI_TEXT.editJob
                    : UI_TEXT.postJob}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        <PromoteJobModal
          visible={openModal}
          onClose={() => setOpenModal(false)}
          id={id}
          jobName={jobName}
        />
      </div>
    </div>
  );
};

export default PostJobForm;
