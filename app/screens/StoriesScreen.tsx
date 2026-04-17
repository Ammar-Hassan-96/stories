import React, { useCallback, memo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";
import { StoriesScreenProps } from "../types/navigation";
import { Story } from "../types";
import StoryItem from "../components/StoryItem";
import { ChevronLeft, BookOpen } from "lucide-react-native";
import { useTheme } from "../services/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStories } from "../hooks/useStories";

const { width: screenWidth } = Dimensions.get("window");
const columnWidth = screenWidth / 2;

// Skeleton card for loading state
const SkeletonCard = memo(({ isDark }: { isDark: boolean }) => (
  <View
    style={[
      styles.skeleton,
      {
        width: columnWidth - 16,
        height: (columnWidth - 16) * 1.45,
        backgroundColor: isDark ? "#1E1A2E" : "#EDE0D4",
      },
    ]}
  />
));

// Footer loader shown while fetching next page
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
  const { stories, loading, loadingMore, hasMore, error, loadMore, refresh } =
    useStories(categoryId);

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
    if (!loadingMore && hasMore) {
      loadMore();
    }
  }, [loadMore, loadingMore, hasMore]);

  const bgColor = isDark ? "#0F0D1A" : "#F8F4EE";
  const headerBg = isDark ? "#13101F" : "#FAF6F0";

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: isDark ? "#2C2840" : "#E5D5C5" }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }]}
          >
            <ChevronLeft color={isDark ? "#F9FAFB" : "#3D2B1F"} size={22} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <BookOpen color={isDark ? "#C8A96E" : "#8B5A2B"} size={18} />
            <Text style={[styles.headerTitle, { color: isDark ? "#F0E6D3" : "#3D2B1F" }]}>
              {categoryName}
            </Text>
          </View>
        </View>

        {/* Loading skeletons */}
        {loading ? (
          <FlatList
            data={Array(6).fill(null)}
            numColumns={2}
            keyExtractor={(_, i) => `sk-${i}`}
            contentContainerStyle={styles.listContent}
            renderItem={() => <SkeletonCard isDark={isDark} />}
            scrollEnabled={false}
          />
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.errorText, { color: isDark ? "#F87171" : "#C62828" }]}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={refresh}
              style={[styles.retryBtn, { backgroundColor: isDark ? "#C8A96E" : "#8B5A2B" }]}
            >
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        ) : stories.length === 0 ? (
          <View style={styles.centerContainer}>
            <BookOpen color={isDark ? "#3D3D55" : "#C8B89A"} size={48} />
            <Text style={[styles.emptyText, { color: isDark ? "#6B6B8A" : "#9C8167" }]}>
              لا توجد قصص في هذا التصنيف حالياً
            </Text>
          </View>
        ) : (
          <FlatList
            data={stories}
            keyExtractor={keyExtractor}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refresh}
                tintColor={isDark ? "#C8A96E" : "#8B5A2B"}
              />
            }
            ListFooterComponent={
              <ListFooter
                loadingMore={loadingMore}
                hasMore={hasMore}
                isDark={isDark}
              />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: "row",
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
    flex: 1,
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
