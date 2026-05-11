import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";
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
  const r = useResponsive();

  // Determine stat card width: 2-col on phones, 3-col on tablets, 4-col on desktop
  const statCount = stats?.length ?? 0;
  const statCols = r.isPhone ? 2 : r.isTablet ? Math.min(statCount, 3) : Math.min(statCount, 4);
  const statCardW = statCount <= 1
    ? r.width - r.px * 2
    : (r.width - r.px * 2 - (statCols - 1) * 10) / statCols;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: r.px, paddingTop: 16, paddingBottom: 16,
          borderBottomWidth: 1, borderBottomColor: colors.border,
        }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14, minHeight: 44 }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: r.fontSize.base }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: `${iconColor}15`,
              alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <IconSymbol name={iconName} size={22} color={iconColor} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: colors.foreground, fontSize: r.fontSize["2xl"], fontWeight: "700" }} numberOfLines={2}>
                {title}
              </Text>
              <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, marginTop: 2 }} numberOfLines={2}>
                {subtitle}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        {stats && stats.length > 0 && (
          <View style={{ paddingHorizontal: r.px, marginTop: 16 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {stats.map((stat) => (
                <View
                  key={stat.label}
                  style={{
                    width: statCardW,
                    backgroundColor: colors.background,
                    borderRadius: 14, padding: r.isXs ? 12 : 14,
                    borderWidth: 1, borderColor: colors.border,
                    overflow: "hidden",
                  }}
                >
                  {stat.change && (
                    <View style={{
                      backgroundColor: stat.positive !== false ? "#DCFCE7" : "#FEE2E2",
                      borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
                      alignSelf: "flex-start", marginBottom: 8,
                    }}>
                      <Text style={{
                        color: stat.positive !== false ? "#16A34A" : "#DC2626",
                        fontSize: r.fontSize.xs, fontWeight: "600",
                      }}>{stat.change}</Text>
                    </View>
                  )}
                  <Text style={{
                    color: stat.color || iconColor,
                    fontSize: r.isXs ? 18 : 22, fontWeight: "700",
                  }} numberOfLines={1}>
                    {stat.value}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: r.fontSize.xs, marginTop: 2 }} numberOfLines={1}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Features List */}
        {features && features.length > 0 && (
          <View style={{ paddingHorizontal: r.px, marginTop: 20 }}>
            <Text style={{ color: colors.foreground, fontSize: r.fontSize.lg, fontWeight: "700", marginBottom: 12 }}>
              Features
            </Text>
            <View style={{
              backgroundColor: colors.background,
              borderRadius: 16, borderWidth: 1,
              borderColor: colors.border, overflow: "hidden",
            }}>
              {features.map((feature, idx) => (
                <View
                  key={feature.title}
                  style={{
                    padding: r.isXs ? 14 : 16,
                    borderTopWidth: idx > 0 ? 1 : 0,
                    borderTopColor: colors.border,
                    flexDirection: "row", gap: 12,
                    minHeight: 56,
                  }}
                >
                  <View style={{
                    width: 38, height: 38, borderRadius: 10,
                    backgroundColor: `${iconColor}15`,
                    alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Text style={{ fontSize: 18 }}>{feature.icon || "✨"}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <Text style={{ color: colors.foreground, fontSize: r.fontSize.base, fontWeight: "600" }}>
                        {feature.title}
                      </Text>
                      {feature.badge && (
                        <View style={{
                          backgroundColor: feature.badgeColor ? `${feature.badgeColor}20` : "#7C3AED20",
                          borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
                        }}>
                          <Text style={{
                            color: feature.badgeColor || "#7C3AED",
                            fontSize: r.fontSize.xs, fontWeight: "600",
                          }}>{feature.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ color: colors.muted, fontSize: r.fontSize.sm, lineHeight: 18 }}>
                      {feature.desc}
                    </Text>
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
          <View style={{ paddingHorizontal: r.px, marginTop: 24 }}>
            <TouchableOpacity
              style={{
                backgroundColor: iconColor, borderRadius: 14,
                height: 56, alignItems: "center", justifyContent: "center",
              }}
              onPress={() => ctaRoute && router.push(ctaRoute as any)}
              activeOpacity={0.8}
            >
              <Text style={{ color: "#FFFFFF", fontSize: r.fontSize.lg, fontWeight: "700" }}>
                {ctaLabel}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
