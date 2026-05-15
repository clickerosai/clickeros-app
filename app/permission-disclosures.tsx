import { ScrollView, Text, View, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState } from "react";

const PERMISSIONS = [
  {
    id: "camera",
    name: "CAMERA",
    android: "android.permission.CAMERA",
    ios: "NSCameraUsageDescription",
    icon: "📷",
    color: "#7C3AED",
    required: false,
    summary: "Access your camera to capture photos and videos for ad creatives",
    whenUsed: "Only when you tap the camera icon inside AI Ads Creator, Creative Studio, or QR Code Scanner. Never accessed in the background.",
    dataCollected: "Photos and videos you explicitly capture during an active session.",
    dataRetention: "Stored only for the duration of your creative session. Deleted from device memory immediately after upload or when you close the feature.",
    dataSharing: "Never shared with third parties. Only processed by Clickeros AI servers to generate your ad creative.",
    howToRevoke: [
      "Android: Settings → Apps → Clickeros AI → Permissions → Camera → Deny",
      "iOS: Settings → Clickeros AI → Camera → Toggle Off",
    ],
    impact: "Without this permission, you cannot capture new photos or videos for ad creatives. You can still upload existing media from your gallery.",
  },
  {
    id: "record-audio",
    name: "RECORD_AUDIO",
    android: "android.permission.RECORD_AUDIO",
    ios: "NSMicrophoneUsageDescription",
    icon: "🎙️",
    color: "#EC4899",
    required: false,
    summary: "Access your microphone for voice dictation and AI video narration",
    whenUsed: "Only when you tap the microphone icon to use voice-to-text in the AI Strategy Copilot or record voice narration for AI Video Generator. Never accessed in the background.",
    dataCollected: "Voice audio recorded during active dictation sessions you initiate.",
    dataRetention: "Raw audio is transcribed immediately and deleted within 24 hours. The transcribed text is stored as part of your campaign history.",
    dataSharing: "Audio is processed by our AI transcription service. Raw audio is never sold or shared with advertisers or third parties.",
    howToRevoke: [
      "Android: Settings → Apps → Clickeros AI → Permissions → Microphone → Deny",
      "iOS: Settings → Clickeros AI → Microphone → Toggle Off",
    ],
    impact: "Without this permission, voice dictation and voice narration features are unavailable. All other features work normally.",
  },
  {
    id: "phone-state",
    name: "READ_PHONE_STATE",
    android: "android.permission.READ_PHONE_STATE",
    ios: "Not required on iOS",
    icon: "📱",
    color: "#0EA5E9",
    required: true,
    summary: "Read a non-reversible device identifier for session security and fraud prevention",
    whenUsed: "Automatically at app startup to generate a secure session identifier. This is a one-time read used to establish your session.",
    dataCollected: "A non-reversible cryptographic hash of your device ID. This hash cannot be used to identify you personally or reconstruct your device ID.",
    dataRetention: "The device hash is stored for the duration of your active session and deleted when you log out.",
    dataSharing: "Never shared with third parties. Used only internally for session security and fraud prevention.",
    howToRevoke: [
      "Android: Settings → Apps → Clickeros AI → Permissions → Phone → Deny",
      "Note: Denying this permission may affect session stability on some Android devices.",
    ],
    impact: "This permission is used for security purposes. Denying it may result in more frequent session timeouts on some Android versions.",
  },
  {
    id: "accounts",
    name: "GET_ACCOUNTS",
    android: "android.permission.GET_ACCOUNTS",
    ios: "Not required on iOS (uses Sign in with Apple / Google SDK)",
    icon: "👤",
    color: "#22C55E",
    required: false,
    summary: "Read your device account list to enable Google Sign-In",
    whenUsed: "Only when you tap 'Continue with Google' on the Sign In screen. Used to display your Google accounts so you can select one to sign in with.",
    dataCollected: "The email address and display name of the Google account you explicitly select. No other account data is accessed.",
    dataRetention: "Your email and name are stored as part of your Clickeros AI profile for as long as your account is active.",
    dataSharing: "Your email is used for account management and transactional notifications only. Never sold or shared for marketing purposes.",
    howToRevoke: [
      "Android: Settings → Apps → Clickeros AI → Permissions → Accounts → Deny",
      "iOS: This permission is not required. Google Sign-In on iOS uses a separate secure SDK.",
      "You can also revoke Google account access at: myaccount.google.com/permissions",
    ],
    impact: "Without this permission, Google Sign-In is unavailable on Android. You can still sign in using other available methods.",
  },
];

