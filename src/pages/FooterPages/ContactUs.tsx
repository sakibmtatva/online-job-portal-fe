import Footer from "../../components/custom/Footer";
import { Contact_content } from "../../utility/constant";
import Header from "../../components/custom/Header";
import ContactUsService from "../../services/contactus-service";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { IContactUsRequest } from "../../utility/interface/ISignup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

export const ContactPage = () => {
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const initialValues = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required"),
  });

  const handleSubmit = async (values: IContactUsRequest) => {
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA.");
      return;
    }
    setLoading(true);
    try {
      await ContactUsService.contactUs(values);
      navigate("/");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {/* <div className="flex md:justify-between md:flex-row flex-col bg-gray-50 px-4 md:px-12 lg:px-36 py-3">
        <ul className="flex flex-col md:flex-row text-[#767E94] space-x-3">
          {Contact_content.navLinks.map((link, idx) => (
            <li key={idx}>{link}</li>
          ))}
        </ul>
        <div className="flex flex-row space-x-3 md:my-0 my-3">
          <PhoneCallIcon />
          <div>{Contact_content.phoneNumber}</div>
          <img src={usaFlag} />
          <div className="text-[#767E94]">{Contact_content.language}</div>
          <ChevronDown />
        </div>
      </div> */}

      {/* <div className="flex md:flex-row flex-col md:justify-between px-4 md:px-12 lg:px-36 py-3 items-center">
        <div className="flex md:flex-row flex-col items-center space-x-8">
          <div className="py-3 flex items-center gap-1 max-w-48">
            <img
              src={logo}
              alt="logo"
              width={40}
              height={40}
              className="w-auto h-auto"
            />
            <h2 className="text-2xl font-bold max-w-40">
              {Contact_content.logoText}
            </h2>
          </div>
          <div className="flex items-center border border-gray-300 rounded-md w-90 h-12 bg-white">
            <div className="flex items-center gap-2 px-4 py-2 border-r border-gray-200">
              <img src={indFlag} alt="India" className="w-5 h-3" />
              <span className="text-sm font-medium">
                {Contact_content.country}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <div className="px-3 text-blue-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder={Contact_content.searchPlaceholder}
              className="flex-1 p-2 text-sm text-gray-600 focus:outline-none"
            />
          </div>
        </div>
        <div className="space-x-3 md:my-0 my-3">
          <button className="bg-white  text-blue-600 border border-blue-200 font-medium py-2 rounded-xs px-4">
            {Contact_content.signIn}
          </button>
          <button className="bg-blue-600 text-white font-medium py-2 rounded-xs px-4">
            {Contact_content.postJob}
          </button>
        </div>
      </div> */}
      <Header />
      <div className="flex justify-between bg-gray-50 items-center min-h-15 px-4 md:px-12 lg:px-36">
        <div className="text-black font-medium">
          {Contact_content.breadcrumbTitle}
        </div>
        <div className="text-sm text-gray-500">
          <span>{Contact_content.breadcrumbHome}</span> /{" "}
          <span className="text-gray-800 font-medium">
            {Contact_content.breadcrumbCurrent}
          </span>
        </div>
      </div>

      {/* <div className="flex flex-col lg:flex-row gap-10 px-4 md:px-12 py-12 sm:py-24 lg:px-36"> */}
      {/* <div className="lg:w-1/2 lg:mr-28">
          <h4 className="text-sm text-blue-600 font-semibold mb-3">
            {Contact_content.sectionTitle}
          </h4>
          <h2 className="text-4xl font-bold text-gray-900 mb-10">
            {Contact_content.sectionHeading}
          </h2>
          <p className="text-gray-600 mb-6 lg:mr-18">
            {Contact_content.sectionDescription}
          </p>
          <button className="bg-blue-600 text-white font-medium px-5 py-2 rounded-xs hover:bg-blue-700 transition">
            {Contact_content.emailSupportButton}
          </button>
        </div> */}
      <div className="flex justify-center gap-10 px-4 md:px-12 py-12 sm:py-24 lg:px-36">
        <div className="lg:w-1/2">
          <div className="bg-white p-8 shadow-xl rounded-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-6">
              {Contact_content.formTitle}
            </h3>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <Field name="name">
                      {({ field, meta }: FieldProps) => (
                        <input
                          {...field}
                          type="text"
                          placeholder={Contact_content.inputName}
                          className={`w-full p-2 rounded placeholder-[#9199A3] border ${
                            meta.touched && meta.error
                              ? "border-red-500"
                              : "border-[#E4E5E8]"
                          }`}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="w-1/2">
                    <Field name="email">
                      {({ field, meta }: FieldProps) => (
                        <input
                          {...field}
                          type="email"
                          placeholder={Contact_content.inputEmail}
                          className={`w-full p-2 rounded placeholder-[#9199A3] border ${
                            meta.touched && meta.error
                              ? "border-red-500"
                              : "border-[#E4E5E8]"
                          }`}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Field name="subject">
                    {({ field, meta }: FieldProps) => (
                      <input
                        {...field}
                        type="text"
                        placeholder={Contact_content.inputSubject}
                        className={`w-full p-2 rounded placeholder-[#9199A3] border ${
                          meta.touched && meta.error
                            ? "border-red-500"
                            : "border-[#E4E5E8]"
                        }`}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Field name="message">
                    {({ field, meta }: FieldProps) => (
                      <textarea
                        {...field}
                        placeholder={Contact_content.inputMessage}
                        className={`w-full p-2 rounded placeholder-[#9199A3] border ${
                          meta.touched && meta.error
                            ? "border-red-500"
                            : "border-[#E4E5E8]"
                        }`}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="message"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div
                  className="w-full overflow-hidden flex justify-center"
                  style={{ height: "78px" }}
                >
                  <ReCAPTCHA
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    onChange={(token: any) => setCaptchaToken(token)}
                    onExpired={() => setCaptchaToken(null)}
                  />
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className={`w-full  ${
                    loading
                      ? "bg-blue-300 text-grey"
                      : " bg-blue-600 text-white hover:bg-blue-700 transition"
                  } font-medium py-2 rounded-xs  flex justify-center items-center gap-2`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      {/* <img src={mapPhoto} /> */}
      <Footer />
    </div>
  );
};

export default ContactPage;
