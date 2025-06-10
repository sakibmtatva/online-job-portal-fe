import { useState } from "react";
import ResumePDF from "./ResumePDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

const MultiStepResumeForm = (props: any): any => {
  const [showModal, setShowModal] = useState(false);
  const fullName = props.resumeData?.data?.fullName || "";
  const lastName = props.resumeData?.data?.lastName || "";
  const fileName = `${fullName}_${lastName}_resume.pdf`;
  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* <div className="relative inline-block">
  <button className="px-3 py-2 bg-white border rounded shadow">Theme</button>
  <div className="absolute w-100 mt-2 grid grid-cols-6 gap-2 p-3 bg-white border rounded shadow-lg z-10">
    {themeColors.map((color:any, idx:any) => (
      <button
        key={idx}
        onClick={() => props.setSelectedColor(color)}
        className={`w-5 h-5 rounded-full border-2 hover:scale-110 transition-all`}
        style={{
          backgroundColor: color,
          borderColor: props.selectedColor === color ? "#000" : "transparent",
        }}
      />
    ))}
  </div>
</div> */}

      {props.step === 1 && (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Personal Details</h2>
          <h2 className="text-sm font-medium mb-4 text-gray-700">
            Get started with the basic information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                name="fullName"
                value={props.formData.fullName}
                onChange={props.handleChange}
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                name="lastName"
                value={props.formData.lastName}
                onChange={props.handleChange}
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                placeholder="Enter your last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                name="jobTitle"
                value={props.formData.jobTitle}
                onChange={props.handleChange}
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                placeholder="Enter your job title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                value={props.formData.address}
                onChange={props.handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                rows={4}
                placeholder="Write your address..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                value={props.formData.email}
                onChange={props.handleChange}
                type="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                name="phone"
                value={props.formData.phone}
                onChange={props.handleChange}
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">About yourself</label>
              <textarea
                name="about"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                rows={4}
                placeholder="About yourself..."
                value={props.formData.about}
                onChange={props.handleChange}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={props.goNext}
              >
                Next
              </button>
              <button
                type="submit"
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                onClick={props.handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {props.step === 2 && (
        <div className="bg-white shadow-md p-6 rounded-lg mt-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Professional Experience</h2>
          {props.formData.professionalExperience.map((exp: any, index: any) => (
            <div key={index} className="border border-gray-300 p-4 mb-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="positionTitle"
                  value={exp.positionTitle}
                  onChange={(e) => props.handleExperienceChange(index, e)}
                  placeholder="Position Title"
                  className="w-full p-2 border rounded"
                />
                <input
                  name="companyName"
                  value={exp.companyName}
                  onChange={(e) => props.handleExperienceChange(index, e)}
                  placeholder="Company Name"
                  className="w-full p-2 border rounded"
                />
                <input
                  name="city"
                  value={exp.city}
                  onChange={(e) => props.handleExperienceChange(index, e)}
                  placeholder="City"
                  className="w-full p-2 border rounded"
                />
                <input
                  name="state"
                  value={exp.state}
                  onChange={(e) => props.handleExperienceChange(index, e)}
                  placeholder="State"
                  className="w-full p-2 border rounded"
                />
                <input
                  name="startDate"
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => props.handleExperienceChange(index, e)}
                  className="w-full p-2 border rounded"
                />
                <input
                  name="endDate"
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => props.handleExperienceChange(index, e)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <textarea
                name="summary"
                value={exp.summary}
                onChange={(e) => props.handleExperienceChange(index, e)}
                placeholder="Describe your work..."
                className="w-full p-2 mt-2 border rounded"
                rows={4}
              />

              <button
                type="button"
                onClick={() => props.removeExperience(index)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mt-2"
              >
                - Remove Experience
              </button>

            </div>
          ))}
          <button
            type="button"
            onClick={props.addExperience}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Add More Experience
          </button>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={props.goBack}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Back
            </button>
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={props.goNext}
            >
              Next
            </button>
            <button
              type="button"
              onClick={props.handleSubmit}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {props.step === 3 && (
        <div className="bg-white shadow-md p-6 rounded-lg mt-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Education</h2>
          <p className="text-sm font-medium mb-4 text-gray-700">Add your educational details</p>

          {(props.formData.educationDetails || []).map((edu: any, index: number) => (
            <form className="border border-gray-300 p-4 mb-4 rounded-md" key={index}>
              <div>
                <label className="block text-sm font-medium text-gray-700">University Name</label>
                <input
                  type="text"
                  name="university"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Enter university name"
                  value={edu.university || ''}
                  onChange={(e) => props.handleEducationChange(index, e)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Enter degree"
                    value={edu.degree || ''}
                    onChange={(e) => props.handleEducationChange(index, e)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Major</label>
                  <input
                    type="text"
                    name="major"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Enter major"
                    value={edu.major || ''}
                    onChange={(e) => props.handleEducationChange(index, e)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    value={edu.startDate || ''}
                    onChange={(e) => props.handleEducationChange(index, e)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    value={edu.endDate || ''}
                    onChange={(e) => props.handleEducationChange(index, e)}
                  />
                </div>
              </div>

              {(props.formData.educationDetails?.length || 0) > 1 && (
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mt-2"
                  onClick={() => props.removeEducation(index)}
                >
                  - Remove
                </button>
              )}
            </form>
          ))}
          <div className="flex space-x-2">
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              onClick={props.addEducation}
            >
              + Add More Education
            </button>

          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              onClick={props.goBack}
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => { props.handleSubmit(); setShowModal(true) }}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Save
            </button>
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md text-center">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Resume Saved Successfully!</h2>
                  <p className="text-base text-gray-600">
                    Would you like to download your resume now?
                  </p>
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    className="bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <PDFDownloadLink
                    document={<ResumePDF resumeInfo={props.resumeData.data} />}
                    fileName={fileName}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    {({ loading }) => (loading ? "Preparing..." : "Download Resume")}
                  </PDFDownloadLink>
                </div>
              </div>
            </div>

          )}
        </div>
      )}


    </div>
  );
};

export default MultiStepResumeForm;
