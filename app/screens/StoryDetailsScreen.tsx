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

        <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: story.image }}
            className="w-full h-64 rounded-3xl mb-6 shadow-sm"
            resizeMode="cover"
          />
          <Text style={{ writingDirection: "rtl" }} className={`text-3xl font-extrabold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            {story.title}
          </Text>
          <View className="flex-row-reverse mb-6 justify-end">
            <Text style={{ writingDirection: "rtl" }} className={`text-sm mr-4 font-medium ${isDark ? "text-primary-light" : "text-primary"}`}>
              الكاتب: {story.author}
            </Text>
            <Text style={{ writingDirection: "rtl" }} className={`text-sm mr-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              تاريخ: {story.date}
            </Text>
          </View>
          <Text
            style={{ fontSize, lineHeight: fontSize * 1.8, writingDirection: "rtl" }}
            className={`text-left leading-relaxed ${isDark ? "text-gray-200" : "text-gray-900"}`}
          >
            {story.content}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default StoryDetailsScreen;
