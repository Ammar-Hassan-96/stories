import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInRight, FadeInDown } from "react-native-reanimated";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { useTheme } from "../services/ThemeContext";
import {
  Home,
  Shield,
  Mail,
  X,
  Bookmark,
  Search,
  BookOpen,
  TrendingUp,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DrawerContent = (props: DrawerContentComponentProps) => {
  const { isDark } = useTheme();

  const mainItems = [
    { name: "الرئيسية",      icon: Home,       route: "HomeStack",      action: () => props.navigation.navigate("HomeStack") },
    { name: "البحث",          icon: Search,     route: "Search",         action: () => props.navigation.navigate("Search") },
    { name: "المفضلة",    icon: Bookmark,   route: "Bookmarks", action: () => props.navigation.navigate("Bookmarks") },
    { name: "إحصائياتي", icon: TrendingUp, route: "Stats",     action: () => props.navigation.navigate("Stats") },
  ];

  const otherItems = [
    { name: "سياسة الخصوصية", icon: Shield, route: "PrivacyPolicy", action: () => props.navigation.navigate("PrivacyPolicy") },
    { name: "تواصل معنا",      icon: Mail,   route: "ContactUs",     action: () => props.navigation.navigate("ContactUs") },
  ];

  const currentRouteName = props.state.routeNames[props.state.index];
  const accentColor = isDark ? "#C8A96E" : "#8B5A2B";

  const renderItem = (item: typeof mainItems[0], index: number) => {
    const isActive = currentRouteName === item.route;
    const IconComponent = item.icon;
    return (
      <Animated.View
        key={index}
        entering={FadeInRight.delay(index * 65).springify().damping(16).stiffness(130)}
      >
        <TouchableOpacity
          style={[
            drawerStyles.menuItem,
            isActive && { backgroundColor: isDark ? "rgba(200,169,110,0.15)" : "rgba(139,90,43,0.08)" },
          ]}
          onPress={item.action}
        >
          <IconComponent
            color={isActive ? accentColor : (isDark ? "#a1a1aa" : "#52525b")}
            size={22}
          />
          <Text
            style={[
              drawerStyles.menuItemText,
              { color: isActive ? accentColor : (isDark ? "#a1a1aa" : "#52525b") },
              isActive && { fontWeight: "800" },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}>
      <Animated.View
        entering={FadeInDown.springify().damping(16)}
        style={[drawerStyles.header, { borderBottomColor: isDark ? "#1E1E2E" : "#E5D5C5" }]}
      >
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <X color={isDark ? "#ffffff" : "#000000"} size={26} />
        </TouchableOpacity>
        <View style={drawerStyles.logoRow}>
          <BookOpen color={accentColor} size={22} />
          <Text style={[drawerStyles.logoText, { color: isDark ? "#F0E6D3" : "#3D2B1F", fontFamily: "Amiri_700Bold" }]}>
            مكتبة القصص
          </Text>
        </View>
      </Animated.View>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={drawerStyles.section}>
          {mainItems.map(renderItem)}
        </View>
        <View style={[drawerStyles.divider, { backgroundColor: isDark ? "#1E1E2E" : "#E5D5C5" }]} />
        <View style={drawerStyles.section}>
          {otherItems.map((item, i) => renderItem(item, mainItems.length + i))}
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const drawerStyles = StyleSheet.create({
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoText: {
    fontSize: 22,
    writingDirection: "ltr",
  },
  section: {
    paddingTop: 12,
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 4,
    borderRadius: 14,
  },
  menuItemText: {
    fontSize: 17,
    writingDirection: "rtl",
    textAlign: "right",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    marginVertical: 8,
  },
});

export default DrawerContent;
