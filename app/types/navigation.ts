import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Stories: { categoryId: string; categoryName: string };
  StoryDetails: { storyId: string };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
export type StoriesScreenProps = NativeStackScreenProps<RootStackParamList, "Stories">;
export type StoryDetailsScreenProps = NativeStackScreenProps<RootStackParamList, "StoryDetails">;
