import { useState } from "react";
import Layout from "../../components/LoggedInlayout/LoggedInLayout";
import { Button } from "../../components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import subscriptionService from "../../services/subscription-service";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { plans } from "../../utility/constant";
import { Plan } from "../../utility/interface/ISubscription";
import LoadingFallback from "../../routes";

const stripePromise = loadStripe(import.meta.env.VITE_STRIP_PUBLIC_KEY!);

const Subscriptions = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(plans[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const handleSelect = (planName: Plan) => {
    setSelectedPlan(planName);
  };

  const handleCheckout = async (plan: Plan) => {
    handleSelect(plan);
    if (plan.name !== "Starter" || plan.id !== 1) {
      setLoading(true);
      try {
        const stripe = await stripePromise;

        if (!stripe) {
          console.error(
            "Stripe failed to load. Check your public key env variable."
          );
          return;
        }

        const { data } = await subscriptionService.checkoutSubscription({
          plan,
          paymentMode: "subscription",
          successUrl: `${window.location.origin}/paymentSuccess/{CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/subscriptions`,
          email: currentUser?.email ?? "",
        });

        const sessionId = data.data.id;

        await stripe.redirectToCheckout({
          sessionId,
        });
      } catch (error) {
        console.error("Checkout error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Layout>
      {loading && <LoadingFallback />}
      <div className="container py-5">
        <h2 className="text-center mb-18 text-5xl font-bold">
          Choose Your Plan
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            return (
              <div
                key={plan.name}
                className="card"
                style={{
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  transform: isSelected ? "scale(1.04)" : "scale(1)",
                  boxShadow: isSelected
                    ? "0 8px 24px rgba(37, 99, 235, 0.2)"
                    : "0 6px 18px rgba(0, 0, 0, 0.05)",
                  border: isSelected
                    ? "2px solid #2563eb"
                    : "1px solid #e5e7eb",
                  padding: "1.5rem",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div className="card-body p-0">
                  <h5
                    className="fw-bold mb-2"
                    style={{
                      fontSize: "26px",
                      letterSpacing: "0.4px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {plan.name}
                  </h5>

                  <p
                    style={{
                      fontSize: "15px",
                      color: "#6b7280",
                      marginBottom: "1rem",
                      minHeight: "48px",
                    }}
                  >
                    {plan.description}
                  </p>

                  <h6
                    className="mb-3"
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#2563eb",
                    }}
                  >
                    {`${plan.currency.symbole}${plan.price} ${plan.duration}`}
                  </h6>

                  <hr className="mb-4" />

                  <ul
                    className="list-unstyled text-start mb-4"
                    style={{ fontSize: "16px", color: "#374151" }}
                  >
                    {plan.features.map((feature, index) => (
                      <li key={index} className="mb-1 font-medium">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`w-[100%] mt-auto cursor-pointer ${
                    isSelected
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white fw-semibold`}
                  onClick={() => handleCheckout(plan)}
                >
                  {isSelected ? "Selected" : "Choose"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Subscriptions;
