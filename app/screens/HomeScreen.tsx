import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar, StyleSheet, FlatList, Dimensions } from "react-native";
import Animated, { FadeInDown, FadeIn, FadeInRight } from "react-native-reanimated";
import { StoryService } from "../services/StoryService";
import { HomeScreenProps } from "../types/navigation";
import CategoryCard from "../components/CategoryCard";
import FeaturedStoryBanner from "../components/FeaturedStoryBanner";
import { Moon, Sun, Menu, History, Search, Clock } from "lucide-react-native";
import { useTheme } from "../services/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { AppDrawerNavigationProp } from "../types/navigation";
import { fetchFeaturedStory } from "../services/supabaseClient";
import { Story, getReadingTime } from "../types";
import { useReadingHistory } from "../hooks/useReadingHistory";
import { LinearGradient } from "expo-linear-gradient";
import BlurImage from "../components/BlurImage";
import { useFocusEffect } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HISTORY_CARD_W = 110;

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
  const { history, refresh: refreshHistory } = useReadingHistory();

  const regularCategories = categories.slice(0, 6);
  const fullWidthCategory = categories[6];

  useEffect(() => {
    fetchFeaturedStory().then(setFeaturedStory).catch(() => {});
  }, []);

  useFocusEffect(useCallback(() => { refreshHistory(); }, [refreshHistory]));

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
              onPress={() => drawerNavigation.navigate("Search")}
              className={`p-3.5 rounded-full ${isDark ? "bg-white/10" : "bg-black/5"} border ${isDark ? "border-white/10" : "border-black/10"}`}
            >
              <Search color={isDark ? "#ffffff" : "#111827"} size={22} />
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
            style={{ alignItems: "flex-start" }}
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
            <Animated.View entering={FadeInDown.delay(80).springify()}>
              <FeaturedStoryBanner
                story={featuredStory}
                onPress={() => navigation.navigate("StoryDetails", { story: featuredStory })}
              />
            </Animated.View>
          )}

            {/* Recently Read section */}
          {history.length > 0 && (
            <Animated.View entering={FadeInDown.delay(150).springify()} style={{ marginBottom: 8 }}>
              <View style={homeStyles.sectionRow}>
                <View style={homeStyles.sectionTitleRow}>
                  <History color={isDark ? "#C8A96E" : "#8B5A2B"} size={16} />
                  <Text style={[homeStyles.sectionTitle, { color: isDark ? "#D4C8B5" : "#5C3D2E", fontFamily: "Amiri_700Bold" }]}>
                    قرأت مؤخراً
                  </Text>
                </View>
              </View>
              <FlatList
                data={history.slice(0, 10)}
                keyExtractor={(item) => String(item.id)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
                renderItem={({ item, index }) => (
                  <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("StoryDetails", { story: item })}
                      style={[
                        homeStyles.historyCard,
                        { backgroundColor: isDark ? "#1A1630" : "#EDE3D6" },
                      ]}
                    >
                      <BlurImage
                        uri={item.image_url}
                        width={HISTORY_CARD_W}
                        height={HISTORY_CARD_W * 1.4}
                        borderRadius={10}
                        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                      />
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.82)"]}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <View style={homeStyles.historyMeta}>
                        <View style={homeStyles.historyTime}>
                          <Clock size={8} color="rgba(255,255,255,0.8)" />
                          <Text style={homeStyles.historyTimeText}>{getReadingTime(item.content)} د</Text>
                        </View>
                        <Text style={homeStyles.historyTitle} numberOfLines={2}>{item.title}</Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              />
            </Animated.View>
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
                textAlign: "left",
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

const homeStyles = StyleSheet.create({
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    textAlign: "left",
    writingDirection: "rtl",
  },
  historyCard: {
    width: HISTORY_CARD_W,
    height: HISTORY_CARD_W * 1.4,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  historyMeta: {
    padding: 6,
    alignItems: "flex-start",
  },
  historyTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 4,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  historyTimeText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 8,
    fontWeight: "700",
  },
  historyTitle: {
    color: "#F0E6D3",
    fontSize: 11,
    fontFamily: "Amiri_700Bold",
    textAlign: "left",
    writingDirection: "ltr",
    lineHeight: 16,
  },
});

export default HomeScreen;
