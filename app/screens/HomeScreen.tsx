import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StatusBar } from "react-native";
import { StoryService } from "../services/StoryService";
import { HomeScreenProps } from "../types/navigation";
import CategoryCard from "../components/CategoryCard";
import { Moon, Sun } from "lucide-react-native";
import { useTheme } from "../services/ThemeContext";
import {SafeAreaView} from 'react-native-safe-area-context';

const { width, height } = Dimensions.get("window");

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const categories = StoryService.getCategories();
  const { isDark, toggleTheme } = useTheme();

  const regularCategories = categories.slice(0, 6);
  const fullWidthCategory = categories[6];

  const renderCategoryPairs = () => {
    const pairs = [];
    for (let i = 0; i < regularCategories.length; i += 2) {
      pairs.push(regularCategories.slice(i, i + 2));
    }
    return pairs.map((pair, index) => (
      <View key={index} className="flex-row-reverse px-4 mb-2">
        {pair.map((item) => (
          <CategoryCard
            key={item.id}
            category={item}
            onPress={() =>
              navigation.navigate("Stories", {
                categoryId: item.id,
                categoryName: item.name,
              })
            }
          />
        ))}
      </View>
    ));
  };

  return (
    <View className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <SafeAreaView className="flex-1">
        {/* Header Section */}
        <View className="flex-row-reverse justify-between items-center px-8 py-6">
          <TouchableOpacity
            onPress={toggleTheme}
            className={`p-3.5 rounded-full ${isDark ? "bg-white/10" : "bg-black/5"} border ${isDark ? "border-white/10" : "border-black/10"} shadow-sm`}
          >
            {isDark ? (
              <Sun color="#FBBF24" size={24} />
            ) : (
              <Moon color="#111827" size={24} />
            )}
          </TouchableOpacity>
          <Text style={{ writingDirection: "rtl" }} className={`text-3xl font-extrabold text-right ${isDark ? "text-white" : "text-gray-900"}`}>
            مكتبة القصص
          </Text>
        </View>

        <ScrollView 
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {renderCategoryPairs()}
          
          {fullWidthCategory && (
            <View className="px-4 items-center mb-8">
              <CategoryCard
                category={fullWidthCategory}
                fullWidth={true}
                onPress={() =>
                  navigation.navigate("Stories", {
                    categoryId: fullWidthCategory.id,
                    categoryName: fullWidthCategory.name,
                  })
                }
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
