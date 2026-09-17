import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
  type PressableProps,
} from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "@/theme/tokens";

const TAB_BAR_CONTENT_HEIGHT = 44;
const TAB_BAR_BOTTOM_PADDING = 18;

function TabBarButton({
  label,
  focused,
  style,
  ...rest
}: Omit<PressableProps, "style"> & {
  label: string;
  focused: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      {...rest}
      style={[
        style,
        styles.tabItem,
        { borderTopColor: focused ? colors.accent : "transparent" },
      ]}
    >
      <Text
        style={[
          styles.tabLabel,
          {
            fontFamily: focused ? fonts.monoMedium : fonts.mono,
            color: focused ? colors.accent : colors.textMuted,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.min(insets.bottom, TAB_BAR_BOTTOM_PADDING);

  return (
    <Tabs
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.bgBase,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          height: TAB_BAR_CONTENT_HEIGHT + bottomPad,
          paddingBottom: bottomPad,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarButton: (props: any) => (
            <TabBarButton
              {...props}
              label="Home"
              focused={!!props["aria-selected"]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarButton: (props: any) => (
            <TabBarButton
              {...props}
              label="Search"
              focused={!!props["aria-selected"]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarButton: (props: any) => (
            <TabBarButton
              {...props}
              label="Profile"
              focused={!!props["aria-selected"]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    padding: 0,
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 11,
    letterSpacing: 3.3,
    textTransform: "uppercase",
  },
});
