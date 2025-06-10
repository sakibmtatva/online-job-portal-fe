export interface Plan {
    id: number;
    description: string;
    name: string;
    duration: "/month" | "/year";
    price: number;
    currency: {
        name: string;
        symbole: string;
    };
    features: string[];
    paymentLink?: string;
    priceId?: string;
}
export interface ISubscriptionRequest {
  plan: Plan;
  successUrl: string;
  cancelUrl: string;
  email: string;
  paymentMode: "subscription" | "setup" | "payment"
}

export interface SessionData {
  id: string;
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
  customer_email?: string;
  amount_total?: number;
  currency?: string;
  metadata?: {
    userId?: string;
    planName?: string;
  };
  subscription?: string;
}