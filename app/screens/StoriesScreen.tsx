import React from "react";
import { View, Text, FlatList, TouchableOpacity, StatusBar, Dimensions } from "react-native";
import { StoryService } from "../services/StoryService";
import { StoriesScreenProps } from "../types/navigation";
import StoryItem from "../components/StoryItem";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "../services/ThemeContext";
import {SafeAreaView} from 'react-native-safe-area-context';

const StoriesScreen: React.FC<StoriesScreenProps> = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const stories = StoryService.getStoriesByCategory(categoryId);
  const { isDark } = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = screenWidth / 2;

  return (
    <View className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text style={{ writingDirection: "rtl" }} className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}  flex-1 ml-4`}>
             {categoryName}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className={`p-3 rounded-full ${isDark ? "bg-white/10" : "bg-black/5"}`}
          >
            <ChevronLeft color={isDark ? "#F9FAFB" : "#111827"} size={24} />
          </TouchableOpacity>
        </View>

        {stories.length === 0 ? (
          <View className="flex-1 items-center justify-center -mt-20">
             <Text style={{ writingDirection: "rtl" }} className={`text-lg ${isDark ? "text-gray-400" : "text-gray-700"}`}>
               لا توجد قصص في هذا التصنيف حالياً
             </Text>
          </View>
        ) : (
          <FlatList
            data={stories}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <StoryItem
                story={item}
                width={columnWidth}
                onPress={() => navigation.navigate("StoryDetails", { storyId: item.id })}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default StoriesScreen;
