import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../services/ThemeContext";
import { Menu, Mail, Phone, MapPin } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { AppDrawerNavigationProp } from "../types/navigation";

const ContactUsScreen = () => {
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
            تواصل معنا
          </Text>
          <View style={{ width: 44 }} />
        </View>
        <ScrollView className="flex-1 px-3 mx-4 py-8">
          <Text style={{ writingDirection: "rtl" }} className={`text-lg font-semibold text-left mb-8 ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            يسعدنا تواصلكم معنا لأي استفسارات أو اقتراحات.
          </Text>

          <View className="mb-6 flex-row items-center">
            <View className={`p-4 rounded-full ${isDark ? "bg-white/10" : "bg-black/5"} ml-4`}>
              <Phone color={isDark ? "#ffffff" : "#000000"} size={24} />
            </View>
            <View className="flex-1">
              <Text style={{ writingDirection: "rtl" }} className={`text-left text-base mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>رقم الهاتف</Text>
              <Text style={{ writingDirection: "rtl" }} className={`text-left text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>+201554968880</Text>
            </View>
          </View>

          <View className="mb-6 flex-row items-center">
            <View className={`p-4 rounded-full ${isDark ? "bg-white/10" : "bg-black/5"} ml-4`}>
              <Phone color={isDark ? "#ffffff" : "#000000"} size={24} />
            </View>
            <View className="flex-1">
              <Text style={{ writingDirection: "rtl" }} className={`text-left text-base mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>رقم الهاتف</Text>
              <Text style={{ writingDirection: "rtl" }} className={`text-left text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>+01023668236</Text>
            </View>
          </View>

          <View className="mb-6 flex-row items-center">
            <View className={`p-4 rounded-full ${isDark ? "bg-white/10" : "bg-black/5"} ml-4`}>
              <Phone color={isDark ? "#ffffff" : "#000000"} size={24} />
            </View>
            <View className="flex-1">
              <Text style={{ writingDirection: "rtl" }} className={`text-left text-base mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>رقم الهاتف</Text>
              <Text style={{ writingDirection: "rtl" }} className={`text-left text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>+201112310567</Text>
            </View>
          </View>
          
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ContactUsScreen;
