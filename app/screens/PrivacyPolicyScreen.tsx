import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../services/ThemeContext";
import { ArrowRight, Menu } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { AppDrawerNavigationProp } from "../types/navigation";

const PrivacyPolicyScreen = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<AppDrawerNavigationProp>();

  return (
    <View className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView className="flex-1">
        <View className="flex-row-reverse justify-between items-center px-6 py-6 border-b border-gray-200 dark:border-gray-800">
          <TouchableOpacity onPress={() => navigation.openDrawer()} className="p-2">
            <Menu color={isDark ? "#ffffff" : "#000000"} size={28} />
          </TouchableOpacity>
          <Text style={{ writingDirection: "rtl" }} className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            سياسة الخصوصية
          </Text>
          <View style={{ width: 44 }} />
        </View>
        <ScrollView className="flex-1 p-6">
          <Text style={{ writingDirection: "rtl" }} className={`text-base leading-8 text-right mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            هذه الصفحة تحتوي على سياسة الخصوصية الخاصة بتطبيق مكتبة القصص. 
            تطبيقنا يحترم خصوصيتك ولا يقوم بجمع أي بيانات شخصية أو تخزينها على خوادم خارجية. 
            جميع القصص يتم عرضها محلياً على جهازك.
          </Text>
          <Text style={{ writingDirection: "rtl" }} className={`text-base leading-8 text-right mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            نحن نستخدم بعض التقنيات الأساسية لضمان عمل التطبيق بشكل سليم وتوفير تجربة مستخدم ممتازة.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PrivacyPolicyScreen;
