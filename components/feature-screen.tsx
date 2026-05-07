import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface StatCard {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  color?: string;
}

interface FeatureItem {
  title: string;
  desc: string;
  icon?: string;
  badge?: string;
  badgeColor?: string;
}

interface FeatureScreenProps {
  title: string;
  subtitle: string;
  iconName: Parameters<typeof IconSymbol>[0]["name"];
  iconColor: string;
  stats?: StatCard[];
  features?: FeatureItem[];
  ctaLabel?: string;
  ctaRoute?: string;
  children?: React.ReactNode;
}

export function FeatureScreen({
  title,
  subtitle,
  iconName,
  iconColor,
  stats,
  features,
  ctaLabel,
  ctaRoute,
  children,
}: FeatureScreenProps) {
  const router = useRouter();
  const colors = useColors();

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: 14 }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${iconColor}15`, alignItems: "center", justifyContent: "center" }}>
              <IconSymbol name={iconName} size={22} color={iconColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: "700" }}>{title}</Text>
              <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>{subtitle}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {stats.map((stat) => (
                <View
                  key={stat.label}
                  style={{
                    width: stats.length === 2 ? "47%" : stats.length === 3 ? "30%" : "47%",
                    backgroundColor: colors.background,
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  {stat.change && (
                    <View style={{ backgroundColor: stat.positive !== false ? "#DCFCE7" : "#FEE2E2", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, alignSelf: "flex-start", marginBottom: 8 }}>
                      <Text style={{ color: stat.positive !== false ? "#16A34A" : "#DC2626", fontSize: 11, fontWeight: "600" }}>{stat.change}</Text>
                    </View>
                  )}
                  <Text style={{ color: stat.color || iconColor, fontSize: 22, fontWeight: "700" }}>{stat.value}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Features List */}
        {features && features.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "700", marginBottom: 12 }}>Features</Text>
            <View style={{ backgroundColor: colors.background, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
              {features.map((feature, idx) => (
                <View
                  key={feature.title}
                  style={{
                    padding: 16,
                    borderTopWidth: idx > 0 ? 1 : 0,
                    borderTopColor: colors.border,
                    flexDirection: "row",
                    gap: 12,
                  }}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${iconColor}15`, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 18 }}>{feature.icon || "✨"}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "600" }}>{feature.title}</Text>
                      {feature.badge && (
                        <View style={{ backgroundColor: feature.badgeColor ? `${feature.badgeColor}20` : "#7C3AED20", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                          <Text style={{ color: feature.badgeColor || "#7C3AED", fontSize: 10, fontWeight: "600" }}>{feature.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 18 }}>{feature.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Custom Children */}
        {children}

        {/* CTA Button */}
        {ctaLabel && (
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <TouchableOpacity
              style={{ backgroundColor: iconColor, borderRadius: 14, paddingVertical: 16, alignItems: "center" }}
              onPress={() => ctaRoute && router.push(ctaRoute as any)}
              activeOpacity={0.8}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>{ctaLabel}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
