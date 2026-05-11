import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function GetAccountsPermissionScreen() {
  const router = useRouter();
  const colors = useColors();
  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ backgroundColor: "#14532D", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }} onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 22 }}>👤</Text>
            </View>
            <View>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800" }}>GET_ACCOUNTS Permission</Text>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 }}>android.permission.GET_ACCOUNTS</Text>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {[
            { label: "Permission Type", value: "Normal on Android 8.0+ (auto-granted); Dangerous on older versions" },
            { label: "Required?", value: "Optional — only needed if you choose to sign in with Google" },
            { label: "When Used", value: "Only when you tap Sign in with Google on the login screen" },
            { label: "Background Access", value: "Never — account list only read during the sign-in flow you initiate" },
          ].map((row, idx) => (
            <View key={row.label} style={{ flexDirection: "row", gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600", width: 120 }}>{row.label}</Text>
              <Text style={{ color: colors.muted, fontSize: 13, flex: 1, lineHeight: 20 }}>{row.value}</Text>
            </View>
          ))}
          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", marginTop: 20, marginBottom: 12 }}>What We Use It For</Text>
          {[
            ["Google Sign-In", "Read account list so you can select one to sign in with"],
            ["Email Pre-fill", "Pre-fill your email in account forms with your selected account"],
            ["Session Maintenance", "Maintain your login session across app restarts"],
          ].map(([feature, use]) => (
            <View key={feature} style={{ backgroundColor: colors.surface, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600" }}>{feature}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 3 }}>{use}</Text>
            </View>
          ))}
          <View style={{ backgroundColor: "#F0FDF4", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#BBF7D0", marginTop: 8, marginBottom: 20 }}>
            <Text style={{ color: "#166534", fontSize: 13, lineHeight: 20 }}>
              <Text style={{ fontWeight: "700" }}>Data Handling: </Text>
              Only email and display name of the account you explicitly select. Encrypted in transit (TLS 1.3) and at rest (AES-256). Never sold or shared for marketing.
            </Text>
          </View>
          <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700", marginBottom: 8 }}>How to Revoke</Text>
          <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 21, marginBottom: 20 }}>
            Android: Go to Settings, then Apps, then Clickeros AI, then Permissions, then Accounts, then Deny.{"\n"}
            iOS: This permission is not required on iOS. Google Sign-In uses a different mechanism.
          </Text>
          <TouchableOpacity style={{ backgroundColor: "#7C3AED", borderRadius: 12, padding: 14, alignItems: "center" }} onPress={() => router.push("/legal" as any)} activeOpacity={0.8}>
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>View All Legal Documents</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
