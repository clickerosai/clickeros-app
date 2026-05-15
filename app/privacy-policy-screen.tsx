import { ScrollView, Text, View, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";

const SECTIONS = [
  {
    id: "overview",
    title: "1. Overview",
    content: `Clickeros AI, Inc. ("Clickeros," "we," "us," or "our") operates the Clickeros AI mobile application and website (collectively, the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.

We are committed to protecting your privacy. We collect only the data necessary to provide and improve the Service, and we never sell your personal information to third parties.

By using the Service, you agree to the collection and use of information in accordance with this policy.`,
  },
  {
    id: "collect",
    title: "2. Information We Collect",
    content: `We collect information in the following ways:

Account Information: When you create an account, we collect your name, email address, and login method (Google, Apple, or email). This is used to identify your account and personalize your experience.

Usage Data: We automatically collect information about how you interact with the Service, including screens visited, features used, campaign data entered, and actions taken. This data is used to improve the Service and is never linked to your identity for advertising purposes.

Device Information: We collect a non-reversible cryptographic hash of your device identifier for session security and fraud prevention. This hash cannot be used to identify you personally.

Campaign Data: When you create campaigns, we store your campaign details (business name, ad copy, targeting parameters, budget) to provide the Service. This data is yours and is not used for any purpose other than operating your account.

Uploaded Media: Photos and videos you upload for ad creatives are processed and stored securely. Raw media is deleted within 30 days of upload unless you explicitly save it to your creative library.

Voice Data: If you use voice dictation features, audio is transcribed immediately and the raw audio is deleted within 24 hours. Transcribed text is stored as part of your campaign history.`,
  },
  {
    id: "use",
    title: "3. How We Use Your Information",
    content: `We use the information we collect to:

Provide and operate the Service, including processing your campaigns and generating AI ad variations.

Authenticate your identity and maintain the security of your account.

Improve and develop new features by analyzing anonymized usage patterns.

Send you transactional communications such as account confirmations, campaign status updates, and billing receipts.

Respond to your support requests and inquiries.

Comply with legal obligations and enforce our Terms of Service.

We do not use your personal information for behavioral advertising, and we do not build advertising profiles about you.`,
  },
  {
    id: "sharing",
    title: "4. Information Sharing",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following limited circumstances:

Service Providers: We work with trusted third-party vendors who assist us in operating the Service (cloud hosting, payment processing, email delivery). These vendors are contractually bound to use your data only to provide services to us and are prohibited from using it for any other purpose.

Ad Platform Integrations: When you connect your Facebook, Google, TikTok, or other ad platform accounts, campaign data is transmitted to those platforms on your behalf to create and manage your campaigns. This data sharing is controlled entirely by you.

Legal Requirements: We may disclose your information if required by law, court order, or governmental authority, or if we believe disclosure is necessary to protect the rights, property, or safety of Clickeros, our users, or the public.

Business Transfers: If Clickeros is acquired or merged, your information may be transferred as part of that transaction. We will notify you before your information becomes subject to a different privacy policy.`,
  },
  {
    id: "security",
    title: "5. Data Security",
    content: `We implement industry-standard security measures to protect your information:

All data is encrypted in transit using TLS 1.3.

All data is encrypted at rest using AES-256 encryption.

Access to production systems is restricted to authorized personnel only, with multi-factor authentication required.

We conduct regular security audits and vulnerability assessments.

Despite these measures, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we are committed to promptly addressing any security incidents.`,
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: `We retain your personal information for as long as your account is active or as needed to provide the Service. Specific retention periods are:

Account data: Retained for the life of your account plus 90 days after deletion.

Campaign data: Retained for 24 months after the campaign ends, then anonymized.

Voice recordings: Deleted within 24 hours of transcription.

Uploaded media: Deleted within 30 days unless saved to your creative library.

Session logs: Retained for 90 days for security purposes.

You may request deletion of your data at any time by contacting us at privacy@clickeros.ai. We will process deletion requests within 30 days.`,
  },
  {
    id: "rights",
    title: "7. Your Rights",
    content: `Depending on your location, you may have the following rights regarding your personal information:

Access: You have the right to request a copy of the personal information we hold about you.

Correction: You have the right to request correction of inaccurate or incomplete information.

Deletion: You have the right to request deletion of your personal information, subject to certain legal exceptions.

Portability: You have the right to receive your data in a structured, machine-readable format.

Objection: You have the right to object to certain types of processing, including direct marketing.

EU/UK Users (GDPR): You have additional rights including the right to restrict processing, the right to withdraw consent, and the right to lodge a complaint with your local data protection authority.

California Users (CCPA): You have the right to know what personal information is collected, the right to opt-out of the sale of personal information (we do not sell personal information), and the right to non-discrimination for exercising your rights.

To exercise any of these rights, contact us at privacy@clickeros.ai.`,
  },
  {
    id: "cookies",
    title: "8. Cookies & Tracking",
    content: `Our mobile app uses AsyncStorage (a local device storage mechanism) rather than traditional browser cookies. We use this to store your session token, preferences, and app state locally on your device.

On our website, we use strictly necessary cookies for authentication and session management, and optional analytics cookies to understand how users navigate our site. We do not use advertising cookies or third-party tracking pixels on our website.

You can clear all locally stored app data by uninstalling the app or clearing app data in your device settings.`,
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    content: `The Service is not directed to children under the age of 13 (or 16 in the EU). We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately at privacy@clickeros.ai and we will delete it promptly.`,
  },
  {
    id: "international",
    title: "10. International Data Transfers",
    content: `Clickeros AI is based in the United States. If you are accessing the Service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States, where data protection laws may differ from those in your country.

For users in the European Economic Area (EEA), United Kingdom, or Switzerland, we rely on Standard Contractual Clauses approved by the European Commission as the legal mechanism for transferring personal data to the United States.`,
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy in the app and, where required by law, by sending you an email notification. The "Last Updated" date at the top of this policy indicates when it was last revised.

Your continued use of the Service after any changes constitutes your acceptance of the updated policy.`,
  },
  {
    id: "contact",
    title: "12. Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

Clickeros AI, Inc.
Email: privacy@clickeros.ai
Data Protection Officer: dpo@clickeros.ai

For EU/UK users, you also have the right to lodge a complaint with your local data protection authority.`,
  },
];

function Section({ section }: { section: typeof SECTIONS[0] }) {
  const colors = useColors();
  const r = useResponsive();
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: colors.foreground, fontSize: r.fontSize.md, fontWeight: "700", marginBottom: 10 }}>
        {section.title}
      </Text>
      <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, lineHeight: 22 }}>
        {section.content}
      </Text>
    </View>
  );
}

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ backgroundColor: "#0F172A", paddingHorizontal: r.px, paddingTop: 16, paddingBottom: 28 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16, minHeight: 44 }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: r.fontSize.base }}>Back</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Text style={{ fontSize: 24 }}>🔐</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#FFFFFF", fontSize: r.fontSize["2xl"], fontWeight: "800" }}>
                Privacy Policy
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: r.fontSize.xs, marginTop: 2 }}>
                Clickeros AI, Inc. · Last updated May 15, 2026
              </Text>
            </View>
          </View>

          <View style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 14, marginTop: 16 }}>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: r.fontSize.sm, lineHeight: 20, fontWeight: "600" }}>
              The short version:
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: r.fontSize.xs, lineHeight: 18, marginTop: 4 }}>
              We collect only what we need to run the Service. We never sell your data. You can delete your data at any time. We use industry-standard encryption to keep your data safe.
            </Text>
          </View>
        </View>

        {/* Table of Contents */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20, marginBottom: 8 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "700", marginBottom: 10 }}>
            Table of Contents
          </Text>
          <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border }}>
            {SECTIONS.map((section, idx) => (
              <Text key={section.id} style={{ color: "#7C3AED", fontSize: r.fontSize.sm, lineHeight: 24 }}>
                {section.title}
              </Text>
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          {SECTIONS.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </View>

        {/* Footer */}
        <View style={{ paddingHorizontal: r.px, marginTop: 8 }}>
          <View style={{ backgroundColor: "#7C3AED10", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#7C3AED30" }}>
            <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "700", marginBottom: 8 }}>
              Data Deletion Request
            </Text>
            <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, lineHeight: 18, marginBottom: 10 }}>
              To request deletion of all your data, email us with subject "Data Deletion Request". We will process your request within 30 days.
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: "#7C3AED", borderRadius: 10, height: 44, alignItems: "center", justifyContent: "center" }}
              onPress={() => Linking.openURL("mailto:privacy@clickeros.ai?subject=Data%20Deletion%20Request")}
              activeOpacity={0.8}
            >
              <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.sm, fontWeight: "600" }}>
                Request Data Deletion
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Links */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20, flexDirection: "row", justifyContent: "center", gap: 20 }}>
          <TouchableOpacity onPress={() => router.push("/permission-disclosures" as any)} activeOpacity={0.7} style={{ minHeight: 44, justifyContent: "center" }}>
            <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Permissions</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.border, fontSize: r.fontSize.sm, lineHeight: 44 }}>|</Text>
          <TouchableOpacity onPress={() => router.push("/terms-of-service" as any)} activeOpacity={0.7} style={{ minHeight: 44, justifyContent: "center" }}>
            <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
