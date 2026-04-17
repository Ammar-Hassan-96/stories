import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { useTheme } from "../services/ThemeContext";
import { Home, List, Shield, Mail, X } from "lucide-react-native";
import { CommonActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const DrawerContent = (props: DrawerContentComponentProps) => {
  const { isDark } = useTheme();

  const menuItems = [
    { name: "الرئيسية", icon: Home, route: "HomeStack", action: () => props.navigation.navigate("HomeStack") },
    { name: "التصنيفات", icon: List, route: "HomeStack", action: () => {
      props.navigation.navigate("HomeStack", { screen: 'Home' });
    } },
    { name: "سياسة الخصوصية", icon: Shield, route: "PrivacyPolicy", action: () => props.navigation.navigate("PrivacyPolicy") },
    { name: "تواصل معنا", icon: Mail, route: "ContactUs", action: () => props.navigation.navigate("ContactUs") },
  ];

  const currentRouteName = props.state.routeNames[props.state.index];

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}>
      <View className="flex-row-reverse justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-gray-800">
         <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
           <X color={isDark ? "#ffffff" : "#000000"} size={28} />
         </TouchableOpacity>
         <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
           مكتبة القصص
         </Text>
      </View>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <View className="pt-4 px-2">
          {menuItems.map((item, index) => {
            const isActive = currentRouteName === item.route;
            const IconComponent = item.icon;
            
            return (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center py-4 px-4 mb-2 rounded-xl ${
                  isActive ? (isDark ? "bg-white/10" : "bg-black/5") : ""
                }`}
                onPress={item.action}
              >
                <IconComponent 
                  color={isActive ? (isDark ? "#ffffff" : "#000000") : (isDark ? "#a1a1aa" : "#52525b")} 
                  size={24} 
                  className="ml-4" 
                />
                <Text style={{ writingDirection: "rtl" }} className={`text-lg font-semibold text-right ${
                  isActive 
                    ? (isDark ? "text-white" : "text-black") 
                    : (isDark ? "text-gray-400" : "text-gray-600")
                }`}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

export default DrawerContent;
