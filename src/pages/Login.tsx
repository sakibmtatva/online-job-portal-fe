import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { logo } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import LoginInfo from "./LoginInfo";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { login } from "../features/auth/authSlice";
import { ILoginRequest } from "../utility/interface/ILogin";
import SignupService from "../services/auth-service";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigate();

  const initialValues: ILoginRequest = {
    email: "",
    password: "",
  };

  const handleLogin = async (
    values: ILoginRequest,
    { setSubmitting, resetForm }: FormikHelpers<ILoginRequest>
  ) => {
    const { email, password } = values;
    const finalData = {
      email,
      password,
    };
    try {
      const response = await SignupService.login(finalData);
      const { token, user } = response.data;
      if (user?.isVerified) {
        dispatch(login({ user, token }));
        resetForm();
        navigation("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigation("/forgot-password");
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
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-2xl font-bold"> Sign In</h3>
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
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

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Forgot Password?
                    </button>
                  </div>

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
                        Sign In
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

export default Login;
