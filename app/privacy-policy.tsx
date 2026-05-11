import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const LAST_UPDATED = "May 11, 2026";
const COMPANY_NAME = "Clickeros AI";
const CONTACT_EMAIL = "privacy@clickeros.ai";
const WEBSITE = "https://clickeros.ai";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  accent?: string;
}

function Section({ title, children, accent = "#7C3AED" }: SectionProps) {
  const colors = useColors();
  return (
    <View style={{ marginBottom: 24 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <View style={{ width: 4, height: 20, borderRadius: 2, backgroundColor: accent }} />
        <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700" }}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function Paragraph({ text }: { text: string }) {
  const colors = useColors();
  return (
    <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 8 }}>
      {text}
    </Text>
  );
}

function PermissionCard({
  permission,
  icon,
  purpose,
  dataCollected,
  sharedWith,
  color,
}: {
  permission: string;
  icon: string;
  purpose: string;
  dataCollected: string;
  sharedWith: string;
  color: string;
}) {
  const colors = useColors();
  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderLeftWidth: 3,
        borderLeftColor: color,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: `${color}15`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>
            {permission}
          </Text>
          <View
            style={{
              backgroundColor: `${color}15`,
              borderRadius: 4,
              paddingHorizontal: 6,
              paddingVertical: 2,
              alignSelf: "flex-start",
              marginTop: 2,
            }}
          >
            <Text style={{ color, fontSize: 10, fontWeight: "600" }}>Android Permission</Text>
          </View>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "600", width: 100 }}>
            Purpose:
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12, flex: 1, lineHeight: 18 }}>
            {purpose}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "600", width: 100 }}>
            Data Collected:
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12, flex: 1, lineHeight: 18 }}>
            {dataCollected}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "600", width: 100 }}>
            Shared With:
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12, flex: 1, lineHeight: 18 }}>
            {sharedWith}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: "#7C3AED",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 24,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol name="lock.fill" size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "800" }}>
                Privacy Policy
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                {COMPANY_NAME} · Last updated {LAST_UPDATED}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: 12,
              marginTop: 4,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 13, lineHeight: 20 }}>
              This Privacy Policy explains how Clickeros AI collects, uses, and protects your
              personal information when you use our mobile application. We are committed to
              transparency and your privacy.
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>

          {/* 1. Introduction */}
          <Section title="1. Introduction">
            <Paragraph
              text={`${COMPANY_NAME} ("we," "our," or "us") operates the Clickeros AI mobile application (the "App"). This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our App and the choices you have associated with that data.`}
            />
            <Paragraph
              text={`By using the App, you agree to the collection and use of information in accordance with this policy. This policy applies to all users of the App on Android and iOS platforms.`}
            />
          </Section>

          {/* 2. App Permissions */}
          <Section title="2. App Permissions & Data Use" accent="#0EA5E9">
            <Paragraph
              text="The Clickeros AI app requests the following device permissions to provide its core features. Each permission is used only for the stated purpose and is never used to collect data beyond what is described below."
            />

            <PermissionCard
              permission="CAMERA"
              icon="📷"
              color="#7C3AED"
              purpose="The Camera permission allows you to capture photos and videos directly within the app to create ad creatives, upload product images for AI ad generation, and scan QR codes for account linking or integrations."
              dataCollected="Images and videos you explicitly capture and choose to upload. We do not access your camera in the background, and no images are captured without your direct action."
              sharedWith="Images you upload for ad creation are processed by our AI servers to generate ad copy and creative suggestions. They are not sold or shared with third parties for advertising purposes."
            />

            <PermissionCard
              permission="RECORD_AUDIO"
              icon="🎙️"
              color="#EC4899"
              purpose="The Record Audio permission enables voice-to-text input for the AI Strategy Copilot, allowing you to dictate campaign briefs, describe your product, or give voice commands instead of typing. It is also used for AI video script narration features."
              dataCollected="Audio is captured only when you actively initiate a voice recording session. Audio data is processed in real-time for transcription and is not stored permanently on our servers after processing."
              sharedWith="Audio is transmitted to our secure AI transcription service for real-time processing only. Transcribed text may be stored as part of your campaign history. Raw audio is not retained or shared with third parties."
            />

            <PermissionCard
              permission="READ_PHONE_STATE"
              icon="📱"
              color="#F59E0B"
              purpose="The Read Phone State permission is used to detect active calls so the app can pause audio playback and notifications during phone calls, providing a seamless user experience. It is also used for device identification to maintain secure login sessions across app restarts."
              dataCollected="We read the device's call state (idle, ringing, or in-call) to manage app behavior. We may collect a non-reversible device identifier for session security and fraud prevention. We do not access your phone number, IMEI, or call logs."
              sharedWith="Device state information is used internally for session management only. It is not shared with third parties, advertisers, or data brokers."
            />

            <PermissionCard
              permission="GET_ACCOUNTS"
              icon="👤"
              color="#22C55E"
              purpose="The Get Accounts permission is used to facilitate single sign-on (SSO) with Google and other account providers, allowing you to log in quickly without creating a separate password. It enables the app to pre-fill your email address in account forms."
              dataCollected="We access the list of accounts registered on your device solely to present sign-in options (e.g., 'Sign in with Google'). We only access the account you explicitly select and authorize. We do not read passwords or access account data beyond the email address and display name you consent to share."
              sharedWith="Account information is used only for authentication. Your email address is stored in our secure database to identify your account. It is not sold or shared with third parties for marketing purposes."
            />
          </Section>

          {/* 3. Information We Collect */}
          <Section title="3. Information We Collect" accent="#22C55E">
            <Paragraph text="We collect the following categories of information to provide and improve our services:" />

            {[
              {
                category: "Account Information",
                detail:
                  "Name, email address, and profile photo when you register or sign in with a third-party provider (Google, Apple).",
              },
              {
                category: "Campaign Data",
                detail:
                  "Ad copy, campaign settings, targeting parameters, budget information, and performance metrics you create or import within the app.",
              },
              {
                category: "Usage Data",
                detail:
                  "Information about how you interact with the app, including features used, screens visited, and actions taken. This helps us improve the product.",
              },
              {
                category: "Device Information",
                detail:
                  "Device type, operating system version, app version, and a non-reversible device identifier for security and analytics purposes.",
              },
              {
                category: "Analytics Data",
                detail:
                  "Aggregated, anonymized usage statistics to understand feature adoption and improve the user experience.",
              },
            ].map((item) => (
              <View
                key={item.category}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{ color: colors.foreground, fontSize: 13, fontWeight: "700", marginBottom: 4 }}
                >
                  {item.category}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 18 }}>
                  {item.detail}
                </Text>
              </View>
            ))}
          </Section>

          {/* 4. How We Use Your Information */}
          <Section title="4. How We Use Your Information" accent="#0EA5E9">
            <Paragraph text="We use the information we collect for the following purposes:" />
            {[
              "To provide, operate, and maintain the Clickeros AI platform and all its features.",
              "To process and generate AI-powered ad copy, SEO insights, and marketing recommendations.",
              "To authenticate your identity and maintain secure login sessions.",
              "To send transactional notifications about your campaigns, billing, and account activity.",
              "To analyze usage patterns and improve the app's features and performance.",
              "To comply with legal obligations and enforce our Terms of Service.",
              "To detect, prevent, and address fraud, security breaches, and technical issues.",
            ].map((item, idx) => (
              <View
                key={idx}
                style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 8 }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "#0EA5E915",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 1,
                  }}
                >
                  <Text style={{ color: "#0EA5E9", fontSize: 11, fontWeight: "700" }}>
                    {idx + 1}
                  </Text>
                </View>
                <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 20, flex: 1 }}>
                  {item}
                </Text>
              </View>
            ))}
          </Section>

          {/* 5. Data Retention */}
          <Section title="5. Data Retention" accent="#F59E0B">
            <Paragraph
              text="We retain your personal data for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time by contacting us at privacy@clickeros.ai."
            />
            <Paragraph
              text="Campaign data and analytics are retained for up to 24 months to provide historical reporting. Audio recordings are deleted from our servers within 24 hours of transcription. Device identifiers used for session security are cleared when you log out."
            />
          </Section>

          {/* 6. Data Security */}
          <Section title="6. Data Security" accent="#22C55E">
            <Paragraph
              text="We implement industry-standard security measures to protect your personal information, including TLS/SSL encryption for all data in transit, AES-256 encryption for data at rest, regular security audits and penetration testing, and strict access controls limiting employee access to personal data."
            />
            <Paragraph
              text="While we strive to use commercially acceptable means to protect your personal data, no method of transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee absolute security."
            />
          </Section>

          {/* 7. Third-Party Services */}
          <Section title="7. Third-Party Services" accent="#EC4899">
            <Paragraph
              text="The app integrates with the following third-party services that have their own privacy policies. We encourage you to review their policies:"
            />
            {[
              { name: "Google Sign-In", purpose: "Authentication", url: "policies.google.com" },
              { name: "Facebook Ads API", purpose: "Campaign management", url: "facebook.com/privacy" },
              { name: "Google Ads API", purpose: "Campaign management", url: "policies.google.com" },
              { name: "TikTok Ads API", purpose: "Campaign management", url: "tiktok.com/legal/privacy-policy" },
              { name: "Plausible Analytics", purpose: "Anonymous usage analytics", url: "plausible.io/privacy" },
            ].map((service) => (
              <View
                key={service.name}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View>
                  <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600" }}>
                    {service.name}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>{service.purpose}</Text>
                </View>
                <Text style={{ color: "#7C3AED", fontSize: 12 }}>{service.url}</Text>
              </View>
            ))}
          </Section>

          {/* 8. Children's Privacy */}
          <Section title="8. Children's Privacy" accent="#F59E0B">
            <Paragraph
              text="The Clickeros AI app is not directed to children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us immediately at privacy@clickeros.ai so that we can take the necessary actions."
            />
          </Section>

          {/* 9. Your Rights */}
          <Section title="9. Your Privacy Rights" accent="#0EA5E9">
            <Paragraph text="Depending on your location, you may have the following rights regarding your personal data:" />
            {[
              { right: "Access", desc: "Request a copy of the personal data we hold about you." },
              { right: "Correction", desc: "Request correction of inaccurate or incomplete data." },
              { right: "Deletion", desc: "Request deletion of your personal data ('right to be forgotten')." },
              { right: "Portability", desc: "Request a machine-readable export of your data." },
              { right: "Opt-Out", desc: "Opt out of non-essential data processing and marketing communications." },
              { right: "Withdraw Consent", desc: "Withdraw consent for permissions at any time via your device settings." },
            ].map((item) => (
              <View
                key={item.right}
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginBottom: 8,
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#0EA5E915",
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    alignSelf: "flex-start",
                    minWidth: 80,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#0EA5E9", fontSize: 11, fontWeight: "700" }}>
                    {item.right}
                  </Text>
                </View>
                <Text style={{ color: colors.muted, fontSize: 13, flex: 1, lineHeight: 18 }}>
                  {item.desc}
                </Text>
              </View>
            ))}
            <Paragraph
              text={`To exercise any of these rights, please contact us at ${CONTACT_EMAIL}. We will respond to your request within 30 days.`}
            />
          </Section>

          {/* 10. Changes */}
          <Section title="10. Changes to This Policy" accent="#64748B">
            <Paragraph
              text="We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date. For significant changes, we will provide a prominent in-app notification."
            />
            <Paragraph
              text="You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted."
            />
          </Section>

          {/* 11. Contact */}
          <Section title="11. Contact Us" accent="#7C3AED">
            <Paragraph
              text={`If you have any questions about this Privacy Policy or our data practices, please contact us:`}
            />
            <View
              style={{
                backgroundColor: "#7C3AED10",
                borderRadius: 14,
                padding: 16,
                borderWidth: 1,
                borderColor: "#7C3AED30",
                gap: 10,
              }}
            >
              {[
                { label: "Company", value: COMPANY_NAME },
                { label: "Email", value: CONTACT_EMAIL },
                { label: "Website", value: WEBSITE },
                { label: "Data Controller", value: "Clickeros AI, Inc." },
              ].map((item) => (
                <View key={item.label} style={{ flexDirection: "row", gap: 8 }}>
                  <Text
                    style={{ color: "#7C3AED", fontSize: 13, fontWeight: "700", width: 110 }}
                  >
                    {item.label}:
                  </Text>
                  <Text style={{ color: colors.foreground, fontSize: 13, flex: 1 }}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </Section>

          {/* Footer */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center", lineHeight: 18 }}>
              © 2026 Clickeros AI, Inc. All rights reserved.{"\n"}
              This Privacy Policy is effective as of {LAST_UPDATED}.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
