import React from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import { Story } from "../types";
import { useTheme } from "../services/ThemeContext";

interface StoryItemProps {
  story: Story;
  onPress: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, onPress }) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`flex-row m-2 p-3 rounded-2xl shadow-sm border ${isDark ? "bg-card-dark border-gray-800" : "bg-white/80 border-black/5"}`}
      onPress={onPress}
    >
      <Image
        source={{ uri: story.image }}
        className="w-20 h-20 rounded-xl"
        resizeMode="cover"
      />
      <View className="flex-row-reverse flex-1 mr-4">
        <View className="flex-1">
          <Text style={{ writingDirection: "rtl" }} className={`text-lg font-bold text-right ${isDark ? "text-white" : "text-gray-900"}`}>
            {story.title}
          </Text>
          <Text
            numberOfLines={2}
            style={{ writingDirection: "rtl" }}
            className={`text-sm mt-1 text-right ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {story.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoryItem;
