import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../../assets/assets";
import LoginInfo from "../LoginInfo";
import authService from "../../services/auth-service";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ResetPasswordSchema } from "../../schemas/user.schema";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      navigate("/forgot-password");
    }
  }, [navigate]);

  const handleSubmit = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    const email = localStorage.getItem("email");
    if (!email) {
      navigate("/forgot-password");
      return;
    }
    try {
      const response = await authService.resetPassword({
        email,
        newPassword: values.newPassword,
      });

      if (response.status === 200) {
        setIsSuccess(true);
        localStorage.removeItem("email");
        setTimeout(() => navigate("/signin"), 2000);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
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
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-2xl font-bold">Reset Password</h3>
                <p className="text-gray-600">Enter your new password</p>
              </div>
            </div>

            <Formik
              initialValues={{
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={ResetPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  {isSuccess && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg">
                      Password reset successfully! Redirecting to login...
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <Field
                      type="password"
                      name="newPassword"
                      placeholder="Enter new password"
                      className={`w-full p-3 border ${
                        errors.newPassword && touched.newPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      className={`w-full p-3 border ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent`}
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <Link
                      to="/signin"
                      className="text-blue-600 hover:underline"
                    >
                      Back to Login
                    </Link>
                  </div>
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

export default ResetPassword;
