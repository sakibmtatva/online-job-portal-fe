import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../../assets/assets";
import LoginInfo from "../LoginInfo";
import authService from "../../services/auth-service";
import { Loader2 } from "lucide-react";
import { otpGenerateSchema } from "../../schemas/user.schema";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const handleSubmit = async (
    values: { email: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    if (values.email) {
      try {
        const response = await authService.forgotPassword(values.email);
        if (response.status === 200) {
          localStorage.setItem("email", values.email);
          resetForm();
          navigate("/verify-otp");
        }
      } catch (error) {
        console.error("Failed to send reset email:", error);
      }
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
                <h3 className="text-2xl font-bold">Forgot Password</h3>
                <p className="text-gray-600">
                  Enter your email address to reset your password
                </p>
              </div>
            </div>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={otpGenerateSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <Link to="/signin" className="text-blue-600 hover:underline">
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

export default ForgotPassword;
