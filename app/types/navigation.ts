import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { NavigatorScreenParams } from "@react-navigation/native";
import { Story } from "./index";

export type RootDrawerParamList = {
  HomeStack: NavigatorScreenParams<RootStackParamList> | undefined;
  PrivacyPolicy: undefined;
  ContactUs: undefined;
  Bookmarks: undefined;
  Search: undefined;
  Stats: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Stories: { categoryId: string; categoryName: string };
  StoryDetails: { story: Story };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type StoriesScreenProps = NativeStackScreenProps<RootStackParamList, "Stories">;
export type StoryDetailsScreenProps = NativeStackScreenProps<RootStackParamList, "StoryDetails">;

// Type for accessing drawer from anywhere
export type AppDrawerNavigationProp = DrawerNavigationProp<RootDrawerParamList>;
