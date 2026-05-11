import { ScrollView, Text, View, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const DOMAIN = "https://clickerosai-ay2ehjve.manus.space";

const LEGAL_SECTIONS = [
  {
    title: "Core Legal Documents",
    color: "#7C3AED",
    items: [
      {
        label: "Privacy Policy",
        desc: "How we collect, use, and protect your data",
        icon: "🔐",
        route: "/privacy-policy",
        url: `${DOMAIN}/privacy-policy`,
      },
      {
        label: "Terms of Service",
        desc: "The agreement governing your use of Clickeros AI",
        icon: "📋",
        route: "/terms-of-service",
        url: `${DOMAIN}/terms-of-service`,
      },
      {
        label: "Cookie Policy",
        desc: "How we use cookies and tracking technologies",
        icon: "🍪",
        route: "/cookie-policy",
        url: `${DOMAIN}/cookie-policy`,
      },
    ],
  },
  {
    title: "Data Safety & Transparency",
    color: "#22C55E",
    items: [
      {
        label: "Data Safety",
        desc: "Google Play Data Safety form information",
        icon: "🛡️",
        route: "/data-safety",
        url: `${DOMAIN}/data-safety`,
      },
      {
        label: "Data Deletion Request",
        desc: "Request deletion of your personal data",
        icon: "🗑️",
        route: null,
        url: `${DOMAIN}/data-safety#deletion`,
      },
    ],
  },
  {
    title: "Permission Policies",
    color: "#0EA5E9",
    items: [
      {
        label: "CAMERA Permission",
        desc: "How and why we use your camera",
        icon: "📷",
        route: "/permissions/camera",
        url: `${DOMAIN}/permissions/camera`,
      },
      {
        label: "RECORD_AUDIO Permission",
        desc: "How and why we use your microphone",
        icon: "🎙️",
        route: "/permissions/record-audio",
        url: `${DOMAIN}/permissions/record-audio`,
      },
      {
        label: "GET_ACCOUNTS Permission",
        desc: "How and why we access your accounts",
        icon: "👤",
        route: "/permissions/get-accounts",
        url: `${DOMAIN}/permissions/get-accounts`,
      },
      {
        label: "READ_PHONE_STATE Permission",
        desc: "How and why we read phone state",
        icon: "📱",
        route: "/privacy-policy",
        url: `${DOMAIN}/privacy-policy`,
      },
    ],
  },
];

export default function LegalScreen() {
  const router = useRouter();
  const colors = useColors();

  const handlePress = (route: string | null, url: string) => {
    if (route) {
      router.push(route as any);
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ backgroundColor: "#1E1B4B", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name="doc.text.fill" size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800" }}>Legal & Privacy</Text>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 }}>
                All legal documents and permission policies
              </Text>
            </View>
          </View>
        </View>

        {/* Sections */}
        {LEGAL_SECTIONS.map((section) => (
          <View key={section.title} style={{ paddingHorizontal: 16, marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <View style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: section.color }} />
              <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "700" }}>
                {section.title}
              </Text>
            </View>
            <View style={{ backgroundColor: colors.background, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderTopWidth: idx > 0 ? 1 : 0,
                    borderTopColor: colors.border,
                    gap: 12,
                  }}
                  onPress={() => handlePress(item.route, item.url)}
                  activeOpacity={0.7}
                >
                  <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: `${section.color}12`, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "600" }}>{item.label}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12, marginTop: 1 }}>{item.desc}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Public URLs */}
        <View style={{ marginHorizontal: 16, marginTop: 20, backgroundColor: "#7C3AED10", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#7C3AED30" }}>
          <Text style={{ color: "#7C3AED", fontSize: 13, fontWeight: "700", marginBottom: 10 }}>
            Public URLs (for app store submissions)
          </Text>
          {[
            { label: "Privacy Policy", path: "/privacy-policy" },
            { label: "Terms of Service", path: "/terms-of-service" },
            { label: "Cookie Policy", path: "/cookie-policy" },
            { label: "Data Safety", path: "/data-safety" },
            { label: "Data Deletion", path: "/data-safety#deletion" },
          ].map((link) => (
            <TouchableOpacity
              key={link.label}
              style={{ marginBottom: 6 }}
              onPress={() => Linking.openURL(`${DOMAIN}${link.path}`)}
              activeOpacity={0.7}
            >
              <Text style={{ color: colors.muted, fontSize: 11 }}>{link.label}</Text>
              <Text style={{ color: "#7C3AED", fontSize: 12, fontWeight: "500" }} numberOfLines={1}>
                {DOMAIN}{link.path}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={{ marginHorizontal: 16, marginTop: 16, alignItems: "center" }}>
          <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center", lineHeight: 18 }}>
            © 2026 Clickeros AI, Inc.{"\n"}
            Questions? privacy@clickeros.ai
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
