import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const OVERVIEW = [
  { label: "Permission Type", value: "Dangerous — requires explicit user grant" },
  { label: "Required?", value: "Optional — app works without it" },
  { label: "When Used", value: "Only when you tap Capture Photo/Video in AI Ads Creator or Creative Studio" },
  { label: "Background Access", value: "Never — camera only accessed during active capture sessions you initiate" },
];

const USE_CASES = [
  { feature: "AI Ads Creator", use: "Capture product photos for ad creative assets" },
  { feature: "AI Video Generator", use: "Record product demo videos for AI-generated video ads" },
  { feature: "Creative Studio", use: "Capture images for ad templates" },
  { feature: "QR Code Scanner", use: "Scan QR codes to link ad platform accounts (no data stored)" },
];

export default function CameraPermissionScreen() {
  const router = useRouter();
  const colors = useColors();
  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ backgroundColor: "#4C1D95", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }} onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 22 }}>📷</Text>
            </View>
            <View>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800" }}>CAMERA Permission</Text>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 }}>android.permission.CAMERA</Text>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {OVERVIEW.map((row) => (
            <View key={row.label} style={{ flexDirection: "row", gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600", width: 120 }}>{row.label}</Text>
              <Text style={{ color: colors.muted, fontSize: 13, flex: 1, lineHeight: 20 }}>{row.value}</Text>
            </View>
          ))}
          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", marginTop: 20, marginBottom: 12 }}>What We Use It For</Text>
          {USE_CASES.map((item) => (
            <View key={item.feature} style={{ backgroundColor: colors.surface, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600" }}>{item.feature}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 3 }}>{item.use}</Text>
            </View>
          ))}
          <View style={{ backgroundColor: "#F0FDF4", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#BBF7D0", marginTop: 8, marginBottom: 20 }}>
            <Text style={{ color: "#166534", fontSize: 13, lineHeight: 20 }}>
              <Text style={{ fontWeight: "700" }}>Data Handling: </Text>
              Images are encrypted in transit (TLS 1.3) and at rest (AES-256). Never sold or shared with third parties.
            </Text>
          </View>
          <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700", marginBottom: 8 }}>How to Revoke</Text>
          <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 21, marginBottom: 20 }}>
            <Text style={{ fontWeight: "600" }}>Android: </Text>Settings {"\u2192"} Apps {"\u2192"} Clickeros AI {"\u2192"} Permissions {"\u2192"} Camera {"\u2192"} Deny{"\n"}
            <Text style={{ fontWeight: "600" }}>iOS: </Text>Settings {"\u2192"} Clickeros AI {"\u2192"} Camera {"\u2192"} Toggle off
          </Text>
          <TouchableOpacity style={{ backgroundColor: "#7C3AED", borderRadius: 12, padding: 14, alignItems: "center" }} onPress={() => router.push("/legal" as any)} activeOpacity={0.8}>
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>View All Legal Documents</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
