import React, { useCallback, memo, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  ListRenderItemInfo,
  TextInput,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  FadeIn,
} from "react-native-reanimated";
import { StoriesScreenProps } from "../types/navigation";
import { Story } from "../types";
import StoryItem from "../components/StoryItem";
import { ChevronLeft, BookOpen, Search, X } from "lucide-react-native";
import { useTheme } from "../services/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStories } from "../hooks/useStories";

const { width: screenWidth } = Dimensions.get("window");
const columnWidth = screenWidth / 2;

// Shimmer skeleton card
const SkeletonCard = memo(({ isDark, index }: { isDark: boolean; index: number }) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900 + index * 80 }),
        withTiming(0, { duration: 900 + index * 80 })
      ),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.35, 0.75]),
  }));

  return (
    <Animated.View
      entering={FadeIn.delay(index * 60)}
      style={[
        styles.skeleton,
        {
          width: columnWidth - 16,
          height: (columnWidth - 16) * 1.45,
          backgroundColor: isDark ? "#1E1A2E" : "#EDE0D4",
        },
        shimmerStyle,
      ]}
    />
  );
});

// Footer loader
const ListFooter = memo(
  ({ loadingMore, hasMore, isDark }: { loadingMore: boolean; hasMore: boolean; isDark: boolean }) => {
    if (!loadingMore && !hasMore) {
      return (
        <View style={styles.endContainer}>
          <View style={[styles.endLine, { backgroundColor: isDark ? "#3D3D55" : "#C8B89A" }]} />
          <Text style={[styles.endText, { color: isDark ? "#6B6B8A" : "#9C8167" }]}>
            انتهت القصص
          </Text>
          <View style={[styles.endLine, { backgroundColor: isDark ? "#3D3D55" : "#C8B89A" }]} />
        </View>
      );
    }
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={isDark ? "#C8A96E" : "#8B5A2B"} />
        </View>
      );
    }
    return null;
  }
);

