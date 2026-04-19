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
import { Download, Trash2, Menu, HardDrive } from "lucide-react-native";
import { useTheme } from "../services/ThemeContext";
import { useOfflineStories } from "../hooks/useOffline";
import {
  OfflineStory,
  removeOfflineStory,
  formatBytes,
  clearOfflineStories,
} from "../services/offlineService";
import { AppDrawerNavigationProp } from "../types/navigation";
import StoryItem from "../components/StoryItem";

const { width: screenWidth } = Dimensions.get("window");
const columnWidth = screenWidth / 2;

const OfflineStoriesScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { stories, totalSize, loading, refresh } = useOfflineStories();
  const drawerNavigation = useNavigation<AppDrawerNavigationProp>();

  const bgColor = isDark ? "#0F0D1A" : "#EDE3D6";
  const headerBg = isDark ? "#13101F" : "#A8784E";
  const iconColor = isDark ? "#F9FAFB" : "#3D2B1F";
  const accentColor = isDark ? "#C8A96E" : "#8B5A2B";

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const handleDelete = useCallback(
    (story: OfflineStory) => {
      Alert.alert(
        "حذف من المحملة",
        `هل تريد حذف "${story.title}" من القصص المحملة؟`,
        [
          { text: "إلغاء", style: "cancel" },
          {
            text: "حذف",
            style: "destructive",
            onPress: async () => {
              await removeOfflineStory(story.id);
              refresh();
            },
          },
        ]
      );
    },
    [refresh]
  );

  const handleClearAll = useCallback(() => {
    if (stories.length === 0) return;
    Alert.alert(
      "حذف كل القصص المحملة",
      `سيتم حذف ${stories.length} قصة. هل أنت متأكد؟`,
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف الكل",
          style: "destructive",
          onPress: async () => {
            await clearOfflineStories();
            refresh();
          },
        },
      ]
    );
  }, [stories.length, refresh]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<OfflineStory>) => (
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
    [drawerNavigation, handleDelete]
  );

  const keyExtractor = useCallback((item: OfflineStory) => String(item.id), []);

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

          <View style={styles.titleRow}>
            <Download color={accentColor} size={18} />
            <Text style={[styles.title, { color: isDark ? "#F0E6D3" : "#3D2B1F" }]}>
              قصصي المحملة
            </Text>
          </View>

          {stories.length > 0 ? (
            <TouchableOpacity onPress={handleClearAll} style={styles.iconBtn}>
              <Trash2 color="#EF4444" size={18} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 38 }} />
          )}
        </View>

        {/* Storage info */}
        {stories.length > 0 && (
          <Animated.View
            entering={FadeIn.springify()}
            style={[
              styles.storageBanner,
              { backgroundColor: isDark ? "rgba(200,169,110,0.1)" : "rgba(139,90,43,0.08)" },
            ]}
          >
            <HardDrive color={accentColor} size={14} />
            <Text style={[styles.storageText, { color: isDark ? "#C8A96E" : "#8B5A2B" }]}>
              {stories.length} قصة · {formatBytes(totalSize)}
            </Text>
          </Animated.View>
        )}

        {/* List */}
        {stories.length === 0 && !loading ? (
          <View style={styles.empty}>
            <Download color={isDark ? "#3D3D55" : "#C8B89A"} size={56} />
            <Text style={[styles.emptyTitle, { color: isDark ? "#D4C8B5" : "#5C3D2E" }]}>
              لا توجد قصص محملة
            </Text>
            <Text style={[styles.emptyHint, { color: isDark ? "#6B6B8A" : "#9C8167" }]}>
              حمّل قصصك المفضلة للقراءة بدون إنترنت{"\n"}اضغط على زر التحميل داخل أي قصة
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
    paddingVertical: 10,
  },
  iconBtn: { padding: 8, borderRadius: 20 },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "Amiri_700Bold",
  },
  storageBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 10,
  },
  storageText: {
    fontSize: 12,
    fontWeight: "700",
    writingDirection: "rtl",
  },
  itemWrapper: {
    position: "relative",
  },
  deleteBtn: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  listContent: { paddingTop: 12, paddingBottom: 40 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 14,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Amiri_700Bold",
    writingDirection: "rtl",
    textAlign: "center",
    marginTop: 8,
  },
  emptyHint: {
    fontSize: 14,
    textAlign: "center",
    writingDirection: "rtl",
    fontFamily: "Amiri_400Regular",
    lineHeight: 22,
  },
});

export default OfflineStoriesScreen;
