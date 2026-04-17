import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";

export type RootDrawerParamList = {
  HomeStack: undefined;
  PrivacyPolicy: undefined;
  ContactUs: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Stories: { categoryId: string; categoryName: string };
  StoryDetails: { storyId: string };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type StoriesScreenProps = NativeStackScreenProps<RootStackParamList, "Stories">;
export type StoryDetailsScreenProps = NativeStackScreenProps<RootStackParamList, "StoryDetails">;

// Type for accessing drawer from anywhere
export type AppDrawerNavigationProp = DrawerNavigationProp<RootDrawerParamList>;
