import React from "react";
import { TouchableOpacity, Text, View, ImageBackground } from "react-native";
import { Story } from "../types";
import { useTheme } from "../services/ThemeContext";

interface StoryItemProps {
  story: Story;
  onPress: () => void;
  width?: number;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, onPress, width }) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ width: width ? width - 16 : "auto", height: width ? (width - 16) * 1.4 : 200, margin: 8 }}
      className={`rounded-2xl rounded-l-none shadow-md overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-200"} border-l-8 ${isDark ? "border-l-gray-900" : "border-l-amber-900"} border-r border-t border-b ${isDark ? "border-gray-700" : "border-black/10"}`}
      onPress={onPress}
    >
      <ImageBackground
        source={{ uri: story.image }}
        className="flex-1 justify-end"
        resizeMode="cover"
      >
        <View className="bg-black/60 p-3" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 16 }}>
          <Text style={{ writingDirection: "rtl" }} className="text-base font-bold text-white text-right mb-1">
            {story.title}
          </Text>
          <Text
            numberOfLines={2}
            style={{ writingDirection: "rtl" }}
            className="text-xs text-gray-200 text-right leading-tight"
          >
            {story.description}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default StoryItem;
