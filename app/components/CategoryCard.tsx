import React from "react";
import { TouchableOpacity, Text, View, ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Category } from "../types";

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  fullWidth?: boolean;
}

const categoryImages: Record<string, any> = {
  love: require("../../assets/categories/love.png"),
  horror: require("../../assets/categories/horror.png"),
  kids: require("../../assets/categories/kids.png"),
  "sci-fi": require("../../assets/categories/scifi.png"),
  thriller: require("../../assets/categories/thriller.png"),
  islamic: require("../../assets/categories/religious.png"),
  drama: require("../../assets/categories/drama.png"),
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress, fullWidth }) => {
  const imageSource = categoryImages[category.id];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className={`m-2 ${fullWidth ? "w-[96%]" : "flex-1"} h-52 rounded-3xl overflow-hidden`}
      onPress={onPress}
    >
      <ImageBackground
        source={imageSource}
        className="flex-1"
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.6)"]}
          style={styles.bottomGradient}
        >
          <Text style={{ writingDirection: "rtl" }} className="text-white text-xl font-extrabold text-center pb-4 px-2">
            {category.name}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%", // Only cover the bottom half to keep most of the image clear
    justifyContent: "flex-end",
  }
});

export default CategoryCard;
