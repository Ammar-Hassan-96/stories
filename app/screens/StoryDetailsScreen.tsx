import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { StoryDetailsScreenProps } from "../types/navigation";
import { useTheme } from "../services/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

// Utils
import {
  splitIntoPages,
  categoryAccent,
  defaultAccent,
} from "../utils/storyContentParser";

// Reader sub-components
import ReaderTopBar from "../components/reader/ReaderTopBar";
// import ReaderBottomBar from "../components/reader/ReaderBottomBar";
import BookFrame from "../components/reader/BookFrame";
import TitlePage from "../components/reader/TitlePage";
import ChapterPage from "../components/reader/ChapterPage";

/**
 * Story reader screen — displays the story as a vertical scrollable book.
 *
 * Architecture:
 *  ┌─────────────────────────────┐
 *  │  ReaderTopBar               │  ← back button + font controls
 *  ├─────────────────────────────┤
 *  │  Book body (ScrollView)     │  ← vertical scroll
 *  │    ┌───────────────────┐    │
 *  │    │  BookFrame overlay │    │  ← decorative border
 *  │    │  TitlePage         │    │  ← story cover
 *  │    │  ChapterPage (×N)  │    │  ← all chapters
 *  │    └───────────────────┘    │
 *  └─────────────────────────────┘
 */
const StoryDetailsScreen: React.FC<StoryDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { story } = route.params;
  const [fontSize, setFontSize] = useState(18);
  const { isDark } = useTheme();

  // ── Theme colors ──────────────────────────────────────────────
  const accent = categoryAccent[story.category_id] ?? defaultAccent;
  const bgColor = isDark ? "#08070A" : "#C19A6B";
  const pageBg = isDark ? "#121017" : "#cec1b6ff";
  const inkColor = isDark ? "#4A4550" : "#C19A6B";

  // ── Parse chapters ────────────────────────────────────────────
  const chapters = useMemo(() => {
    return splitIntoPages(story.content);
  }, [story.content]);

  // ── Font size controls ────────────────────────────────────────
  const incFontSize = useCallback(
    () => setFontSize((v) => Math.min(28, v + 1)),
    []
  );
  const decFontSize = useCallback(
    () => setFontSize((v) => Math.max(14, v - 1)),
    []
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <SafeAreaView style={{ flex: 1 }}>
        <ReaderTopBar
          fontSize={fontSize}
          isDark={isDark}
          onGoBack={() => navigation.goBack()}
          onIncrease={incFontSize}
          onDecrease={decFontSize}
        />

        {/* Book body */}
        <View style={[styles.physicalBook, { backgroundColor: pageBg }]}>
          <View
            style={[
              styles.bookBlockShadow,
              { backgroundColor: isDark ? "#050408" : "#B8B3A8" },
            ]}
          />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title / Cover section */}
            <TitlePage
              title={story.title}
              author={story.author}
              createdAt={story.created_at}
              imageUrl={story.image_url}
              fontSize={fontSize}
              isDark={isDark}
              pageBg={pageBg}
              accentColor={accent.primary}
            />

            {/* All chapters rendered vertically */}
            {chapters.map((chapter, index) => (
              <ChapterPage
                key={`chapter-${index}`}
                page={chapter}
                fontSize={fontSize}
                isDark={isDark}
                accentColor={accent.primary}
                isLastPage={index === chapters.length - 1}
              />
            ))}
          </ScrollView>

          <BookFrame inkColor={inkColor} pageBg={pageBg} />
        </View>

        {/* Bottom navigation bar — commented out for vertical scroll mode */}
        {/* <ReaderBottomBar
          currentPageIndex={currentPageIndex}
          totalPages={totalPages}
          isDark={isDark}
          accentColor={accent.primary}
          onNext={goNext}
          onPrev={goPrev}
        /> */}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  physicalBook: {
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 6,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  bookBlockShadow: {
    position: "absolute",
    top: 4,
    bottom: -4,
    left: -4,
    width: 12,
    borderRadius: 4,
    zIndex: -1,
  },
  scrollContent: {
    paddingHorizontal: 40,
    paddingTop: 36,
    paddingBottom: 40,
  },
});

export default StoryDetailsScreen;
