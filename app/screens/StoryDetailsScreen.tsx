import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from "react-native";
import { StoryService } from "../services/StoryService";
import { StoryDetailsScreenProps } from "../types/navigation";
import { ChevronLeft, Minus, Plus } from "lucide-react-native";
import { useTheme } from "../services/ThemeContext";
import {SafeAreaView} from 'react-native-safe-area-context';

const StoryDetailsScreen: React.FC<StoryDetailsScreenProps> = ({ route, navigation }) => {
  const { storyId } = route.params;
  const story = StoryService.getStoryById(storyId);
  const [fontSize, setFontSize] = useState(18);
  const { isDark } = useTheme();

  if (!story) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? "bg-background-dark" : "bg-background-light"}`}>
        <Text style={{ writingDirection: "rtl" }} className={isDark ? "text-white" : "text-gray-900"}>لم يتم العثور على القصة</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <SafeAreaView className="flex-1">
        <View className={`flex-row items-center justify-between px-6 py-4 border-b ${isDark ? "border-gray-800" : "border-black/5"}`}>
          <View className="flex-row-reverse items-center">
            <TouchableOpacity
              onPress={() => setFontSize((v) => Math.max(14, v - 2))}
              className={`p-2 ml-2 rounded-lg ${isDark ? "bg-white/10" : "bg-black/5"}`}
            >
              <Minus color={isDark ? "#F9FAFB" : "#111827"} size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFontSize((v) => Math.min(32, v + 2))}
              className={`p-2 rounded-lg ${isDark ? "bg-white/10" : "bg-black/5"}`}
            >
              <Plus color={isDark ? "#F9FAFB" : "#111827"} size={20} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className={`p-3 rounded-full ${isDark ? "bg-white/10" : "bg-black/5"}`}
          >
            <ChevronLeft color={isDark ? "#F9FAFB" : "#111827"} size={24} />
          </TouchableOpacity>
        </View>

        <View className="flex-1 p-4 pb-0 pt-2">
          <View className={`flex-1 rounded-sm shadow-md overflow-hidden ${isDark ? "bg-[#2C2416] border-[#3E3224]" : "bg-[#FDF6E3] border-[#E5C189]"} border-2 border-r-8 ${isDark ? "border-r-[#1E170E]" : "border-r-[#8B4513]"}`}>
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
              <View className="items-center mb-8 border-b-2 pb-6 border-dashed opacity-50">
                <Text style={{ writingDirection: "rtl" }} className={`text-3xl font-extrabold text-center mb-4 ${isDark ? "text-[#E6D5B8]" : "text-[#5C3A21]"}`}>
                  {story.title}
                </Text>
                <View className="flex-row-reverse justify-center gap-6">
                  <Text style={{ writingDirection: "rtl" }} className={`text-base font-medium ${isDark ? "text-[#C1A87D]" : "text-[#8B5A2B]"}`}>
                    بقلم: {story.author}
                  </Text>
                  <Text style={{ writingDirection: "rtl" }} className={`text-sm mt-0.5 ${isDark ? "text-[#A89467]" : "text-[#A07855]"}`}>
                    {story.date}
                  </Text>
                </View>
              </View>
              
              <Text
                style={{ fontSize, lineHeight: fontSize * 1.8, writingDirection: "rtl" }}
                className={`text-right leading-relaxed ${isDark ? "text-[#DFD3C3]" : "text-[#2C1E16]"}`}
              >
                {story.content}
              </Text>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default StoryDetailsScreen;
