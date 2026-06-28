import { useState } from "react";
import { Text, TouchableOpacity, View, FlatList } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useResponsive } from "@/hooks/use-responsive";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function Dropdown({
  label,
  options,
  value,
  onSelect,
  placeholder = "Select an option",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colors = useColors();
  const r = useResponsive();

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Label */}
      <Text
        style={{
          color: colors.foreground,
          fontSize: r.fontSize.sm,
          fontWeight: "600",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>

      {/* Dropdown Button */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.surface,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: colors.border,
          minHeight: 44,
        }}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text
          style={{
            color: selectedOption ? colors.foreground : colors.muted,
            fontSize: r.fontSize.base,
            fontWeight: "500",
            flex: 1,
          }}
          numberOfLines={1}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <IconSymbol
          name="chevron.down"
          size={18}
          color={colors.muted}
          style={{
            transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>

      {/* Dropdown List */}
      {isOpen && (
        <View
          style={{
            marginTop: 8,
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: "hidden",
            maxHeight: 250,
          }}
        >
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            scrollEnabled={options.length > 5}
            nestedScrollEnabled={true}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  minHeight: 44,
                  justifyContent: "center",
                  borderBottomWidth: index < options.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                  backgroundColor:
                    value === item.value ? `${colors.primary}15` : colors.surface,
                }}
                onPress={() => {
                  onSelect(item.value);
                  setIsOpen(false);
                }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color:
                        value === item.value ? colors.primary : colors.foreground,
                      fontSize: r.fontSize.base,
                      fontWeight: value === item.value ? "600" : "500",
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  {value === item.value && (
                    <IconSymbol
                      name="checkmark"
                      size={18}
                      color={colors.primary}
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