function PermissionCard({ perm, isExpanded, onToggle }: {
  perm: typeof PERMISSIONS[0];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const colors = useColors();
  const r = useResponsive();

  return (
    <View style={{
      backgroundColor: colors.background,
      borderRadius: 16, borderWidth: 1,
      borderColor: isExpanded ? `${perm.color}40` : colors.border,
      overflow: "hidden", marginBottom: 12,
    }}>
      {/* Header — always visible */}
      <TouchableOpacity
        style={{ padding: r.isXs ? 14 : 16, flexDirection: "row", alignItems: "center", gap: 12 }}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={{
          width: 44, height: 44, borderRadius: 12,
          backgroundColor: `${perm.color}15`,
          alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Text style={{ fontSize: 22 }}>{perm.icon}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "700" }}>
              {perm.name}
            </Text>
            <View style={{
              backgroundColor: perm.required ? "#FEF9C3" : "#DCFCE7",
              borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
            }}>
              <Text style={{
                color: perm.required ? "#D97706" : "#16A34A",
                fontSize: 9, fontWeight: "700",
              }}>
                {perm.required ? "REQUIRED" : "OPTIONAL"}
              </Text>
            </View>
          </View>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, lineHeight: 16 }} numberOfLines={2}>
            {perm.summary}
          </Text>
        </View>
        <IconSymbol
          name={isExpanded ? "minus" : "plus"}
          size={18}
          color={perm.color}
          style={{ flexShrink: 0 }}
        />
      </TouchableOpacity>

      {/* Expanded Details */}
      {isExpanded && (
        <View style={{ borderTopWidth: 1, borderTopColor: colors.border, padding: r.isXs ? 14 : 16, gap: 16 }}>
          {/* Technical names */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 10, padding: 12 }}>
            <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
              Technical Identifier
            </Text>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.xs, fontFamily: "monospace" }}>
              Android: {perm.android}
            </Text>
            <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }}>
              iOS: {perm.ios}
            </Text>
          </View>

          {/* When used */}
          <View>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "700", marginBottom: 6 }}>
              When Is It Used?
            </Text>
            <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, lineHeight: 20 }}>
              {perm.whenUsed}
            </Text>
          </View>

          {/* Data collected */}
          <View>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "700", marginBottom: 6 }}>
              What Data Is Collected?
            </Text>
            <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, lineHeight: 20 }}>
              {perm.dataCollected}
            </Text>
          </View>

          {/* Retention */}
          <View>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "700", marginBottom: 6 }}>
              How Long Is Data Kept?
            </Text>
            <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, lineHeight: 20 }}>
              {perm.dataRetention}
            </Text>
          </View>

          {/* Sharing */}
          <View style={{ backgroundColor: "#F0FDF4", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#BBF7D0" }}>
            <Text style={{ color: "#166534", fontSize: r.fontSize.sm, fontWeight: "700", marginBottom: 4 }}>
              🔒 Data Sharing
            </Text>
            <Text style={{ color: "#166534", fontSize: r.fontSize.sm, lineHeight: 20 }}>
              {perm.dataSharing}
            </Text>
          </View>

          {/* How to revoke */}
          <View>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.sm, fontWeight: "700", marginBottom: 8 }}>
              How to Revoke This Permission
            </Text>
            {perm.howToRevoke.map((step, idx) => (
              <View key={idx} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
                <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: `${perm.color}15`, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <Text style={{ color: perm.color, fontSize: 10, fontWeight: "700" }}>{idx + 1}</Text>
                </View>
                <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, lineHeight: 18, flex: 1 }}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Impact */}
          <View style={{ backgroundColor: "#FEF9C3", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#FDE68A" }}>
            <Text style={{ color: "#92400E", fontSize: r.fontSize.sm, fontWeight: "700", marginBottom: 4 }}>
              ⚠️ Impact if Denied
            </Text>
            <Text style={{ color: "#78350F", fontSize: r.fontSize.sm, lineHeight: 20 }}>
              {perm.impact}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default function PermissionDisclosuresScreen() {
  const router = useRouter();
  const colors = useColors();
  const r = useResponsive();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ backgroundColor: "#1E1B4B", paddingHorizontal: r.px, paddingTop: 16, paddingBottom: 28 }}>
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
              <IconSymbol name="lock.fill" size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#FFFFFF", fontSize: r.fontSize["2xl"], fontWeight: "800" }}>
                Permission Disclosures
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: r.fontSize.xs, marginTop: 2 }}>
                Clickeros AI · Last updated May 15, 2026
              </Text>
            </View>
          </View>

          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: r.fontSize.sm, lineHeight: 20, marginTop: 14 }}>
            Clickeros AI requests the following device permissions. We only ask for permissions we need, and we never access them without your explicit action.
          </Text>
        </View>

        {/* Summary Table */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20, marginBottom: 8 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 12 }}>
            Permission Summary
          </Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
            {/* Table Header */}
            <View style={{ flexDirection: "row", backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ color: colors.foreground, fontSize: r.fontSize.xs, fontWeight: "700", flex: 2, textTransform: "uppercase" }}>Permission</Text>
              <Text style={{ color: colors.foreground, fontSize: r.fontSize.xs, fontWeight: "700", width: 70, textTransform: "uppercase" }}>Required</Text>
              <Text style={{ color: colors.foreground, fontSize: r.fontSize.xs, fontWeight: "700", width: 60, textTransform: "uppercase" }}>Shared</Text>
            </View>
            {PERMISSIONS.map((perm, idx) => (
              <View key={perm.id} style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: colors.border }}>
                <View style={{ flex: 2, flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 14 }}>{perm.icon}</Text>
                  <Text style={{ color: colors.foreground, fontSize: r.fontSize.xs, fontWeight: "600" }}>{perm.name}</Text>
                </View>
                <View style={{ width: 70 }}>
                  <View style={{ backgroundColor: perm.required ? "#FEF9C3" : "#DCFCE7", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: "flex-start" }}>
                    <Text style={{ color: perm.required ? "#D97706" : "#16A34A", fontSize: 9, fontWeight: "700" }}>
                      {perm.required ? "Required" : "Optional"}
                    </Text>
                  </View>
                </View>
                <View style={{ width: 60 }}>
                  <View style={{ backgroundColor: "#DCFCE7", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: "flex-start" }}>
                    <Text style={{ color: "#16A34A", fontSize: 9, fontWeight: "700" }}>Never</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Permission Cards */}
        <View style={{ paddingHorizontal: r.px, marginTop: 16 }}>
          <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 12 }}>
            Detailed Disclosures
          </Text>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, lineHeight: 20, marginBottom: 16 }}>
            Tap any permission below to see exactly when it is used, what data is collected, how long it is retained, and how to revoke it at any time.
          </Text>
          {PERMISSIONS.map((perm) => (
            <PermissionCard
              key={perm.id}
              perm={perm}
              isExpanded={expandedId === perm.id}
              onToggle={() => toggleExpand(perm.id)}
            />
          ))}
        </View>

        {/* Your Rights */}
        <View style={{ marginHorizontal: r.px, marginTop: 8, backgroundColor: "#EDE9FE", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#7C3AED30" }}>
          <Text style={{ color: "#7C3AED", fontSize: r.fontSize.base, fontWeight: "700", marginBottom: 10 }}>
            Your Rights
          </Text>
          {[
            "You can revoke any permission at any time in your device settings.",
            "You can request deletion of all your data by emailing privacy@clickeros.ai.",
            "You can request a copy of all data we hold about you.",
            "EU/UK users have additional rights under GDPR including the right to object to processing.",
          ].map((right, idx) => (
            <View key={idx} style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
              <IconSymbol name="checkmark.circle.fill" size={14} color="#7C3AED" style={{ marginTop: 2, flexShrink: 0 }} />
              <Text style={{ color: "#4C1D95", fontSize: r.fontSize.sm, lineHeight: 20, flex: 1 }}>{right}</Text>
            </View>
          ))}
        </View>

        {/* Contact */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
          <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, textAlign: "center", lineHeight: 18 }}>
            Questions about permissions?{"\n"}
            <Text
              style={{ color: "#7C3AED", fontWeight: "600" }}
              onPress={() => Linking.openURL("mailto:privacy@clickeros.ai")}
            >
              privacy@clickeros.ai
            </Text>
          </Text>
        </View>

        {/* Navigation Links */}
        <View style={{ paddingHorizontal: r.px, marginTop: 20, flexDirection: "row", justifyContent: "center", gap: 20 }}>
          <TouchableOpacity onPress={() => router.push("/privacy-policy" as any)} activeOpacity={0.7} style={{ minHeight: 44, justifyContent: "center" }}>
            <Text style={{ color: "#7C3AED", fontSize: r.fontSize.sm, fontWeight: "600" }}>Privacy Policy</Text>
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