const StoriesScreen: React.FC<StoriesScreenProps> = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const { isDark } = useTheme();
  const { stories, loading, refreshing, loadingMore, hasMore, error, loadMore, refresh } =
    useStories(categoryId);

  // ── Search ────────────────────────────────────────────────────
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);
  const searchHeight = useSharedValue(0);

  const toggleSearch = useCallback(() => {
    if (searchVisible) {
      setSearchQuery("");
      searchHeight.value = withTiming(0, { duration: 220 });
      setTimeout(() => setSearchVisible(false), 220);
    } else {
      setSearchVisible(true);
      searchHeight.value = withTiming(52, { duration: 220 });
      setTimeout(() => searchInputRef.current?.focus(), 240);
    }
  }, [searchVisible, searchHeight]);

  const searchBarStyle = useAnimatedStyle(() => ({
    height: searchHeight.value,
    opacity: interpolate(searchHeight.value, [0, 52], [0, 1]),
    overflow: "hidden",
  }));

  const filteredStories = searchQuery.trim()
    ? stories.filter((s) => s.title.includes(searchQuery.trim()))
    : stories;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Story>) => (
      <StoryItem
        story={item}
        width={columnWidth}
        onPress={() => navigation.navigate("StoryDetails", { story: item })}
      />
    ),
    [navigation]
  );

  const keyExtractor = useCallback((item: Story) => String(item.id), []);

  const onEndReached = useCallback(() => {
    if (!loadingMore && hasMore && !searchQuery) {
      loadMore();
    }
  }, [loadMore, loadingMore, hasMore, searchQuery]);

  const bgColor = isDark ? "#0F0D1A" : "#EDE3D6";
  const headerBg = isDark ? "#13101F" : "#A8784E";
  const iconColor = isDark ? "#F9FAFB" : "#3D2B1F";
  const accentColor = isDark ? "#C8A96E" : "#8B5A2B";

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: headerBg,
              borderBottomColor: isDark ? "#2C2840" : "#C19A6B",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.iconBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }]}
          >
            <ChevronLeft color={iconColor} size={22} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <BookOpen color={accentColor} size={18} />
            <Text style={[styles.headerTitle, { color: isDark ? "#F0E6D3" : "#3D2B1F" }]}>
              {categoryName}
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleSearch}
            style={[
              styles.iconBtn,
              {
                backgroundColor: searchVisible
                  ? accentColor + "28"
                  : isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            {searchVisible ? (
              <X color={accentColor} size={20} />
            ) : (
              <Search color={iconColor} size={20} />
            )}
          </TouchableOpacity>
        </View>

        {/* Animated search bar */}
        <Animated.View style={[searchBarStyle, { backgroundColor: isDark ? "#1A1630" : "#EDE3D6" }]}>
          <View style={styles.searchInputRow}>
            <Search size={16} color={isDark ? "#6B5F7A" : "#9C8878"} style={{ marginRight: 12 }} />
            <TextInput
              ref={searchInputRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="ابحث عن قصة..."
              placeholderTextColor={isDark ? "#5A4F6A" : "#B0967E"}
              style={[
                styles.searchInput,
                { color: isDark ? "#E8DDD0" : "#2C1810" },
              ]}
              textAlign="right"
              returnKeyType="search"
            />
          </View>
        </Animated.View>

        {/* Search no-results state */}
        {searchQuery.trim() !== "" && filteredStories.length === 0 && !loading ? (
          <View style={styles.centerContainer}>
            <Search color={isDark ? "#3D3D55" : "#C8B89A"} size={42} />
            <Text style={[styles.emptyText, { color: isDark ? "#6B6B8A" : "#9C8167" }]}>
              لا توجد نتائج لـ "{searchQuery}"
            </Text>
          </View>
        ) : loading ? (
          <FlatList
            data={Array(6).fill(null)}
            numColumns={2}
            keyExtractor={(_, i) => `sk-${i}`}
            contentContainerStyle={styles.listContent}
            renderItem={({ index }) => <SkeletonCard isDark={isDark} index={index} />}
            scrollEnabled={false}
          />
        ) : error ? (
          <ScrollView
            contentContainerStyle={styles.centerContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={accentColor}
              />
            }
          >
            <Text style={[styles.errorText, { color: isDark ? "#F87171" : "#C62828" }]}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={refresh}
              style={[styles.retryBtn, { backgroundColor: accentColor }]}
            >
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : stories.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.centerContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={accentColor} />
            }
          >
            <BookOpen color={isDark ? "#3D3D55" : "#C8B89A"} size={48} />
            <Text style={[styles.emptyText, { color: isDark ? "#6B6B8A" : "#9C8167" }]}>
              لا توجد قصص في هذا التصنيف حالياً
            </Text>
          </ScrollView>
        ) : (
          <FlatList
            data={filteredStories}
            keyExtractor={keyExtractor}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={accentColor}
              />
            }
            ListFooterComponent={
              !searchQuery ? (
                <ListFooter loadingMore={loadingMore} hasMore={hasMore} isDark={isDark} />
              ) : null
            }
            removeClippedSubviews={true}
            maxToRenderPerBatch={8}
            windowSize={10}
            initialNumToRender={6}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    paddingRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },
  searchInputRow: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 4,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontFamily: "Amiri_400Regular",
    writingDirection: "rtl",
    height: 52,
  },
  listContent: {
    paddingHorizontal: 0,
    paddingTop: 8,
    paddingBottom: 40,
  },
  skeleton: {
    margin: 8,
    borderRadius: 12,
    opacity: 0.6,
  },
  centerContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 15,
    textAlign: "center",
    writingDirection: "rtl",
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    writingDirection: "rtl",
    marginTop: 12,
    fontFamily: "Amiri_400Regular",
  },
  footerLoader: {
    paddingVertical: 24,
    alignItems: "center",
  },
  endContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 32,
    gap: 10,
  },
  endLine: {
    flex: 1,
    height: 1,
    opacity: 0.6,
  },
  endText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default StoriesScreen;
