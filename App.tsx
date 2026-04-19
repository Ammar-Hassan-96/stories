import "react-native-gesture-handler";
import "./global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { View, ActivityIndicator, I18nManager } from "react-native";
import { useFonts } from "expo-font";
import { Amiri_400Regular, Amiri_700Bold } from "@expo-google-fonts/amiri";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "./app/services/ThemeContext";
import HomeScreen from "./app/screens/HomeScreen";
import StoriesScreen from "./app/screens/StoriesScreen";
import StoryDetailsScreen from "./app/screens/StoryDetailsScreen";
import { RootStackParamList } from "./app/types/navigation";
import { StatusBar } from "expo-status-bar";
import { createDrawerNavigator } from "@react-navigation/drawer";
import PrivacyPolicyScreen from "./app/screens/PrivacyPolicyScreen";
import ContactUsScreen from "./app/screens/ContactUsScreen";
import BookmarksScreen from "./app/screens/BookmarksScreen";
import SearchScreen from "./app/screens/SearchScreen";
import DrawerContent from "./app/components/DrawerContent";
import { RootDrawerParamList } from "./app/types/navigation";

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Stories" component={StoriesScreen} />
      <Stack.Screen name="StoryDetails" component={StoryDetailsScreen} />
    </Stack.Navigator>
  );
};



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
      <StatusBar style={isDark ? "light" : "dark"} />
      <Drawer.Navigator
        screenOptions={{ headerShown: false, drawerPosition: "right" }}
        drawerContent={(props) => <DrawerContent {...props} />}
        id={undefined}
      >
        <Drawer.Screen name="HomeStack" component={HomeStack} />
        <Drawer.Screen name="Bookmarks" component={BookmarksScreen} />
        <Drawer.Screen name="Search" component={SearchScreen} />
        <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Drawer.Screen name="ContactUs" component={ContactUsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F5EFE6" }}>
            <ActivityIndicator size="large" color="#8B5A2B" />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
