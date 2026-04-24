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
          <Text style={{ writingDirection: "rtl" }} className={`text-base leading-8 text-left mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            نحن نحترم خصوصيتك ونلتزم بحماية بياناتك.
          </Text>

          <Text style={{ writingDirection: "rtl" }} className={`text-lg font-bold text-left mt-2 mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            جمع المعلومات
          </Text>
          <Text style={{ writingDirection: "rtl" }} className={`text-base leading-8 text-left mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            لا نقوم بجمع بيانات شخصية حساسة. قد يتم جمع بيانات غير شخصية لتحسين الأداء.
          </Text>

          <Text style={{ writingDirection: "rtl" }} className={`text-lg font-bold text-left mt-2 mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            استخدام المعلومات
          </Text>
          <Text style={{ writingDirection: "rtl" }} className={`text-base leading-8 text-left mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            تُستخدم البيانات فقط لتحسين تجربة المستخدم.
          </Text>

          <Text style={{ writingDirection: "rtl" }} className={`text-lg font-bold text-left mt-2 mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            مشاركة المعلومات
          </Text>
          <Text style={{ writingDirection: "rtl" }} className={`text-base leading-8 text-left mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            لا نقوم ببيع أو مشاركة بيانات المستخدمين.
          </Text>

          <Text style={{ writingDirection: "rtl" }} className={`text-lg font-bold text-left mt-2 mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            الأمان
          </Text>
          <Text style={{ writingDirection: "rtl" }} className={`text-base leading-8 text-left mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            نستخدم وسائل مناسبة لحماية بيانات المستخدمين.
          </Text>

          <Text style={{ writingDirection: "rtl" }} className={`text-lg font-bold text-left mt-2 mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            التواصل
          </Text>
          <Text style={{ writingDirection: "rtl" }} className={`text-base leading-8 text-left mb-12 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            7kawy.net@gmail.com
          </Text>
        </ScrollView>
        
      </SafeAreaView>
    </View>
  );
};

export default PrivacyPolicyScreen;
