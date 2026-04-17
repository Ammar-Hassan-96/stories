import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { StoryService } from "../services/StoryService";
import { HomeScreenProps } from "../types/navigation";
import CategoryCard from "../components/CategoryCard";
import FeaturedStoryBanner from "../components/FeaturedStoryBanner";
import { Moon, Sun, Menu } from "lucide-react-native";
import { useTheme } from "../services/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { AppDrawerNavigationProp } from "../types/navigation";
import { fetchFeaturedStory } from "../services/supabaseClient";
import { Story } from "../types";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5)  return { main: "ليلة الحكايات",  sub: "أجمل القصص قبل النوم" };
  if (hour < 12) return { main: "صباح القراءة",   sub: "ابدأ يومك بقصة جميلة" };
  if (hour < 17) return { main: "مساء الكتب",     sub: "اجعل بعد الظهر وقت قصص" };
  if (hour < 21) return { main: "وقت الحكايات",   sub: "لا وقت أجمل من الآن للقراءة" };
  return          { main: "ليلة الحكايات",         sub: "أجمل القصص قبل النوم" };
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const categories = StoryService.getCategories();
  const { isDark, toggleTheme } = useTheme();
  const [featuredStory, setFeaturedStory] = useState<Story | null>(null);
  const greeting = getGreeting();
  const drawerNavigation = useNavigation<AppDrawerNavigationProp>();

  const regularCategories = categories.slice(0, 6);
  const fullWidthCategory = categories[6];

  useEffect(() => {
    fetchFeaturedStory().then(setFeaturedStory).catch(() => {});
  }, []);

  const renderCategoryPairs = () => {
    const pairs: (typeof regularCategories)[] = [];
    for (let i = 0; i < regularCategories.length; i += 2) {
      pairs.push(regularCategories.slice(i, i + 2));
    }
    return pairs.map((pair, pairIndex) => (
      <View key={pairIndex} className="flex-row-reverse px-4 mb-2">
        {pair.map((item, itemIndex) => (
          <CategoryCard
            key={item.id}
            category={item}
            index={pairIndex * 2 + itemIndex}
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
        {/* Header */}
        <View className="flex-row-reverse justify-between items-center px-6 py-4">
          <Animated.View entering={FadeIn.delay(50).springify()} className="flex-row-reverse gap-3">
            <TouchableOpacity
              onPress={() => drawerNavigation.openDrawer()}
              className={`p-3.5 rounded-full ${isDark ? "bg-white/10" : "bg-black/5"} border ${isDark ? "border-white/10" : "border-black/10"}`}
            >
              <Menu color={isDark ? "#ffffff" : "#111827"} size={22} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleTheme}
              className={`p-3.5 rounded-full ${isDark ? "bg-white/10" : "bg-black/5"} border ${isDark ? "border-white/10" : "border-black/10"}`}
            >
              {isDark ? <Sun color="#FBBF24" size={22} /> : <Moon color="#111827" size={22} />}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.springify().damping(14).stiffness(110)}
            style={{ alignItems: "flex-end" }}
          >
            <Text
              style={{ writingDirection: "rtl", fontFamily: "Amiri_700Bold" }}
              className={`text-3xl text-right ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {greeting.main}
            </Text>
            <Text
              style={{ writingDirection: "rtl" }}
              className={`text-sm text-right mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {greeting.sub}
            </Text>
          </Animated.View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Featured Story of the Day */}
          {featuredStory && (
            <FeaturedStoryBanner
              story={featuredStory}
              onPress={() => navigation.navigate("StoryDetails", { story: featuredStory })}
            />
          )}

          {/* Section header */}
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={{ paddingHorizontal: 24, marginBottom: 6 }}
          >
            <Text
              style={{
                writingDirection: "rtl",
                fontFamily: "Amiri_700Bold",
                fontSize: 20,
                textAlign: "right",
                color: isDark ? "#D4C8B5" : "#5C3D2E",
              }}
            >
              التصنيفات
            </Text>
          </Animated.View>

          {renderCategoryPairs()}

          {fullWidthCategory && (
            <View className="px-4 items-center mb-8">
              <CategoryCard
                category={fullWidthCategory}
                fullWidth={true}
                index={regularCategories.length}
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
