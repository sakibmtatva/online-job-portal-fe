import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import authService from "../../services/auth-service";

type VerificationStatus = "pending" | "success" | "error";

const REDIRECT_DELAY = 2000;
const SIGNIN_PATH = "/signin";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | unknown>(null);
  const token = searchParams.get("token");

  const handleVerification = async () => {
    if (!token) {
      setVerificationStatus("error");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.verifyEmail(token);
      
      if (response.status === 200) {
        setVerificationStatus("success");
        setTimeout(() => navigate(SIGNIN_PATH), REDIRECT_DELAY);
      }
    } catch (error) {
      setVerificationStatus("error");
      setError(error);
      console.error("Email verification failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
    }
  }, [token]);

  const renderPendingState = () => (
    <div className="space-y-8">
      <div className="bg-blue-50 p-6 rounded-lg">
        <p className="text-gray-700 text-lg">
          Please verify your email to access all features of Job Portal
        </p>
      </div>
      <Button
        onClick={handleVerification}
        disabled={loading}
        className="w-md bg-blue-600 hover:bg-blue-700 transition-colors text-lg py-6"
      >
        {loading && <Loader2 className="h-6 w-6 animate-spin mr-2" />}
        {loading ? "Verifying..." : "Verify Email"}
      </Button>
    </div>
  );

  const renderSuccessState = () => (
    <div className="space-y-6">
      <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto animate-bounce" />
      <div className="bg-green-50 p-6 rounded-lg">
        <p className="text-green-700 font-medium text-lg">
          Email verified successfully! Welcome to JobPortal Pro.
        </p>
        <p className="text-green-600 text-base mt-3">
          Redirecting to login...
        </p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="space-y-6">
      <XCircle className="h-20 w-20 text-red-500 mx-auto" />
      <div className="bg-red-50 p-6 rounded-lg">
        <p className="text-red-700 text-lg">
          {!token
            ? "Invalid verification link. Please check your email for the correct link."
            : typeof error === "string"
            ? error
            : "An error occurred while verifying your email."}
        </p>
      </div>
      <Button
        onClick={() => navigate(SIGNIN_PATH)}
        variant="outline"
        className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 text-lg py-6"
      >
        Return to Login
      </Button>
    </div>
  );

  const renderContent = () => {
    const stateMap = {
      pending: renderPendingState,
      success: renderSuccessState,
      error: renderErrorState,
    };
    return stateMap[verificationStatus]();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
      <Card className="w-full max-w-2xl p-12 shadow-xl border-t-4 border-blue-500">
        <div className="text-center">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-blue-600 mb-3">
              Job Portal
            </h2>
            <h3 className="text-2xl font-semibold text-gray-700">
              Email Verification
            </h3>
          </div>
          {renderContent()}
        </div>
      </Card>
    </div>
  );
};

export default VerifyEmail;
