import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function RecordAudioPermissionScreen() {
  const router = useRouter();
  const colors = useColors();
  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ backgroundColor: "#831843", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }} onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 22 }}>🎙️</Text>
            </View>
            <View>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800" }}>RECORD_AUDIO Permission</Text>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 }}>android.permission.RECORD_AUDIO</Text>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {[
            { label: "Permission Type", value: "Dangerous — requires explicit user grant" },
            { label: "Required?", value: "Optional — app works without it" },
            { label: "When Used", value: "Only when you tap the microphone icon to use voice dictation or voice-to-text features" },
            { label: "Background Access", value: "Never — microphone only active during explicit recording sessions you start" },
          ].map((row, idx) => (
            <View key={row.label} style={{ flexDirection: "row", gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600", width: 120 }}>{row.label}</Text>
              <Text style={{ color: colors.muted, fontSize: 13, flex: 1, lineHeight: 20 }}>{row.value}</Text>
            </View>
          ))}
          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", marginTop: 20, marginBottom: 12 }}>What We Use It For</Text>
          {[
            ["AI Strategy Copilot", "Dictate campaign briefs and marketing goals by voice"],
            ["AI Ads Creator", "Describe your product by voice to generate ad copy"],
            ["AI Video Generator", "Record voice narration for AI-generated video ads"],
          ].map(([feature, use]) => (
            <View key={feature} style={{ backgroundColor: colors.surface, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600" }}>{feature}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 3 }}>{use}</Text>
            </View>
          ))}
          <View style={{ backgroundColor: "#F0FDF4", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#BBF7D0", marginTop: 8, marginBottom: 20 }}>
            <Text style={{ color: "#166534", fontSize: 13, lineHeight: 20 }}>
              <Text style={{ fontWeight: "700" }}>Data Handling: </Text>
              Raw audio deleted within 24 hours of transcription. Transcribed text stored as campaign history. Never sold or shared with third parties.
            </Text>
          </View>
          <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700", marginBottom: 8 }}>How to Revoke</Text>
          <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 21, marginBottom: 20 }}>
            Android: Go to Settings, then Apps, then Clickeros AI, then Permissions, then Microphone, then Deny.{"\n"}
            iOS: Go to Settings, then Clickeros AI, then Microphone, then toggle off.
          </Text>
          <TouchableOpacity style={{ backgroundColor: "#7C3AED", borderRadius: 12, padding: 14, alignItems: "center" }} onPress={() => router.push("/legal" as any)} activeOpacity={0.8}>
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>View All Legal Documents</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
