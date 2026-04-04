import "./global.css";
import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "./app/services/ThemeContext";
import HomeScreen from "./app/screens/HomeScreen";
import StoriesScreen from "./app/screens/StoriesScreen";
import StoryDetailsScreen from "./app/screens/StoryDetailsScreen";
import { RootStackParamList } from "./app/types/navigation";
import { StatusBar } from "expo-status-bar";
import { I18nManager } from "react-native";
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const { isDark } = useTheme();

  const themeColors = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#F9FAFB",
    },
  };

  const darkThemeColors = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#111827",
    },
  };

  return (
    <NavigationContainer theme={isDark ? darkThemeColors : themeColors}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Stories" component={StoriesScreen} />
        <Stack.Screen name="StoryDetails" component={StoryDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Navigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
