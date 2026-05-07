import { FeatureScreen } from "@/components/feature-screen";

export default function BillingScreen() {
  return (
    <FeatureScreen
      title="Billing & Plans"
      subtitle="Manage your subscription and payments"
      iconName="creditcard.fill"
      iconColor="#7C3AED"
      stats={[
        { label: "Current Plan", value: "Pro", change: "$49/mo" },
        { label: "Next Invoice", value: "Jun 7", change: "$49.00" },
        { label: "Total Ad Spend", value: "$6,840", change: "This Month" },

      ]}
      features={[
        { title: "Payment Method", desc: "Visa ending in 4242 — expires 12/26", icon: "💳" },
        { title: "Invoice History", desc: "Download past invoices and receipts", icon: "📄" },
        { title: "Usage & Limits", desc: "Track your monthly usage against plan limits", icon: "📊" },
        { title: "Upgrade Plan", desc: "Unlock more features with Agency plan at $149/mo", icon: "⬆️", badge: "Upgrade" },

      ]}
      ctaLabel="Manage Subscription"

    />
  );
}
