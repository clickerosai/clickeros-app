import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const DATA_ROWS = [
  { type: "Name", collected: true, shared: false, purpose: "Account management", optional: false },
  { type: "Email Address", collected: true, shared: false, purpose: "Authentication, notifications", optional: false },
  { type: "Photos / Videos", collected: true, shared: false, purpose: "Ad creative generation", optional: true },
  { type: "Voice / Audio", collected: true, shared: false, purpose: "AI voice dictation", optional: true },
  { type: "Device ID", collected: true, shared: false, purpose: "Security & fraud prevention", optional: false },
  { type: "Phone Number", collected: false, shared: false, purpose: "Not collected", optional: true },
  { type: "Precise Location", collected: false, shared: false, purpose: "Not collected", optional: true },
  { type: "App Activity", collected: true, shared: false, purpose: "Product improvement (anonymized)", optional: false },
  { type: "Payment Info", collected: false, shared: false, purpose: "Processed by Google Play / Stripe only", optional: true },
];

const PERM_ROWS = [
  { perm: "CAMERA", dataType: "Photos & Videos", purpose: "Ad creative generation", required: "Optional", encrypted: true },
  { perm: "RECORD_AUDIO", dataType: "Voice Recordings", purpose: "AI voice dictation", required: "Optional", encrypted: true },
  { perm: "READ_PHONE_STATE", dataType: "Device ID", purpose: "Session security", required: "Required", encrypted: true },
  { perm: "GET_ACCOUNTS", dataType: "Email Address", purpose: "Google Sign-In", required: "Optional", encrypted: true },
  { perm: "POST_NOTIFICATIONS", dataType: "None", purpose: "Campaign alerts", required: "Optional", encrypted: false },
];

function Badge({ yes, text }: { yes: boolean; text?: string }) {
  return (
    <View style={{ backgroundColor: yes ? "#DCFCE7" : "#FEE2E2", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, alignSelf: "flex-start" }}>
      <Text style={{ color: yes ? "#16A34A" : "#DC2626", fontSize: 10, fontWeight: "700" }}>
        {text || (yes ? "Yes" : "No")}
      </Text>
    </View>
  );
}

export default function DataSafetyScreen() {
  const router = useRouter();
  const colors = useColors();
  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ backgroundColor: "#064E3B", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }} onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 22 }}>🛡️</Text>
            </View>
            <View>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800" }}>Data Safety</Text>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 }}>Google Play Console Data Safety Information</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={{ backgroundColor: "#FFFBEB", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#FDE68A", marginBottom: 20 }}>
            <Text style={{ color: "#92400E", fontSize: 13, lineHeight: 20 }}>
              <Text style={{ fontWeight: "700" }}>Google Play Data Safety Form: </Text>
              This page provides the information needed to complete the Data Safety section in Google Play Console under App content → Data safety.
            </Text>
          </View>

          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", marginBottom: 12 }}>Data Collected</Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: 20 }}>
            <View style={{ flexDirection: "row", backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: "700", flex: 2, textTransform: "uppercase" }}>Data Type</Text>
              <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: "700", width: 60, textTransform: "uppercase" }}>Collected</Text>
              <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: "700", width: 55, textTransform: "uppercase" }}>Shared</Text>
            </View>
            {DATA_ROWS.map((row, idx) => (
              <View key={row.type} style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: colors.border }}>
                <View style={{ flex: 2 }}>
                  <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "600" }}>{row.type}</Text>
                  <Text style={{ color: colors.muted, fontSize: 11, marginTop: 1 }}>{row.purpose}</Text>
                </View>
                <View style={{ width: 60 }}><Badge yes={row.collected} /></View>
                <View style={{ width: 55 }}><Badge yes={row.shared} /></View>
              </View>
            ))}
          </View>

          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", marginBottom: 12 }}>Permission Declarations</Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: 20 }}>
            {PERM_ROWS.map((row, idx) => (
              <View key={row.perm} style={{ paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700" }}>{row.perm}</Text>
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    <Badge yes={row.required === "Optional"} text={row.required} />
                    {row.encrypted && <Badge yes={true} text="Encrypted" />}
                  </View>
                </View>
                <Text style={{ color: colors.muted, fontSize: 12 }}>{row.dataType} · {row.purpose}</Text>
              </View>
            ))}
          </View>

          <View style={{ backgroundColor: "#F0FDF4", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#BBF7D0", marginBottom: 20 }}>
            <Text style={{ color: "#166534", fontSize: 13, lineHeight: 20, fontWeight: "700", marginBottom: 4 }}>Security Practices</Text>
            <Text style={{ color: "#166534", fontSize: 13, lineHeight: 20 }}>
              ✓ Data encrypted in transit (TLS 1.3){"\n"}
              ✓ Data encrypted at rest (AES-256){"\n"}
              ✓ Users can request data deletion
            </Text>
          </View>

          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "700", marginBottom: 10 }}>Request Data Deletion</Text>
          <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 21, marginBottom: 16 }}>
            To request deletion of your data, email{" "}
            <Text style={{ color: "#7C3AED" }}>privacy@clickeros.ai</Text>
            {" "}with subject "Data Deletion Request". We will process your request within 30 days.
          </Text>

          <TouchableOpacity style={{ backgroundColor: "#7C3AED", borderRadius: 12, padding: 14, alignItems: "center" }} onPress={() => router.push("/legal" as any)} activeOpacity={0.8}>
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>View All Legal Documents</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
