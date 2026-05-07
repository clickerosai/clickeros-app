import { FeatureScreen } from "@/components/feature-screen";

export default function ReportsScreen() {
  return (
    <FeatureScreen
      title="Marketing Reports"
      subtitle="Generate branded PDF reports"
      iconName="doc.text.fill"
      iconColor="#14B8A6"
      stats={[
        { label: "Reports Generated", value: "24", change: "This Month" },
        { label: "Clients", value: "8", change: "Receiving" },
        { label: "Avg. Time Saved", value: "4hrs", change: "Per Report" },

      ]}
      features={[
        { title: "One-Click PDF Reports", desc: "Generate comprehensive marketing reports in seconds", icon: "📄" },
        { title: "White-Label Branding", desc: "Add your agency logo and brand colors to all reports", icon: "🎨" },
        { title: "Scheduled Delivery", desc: "Auto-send reports to clients on a weekly or monthly schedule", icon: "📅" },
        { title: "Custom Metrics", desc: "Choose which KPIs and charts to include in each report", icon: "⚙️" },

      ]}
      ctaLabel="Generate Report"

    />
  );
}
