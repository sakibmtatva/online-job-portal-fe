import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/LoggedInlayout/LoggedInLayout";
import { Button } from "../../components/ui/button";
import subscriptionService from "../../services/subscription-service";
import { useEffect, useState } from "react";
import { SessionData } from "../../utility/interface/ISubscription";
import LoadingFallback from "../../routes";

const Success = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleNavigateToDashboard = () => {
    navigate("/dashboard");
  };
  const fetchSession = async () => {
    try {
      const response = await subscriptionService.getSessionData(
        sessionId ?? ""
      );
      if (response?.data?.success) {
        setSession(response.data.data);
      } else {
        handleNavigateToDashboard();
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      handleNavigateToDashboard();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionId) {
      handleNavigateToDashboard();
      return;
    }

    fetchSession();
  }, [sessionId, navigate]);

  return (
    <Layout>
      {loading || !session ?
      <LoadingFallback />
       : <div
        style={{
          minHeight: "100%",
          backgroundColor: "#f9fafb",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: "linear-gradient(90deg, #4f46e5 0%, #3b82f6 100%)",
            padding: "4rem 2rem",
            textAlign: "center",
            color: "white",
          }}
        >
          <h1 style={{ fontSize: "3rem", margin: 0, fontWeight: "800" }}>
            🎉 Payment <span style={{ color: "#d1fae5" }}>Successful</span>
          </h1>
          <p
            style={{ fontSize: "1.4rem", marginTop: "1rem", fontWeight: "500" }}
          >
            <strong>Thank you!</strong> Your subscription is now{" "}
            <strong>active</strong>.
          </p>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "3rem 1rem",
          }}
        >
          <div
            style={{ textAlign: "center", maxWidth: "600px", width: "100%" }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              style={{
                fontSize: "2.2rem",
                marginBottom: "1rem",
                color: "#111827",
                fontWeight: "700",
              }}
            >
              You're all set!
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#374151",
                marginBottom: "2rem",
                lineHeight: "1.6",
              }}
            >
              Your account now has access to all{" "}
              <strong style={{ color: "#2563eb" }}>premium features</strong>.
              Click below to start exploring!
            </p>

            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-6 rounded-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>}
    </Layout>
  );
};

export default Success;
