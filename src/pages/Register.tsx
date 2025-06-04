import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logo } from "../assets/assets";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import LoginInfo from "./LoginInfo";
import SignupService from "../services/auth-service";
import { ISignupRequest } from "../utility/interface/ISignup";

const RegisterSchema = Yup.object().shape({
  user_type: Yup.string().required("Account type is required"),
  full_name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Full name is required"),

  user_name: Yup.string()
    .min(3, "Too Short!")
    .max(20, "Too Long!")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "user_name can only contain letters, numbers and underscore"
    )
    .required("user_name is required"),

  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),

  termsAccepted: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
});

type FormValues = {
  user_type: string; // "Candidate" | "Employer"
  full_name: string;
  user_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userType = queryParams.get("type") || "Candidate";
  const initialValues: FormValues = {
    user_type: userType,
    full_name: "",
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    const { user_type, user_name, full_name, email, password } = values;
    const finalData: ISignupRequest = {
      user_type,
      full_name,
      user_name,
      email,
      password,
    };
    try {
      await SignupService.signup(finalData);
      resetForm();
      navigation("/signin");
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="w-full lg:w-1/2 p-6 lg:p-12 overflow-y-auto">
        <Link to="/" className="inline-flex items-center gap-2 mb-12">
          <img
            src={logo}
            alt="logo"
            width={24}
            height={24}
            className="w-auto h-auto"
          />
          <h2 className="text-xl font-bold">Career Connect</h2>
        </Link>
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Formik
              initialValues={initialValues}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">Create account</h3>
                      <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link
                          to="/signin"
                          className="text-blue-600 hover:underline"
                        >
                          Log in
                        </Link>
                      </p>
                    </div>
                    {/* Dropdown wrapped in Formik */}
                    <div className="relative">
                      <Field
                        as="select"
                        name="user_type"
                        className="w-[125px] p-3 border border-gray-200 border-r-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Employer">Employers</option>
                        <option value="Candidate">Candidate</option>
                      </Field>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Full Name & user_name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Field
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        className={`w-full p-3 border ${
                          errors.full_name && touched.full_name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent`}
                      />
                      <ErrorMessage
                        name="full_name"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Field
                        type="text"
                        name="user_name"
                        placeholder="user_name"
                        className={`w-full p-3 border ${
                          errors.user_name && touched.user_name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent`}
                      />
                      <ErrorMessage
                        name="user_name"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className={`w-full p-3 border ${
                        errors.email && touched.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className={`w-full p-3 border ${
                        errors.password && touched.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {/* {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} */}
                    </button>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className={`w-full p-3 border ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {/* {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />} */}
                    </button>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start gap-2">
                    <Field
                      type="checkbox"
                      id="termsAccepted"
                      name="termsAccepted"
                      className={`mt-1 ${
                        errors.termsAccepted && touched.termsAccepted
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <label
                      htmlFor="termsAccepted"
                      className="text-sm text-gray-600"
                    >
                      I've read and agree with your{" "}
                      <Link
                        to="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        Terms of Services
                      </Link>
                    </label>
                  </div>
                  <ErrorMessage
                    name="termsAccepted"
                    component="div"
                    className="text-red-500 text-xs mt-0"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      "Processing..."
                    ) : (
                      <>
                        Create Account
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <LoginInfo />
    </div>
  );
};

export default Register;
