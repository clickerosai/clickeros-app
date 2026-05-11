import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

function Row({ label, value, badge, badgeColor }: { label: string; value: string; badge?: string; badgeColor?: string }) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 8 }}>
      <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600", flex: 1 }}>{label}</Text>
      <Text style={{ color: colors.muted, fontSize: 13, flex: 2 }}>{value}</Text>
      {badge && (
        <View style={{ backgroundColor: badgeColor === "red" ? "#FEE2E2" : badgeColor === "green" ? "#DCFCE7" : "#FEF3C7", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, alignSelf: "flex-start" }}>
          <Text style={{ color: badgeColor === "red" ? "#DC2626" : badgeColor === "green" ? "#16A34A" : "#D97706", fontSize: 10, fontWeight: "700" }}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

export default function CookiePolicyScreen() {
  const router = useRouter();
  const colors = useColors();
  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ backgroundColor: "#0F172A", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }} onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 22 }}>🍪</Text>
            </View>
            <View>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800" }}>Cookie Policy</Text>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 }}>Clickeros AI, Inc. · May 11, 2026</Text>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 20 }}>
            Cookies are small text files placed on your device when you visit our website or use our web-based features. Our mobile app uses equivalent technologies like AsyncStorage and device identifiers instead of traditional browser cookies.
          </Text>

          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", marginBottom: 12 }}>Cookie Categories</Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 20 }}>
            {[
              { label: "Strictly Necessary", value: "Login sessions, security, core features", badge: "Required", badgeColor: "red" },
              { label: "Functional", value: "Theme, language, UI preferences", badge: "Optional", badgeColor: "amber" },
              { label: "Analytics", value: "Anonymous usage stats via Plausible (cookieless)", badge: "Opt-out", badgeColor: "green" },
              { label: "Performance", value: "Error tracking, API latency monitoring", badge: "Optional", badgeColor: "amber" },
            ].map((row) => <Row key={row.label} {...row} />)}
          </View>

          <View style={{ backgroundColor: "#F0FDF4", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#BBF7D0", marginBottom: 20 }}>
            <Text style={{ color: "#166534", fontSize: 13, lineHeight: 20 }}>
              <Text style={{ fontWeight: "700" }}>No Advertising Cookies: </Text>
              We do not use cookies for behavioral advertising, retargeting, or cross-site tracking. We do not sell cookie data.
            </Text>
          </View>

          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", marginBottom: 12 }}>Mobile App Technologies</Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 20 }}>
            {[
              { label: "AsyncStorage", value: "Login session, preferences, app state — stored locally on your device" },
              { label: "Device Identifier", value: "Non-reversible hash for session security. Not linked to your identity." },
              { label: "Push Token", value: "Expo/FCM token for notifications. Deleted when notifications are disabled." },
            ].map((row) => <Row key={row.label} label={row.label} value={row.value} />)}
          </View>

          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", marginBottom: 10 }}>Your Controls</Text>
          <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 21, marginBottom: 8 }}>
            You can clear all locally stored app data by uninstalling the app or clearing app data in your device settings. To opt out of analytics, email <Text style={{ color: "#7C3AED" }}>privacy@clickeros.ai</Text>.
          </Text>
          <View style={{ backgroundColor: "#EFF6FF", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#BFDBFE", marginBottom: 20 }}>
            <Text style={{ color: "#1E40AF", fontSize: 13, lineHeight: 20 }}>
              <Text style={{ fontWeight: "700" }}>EU/UK Users: </Text>
              You have the right to withdraw consent for non-essential cookies at any time. Strictly necessary cookies do not require consent.
            </Text>
          </View>

          <TouchableOpacity style={{ backgroundColor: "#7C3AED", borderRadius: 12, padding: 14, alignItems: "center" }} onPress={() => router.push("/legal" as any)} activeOpacity={0.8}>
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>View All Legal Documents</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
