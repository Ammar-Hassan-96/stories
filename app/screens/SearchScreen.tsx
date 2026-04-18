import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ListRenderItemInfo,
  Keyboard,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Search, X, Menu, TrendingUp } from "lucide-react-native";
import { useTheme } from "../services/ThemeContext";
import { AppDrawerNavigationProp } from "../types/navigation";
import { Story } from "../types";
import StoryItem from "../components/StoryItem";
import { StoryService } from "../services/StoryService";
import { fetchStoriesFromSupabase } from "../services/supabaseClient";

const { width: screenWidth } = Dimensions.get("window");
const columnWidth = screenWidth / 2;

const CATEGORY_NAMES: Record<string, string> = {
  horror: "رعب",
  love: "حب ورومانسية",
  "sci-fi": "خيال علمي",
  thriller: "إثارة وتشويق",
  islamic: "إسلامية",
  drama: "دراما",
  kids: "أطفال",
};

const SearchScreen: React.FC = () => {
  const { isDark } = useTheme();
  const drawerNavigation = useNavigation<AppDrawerNavigationProp>();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bgColor = isDark ? "#0F0D1A" : "#EDE3D6";
  const headerBg = isDark ? "#13101F" : "#A8784E";
  const iconColor = isDark ? "#F9FAFB" : "#3D2B1F";
  const accentColor = isDark ? "#C8A96E" : "#8B5A2B";
  const inputBg = isDark ? "#1A1630" : "#EDE3D6";
  const inputColor = isDark ? "#E8DDD0" : "#2C1810";

  const categories = useMemo(() => StoryService.getCategories(), []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);

    try {
      const promises = categories.map((cat) =>
        fetchStoriesFromSupabase(cat.id, 0, 30).catch(() => ({ stories: [], hasMore: false }))
      );
      const allResults = await Promise.all(promises);
      const allStories = allResults.flatMap((r) => r.stories);

      // Fuzzy filter: match query in title or author
      const trimmed = q.trim();
      const filtered = allStories.filter(
        (s) => s.title.includes(trimmed) || (s.author && s.author.includes(trimmed))
      );

      // Deduplicate by id
      const seen = new Set<number>();
      const unique = filtered.filter((s) => {
        if (seen.has(s.id)) return false;
        seen.add(s.id);
        return true;
      });

      setResults(unique);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [categories]);

  const onChangeText = useCallback(
    (text: string) => {
      setQuery(text);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => doSearch(text), 500);
    },
    [doSearch]
  );

  const onClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setSearched(false);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Story>) => (
      <Animated.View entering={FadeInDown.delay(index * 40).springify()}>
        <StoryItem
          story={item}
          width={columnWidth}
          onPress={() => {
            Keyboard.dismiss();
            drawerNavigation.navigate("HomeStack", {
              screen: "StoryDetails",
              params: { story: item },
            });
          }}
        />
      </Animated.View>
    ),
    [drawerNavigation]
  );

  const keyExtractor = useCallback((item: Story) => String(item.id), []);

  const trendingCategories = categories;

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: headerBg }]}>
          <TouchableOpacity
            onPress={() => drawerNavigation.openDrawer()}
            style={[styles.iconBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }]}
          >
            <Menu color={iconColor} size={22} />
          </TouchableOpacity>

          <View style={[styles.searchBar, { backgroundColor: inputBg }]}>
            <Search size={16} color={isDark ? "#6B5F7A" : "#9C8878"} />
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={onChangeText}
              placeholder="ابحث في كل القصص..."
              placeholderTextColor={isDark ? "#5A4F6A" : "#B0967E"}
              style={[styles.searchInput, { color: inputColor }]}
              textAlign="right"
              returnKeyType="search"
              onSubmitEditing={() => doSearch(query)}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={onClear}>
                <X size={16} color={isDark ? "#6B5F7A" : "#9C8878"} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={accentColor} />
            <Text style={[styles.loadingText, { color: isDark ? "#6B6B8A" : "#9C8167" }]}>
              جاري البحث...
            </Text>
          </View>
        ) : searched && results.length === 0 ? (
          <Animated.View entering={FadeIn} style={styles.centerContainer}>
            <Search color={isDark ? "#3D3D55" : "#C8B89A"} size={48} />
            <Text style={[styles.noResultTitle, { color: isDark ? "#E8DDD0" : "#5C3D2E", fontFamily: "Amiri_700Bold" }]}>
              لا توجد نتائج
            </Text>
            <Text style={[styles.noResultSub, { color: isDark ? "#6B6B8A" : "#9C8167" }]}>
              لم يتم العثور على نتائج لـ "{query}"
            </Text>
          </Animated.View>
        ) : results.length > 0 ? (
          <>
            <Animated.View entering={FadeIn} style={styles.resultsHeader}>
              <Text style={[styles.resultsCount, { color: accentColor }]}>
                {results.length} نتيجة
              </Text>
              <Text style={[styles.resultsLabel, { color: isDark ? "#8A8AA0" : "#9C8167" }]}>
                نتائج البحث عن "{query}"
              </Text>
            </Animated.View>
            <FlatList
              data={results}
              keyExtractor={keyExtractor}
              numColumns={2}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
            />
          </>
        ) : (
          <Animated.View entering={FadeInDown.springify()} style={styles.suggestionsContainer}>
            <View style={styles.sectionHeader}>
              <TrendingUp color={accentColor} size={18} />
              <Text style={[styles.sectionTitle, { color: isDark ? "#F0E6D3" : "#5C3D2E", fontFamily: "Amiri_700Bold" }]}>
                تصفح التصنيفات
              </Text>
            </View>
            <View style={styles.categoriesGrid}>
              {trendingCategories.map((cat, index) => (
                <Animated.View key={cat.id} entering={FadeInDown.delay(index * 60).springify()}>
                  <TouchableOpacity
                    style={[
                      styles.catChip,
                      { backgroundColor: isDark ? "#1A1630" : "#EDE3D6", borderColor: isDark ? "#2C2840" : "#D4C4B0" },
                    ]}
                    onPress={() => {
                      drawerNavigation.navigate("HomeStack", {
                        screen: "Stories",
                        params: {
                          categoryId: cat.id,
                          categoryName: CATEGORY_NAMES[cat.id] ?? cat.name,
                        },
                      });
                    }}
                  >
                    <Text style={[styles.catChipText, { color: isDark ? "#C8A96E" : "#8B5A2B" }]}>
                      {CATEGORY_NAMES[cat.id] ?? cat.name}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  iconBtn: { padding: 8, borderRadius: 20 },
  searchBar: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 22,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Amiri_400Regular",
    writingDirection: "rtl",
    paddingVertical: 0,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 15,
    fontFamily: "Amiri_400Regular",
    writingDirection: "rtl",
  },
  noResultTitle: {
    fontSize: 22,
    textAlign: "center",
    writingDirection: "rtl",
  },
  noResultSub: {
    fontSize: 14,
    textAlign: "center",
    writingDirection: "rtl",
    fontFamily: "Amiri_400Regular",
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  resultsCount: {
    fontSize: 15,
    fontWeight: "800",
  },
  resultsLabel: {
    fontSize: 13,
    fontFamily: "Amiri_400Regular",
    writingDirection: "rtl",
  },
  listContent: { paddingTop: 4, paddingBottom: 40 },
  suggestionsContainer: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    writingDirection: "rtl",
  },
  categoriesGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
  },
  catChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 15,
    fontWeight: "700",
    writingDirection: "rtl",
  },
});

export default SearchScreen;
