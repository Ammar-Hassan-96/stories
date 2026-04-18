import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  ListRenderItemInfo,
  Dimensions,
  RefreshControl,
} from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Bookmark, Trash2, Menu } from "lucide-react-native";
import { useTheme } from "../services/ThemeContext";
import { useBookmarks } from "../hooks/useBookmarks";
import { BookmarkedStory, removeBookmark } from "../services/bookmarkService";
import { AppDrawerNavigationProp } from "../types/navigation";
import StoryItem from "../components/StoryItem";

const { width: screenWidth } = Dimensions.get("window");
const columnWidth = screenWidth / 2;

const BookmarksScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { bookmarks, loading, refresh } = useBookmarks();
  const drawerNavigation = useNavigation<AppDrawerNavigationProp>();

  const bgColor = isDark ? "#0F0D1A" : "#EDE3D6";
  const headerBg = isDark ? "#13101F" : "#A8784E";
  const iconColor = isDark ? "#F9FAFB" : "#3D2B1F";
  const accentColor = isDark ? "#C8A96E" : "#8B5A2B";

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const handleDelete = useCallback(
    (story: BookmarkedStory) => {
      Alert.alert(
        "حذف من المفضلة",
        `هل تريد حذف "${story.title}" من المفضلة؟`,
        [
          { text: "إلغاء", style: "cancel" },
          {
            text: "حذف",
            style: "destructive",
            onPress: async () => {
              await removeBookmark(story.id);
              refresh();
            },
          },
        ]
      );
    },
    [refresh]
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<BookmarkedStory>) => (
      <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
        <View style={styles.itemWrapper}>
          <StoryItem
            story={item}
            width={columnWidth}
            onPress={() =>
              drawerNavigation.navigate("HomeStack", {
                screen: "StoryDetails",
                params: { story: item },
              })
            }
          />
          <TouchableOpacity
            style={[styles.deleteBtn, { backgroundColor: "rgba(220,38,38,0.85)" }]}
            onPress={() => handleDelete(item)}
          >
            <Trash2 size={13} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    ),
    [handleDelete, drawerNavigation]
  );

  const keyExtractor = useCallback((item: BookmarkedStory) => String(item.id), []);

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.header, { backgroundColor: headerBg }]}>
          <TouchableOpacity
            onPress={() => drawerNavigation.openDrawer()}
            style={[styles.iconBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }]}
          >
            <Menu color={iconColor} size={22} />
          </TouchableOpacity>

          <View style={styles.headerTitle}>
            <Bookmark color={accentColor} size={18} />
            <Text style={[styles.headerTitleText, { color: isDark ? "#F0E6D3" : "#3D2B1F" }]}>
              المفضلة
            </Text>
          </View>

          <Text style={[styles.countBadge, { color: accentColor }]}>
            {bookmarks.length} قصة
          </Text>
        </View>

        {loading ? null : bookmarks.length === 0 ? (
          <Animated.View entering={FadeIn} style={styles.emptyContainer}>
            <Bookmark color={isDark ? "#3D3D55" : "#C8B89A"} size={56} />
            <Text style={[styles.emptyTitle, { color: isDark ? "#E8DDD0" : "#5C3D2E", fontFamily: "Amiri_700Bold" }]}>
              لا توجد قصص محفوظة
            </Text>
            <Text style={[styles.emptySubtitle, { color: isDark ? "#6B6B8A" : "#9C8167" }]}>
              احفظ قصصك المفضلة وستظهر هنا
            </Text>
          </Animated.View>
        ) : (
          <FlatList
            data={bookmarks}
            keyExtractor={keyExtractor}
            numColumns={2}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={accentColor} />
            }
          />
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
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  iconBtn: { padding: 8, borderRadius: 20 },
  headerTitle: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: "800",
    writingDirection: "rtl",
  },
  countBadge: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Amiri_400Regular",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 22,
    textAlign: "center",
    writingDirection: "rtl",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    writingDirection: "rtl",
    fontFamily: "Amiri_400Regular",
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  itemWrapper: {
    position: "relative",
  },
  deleteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});

export default BookmarksScreen;
