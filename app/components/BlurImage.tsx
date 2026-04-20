import React, { useState, useRef, useCallback, memo } from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { useTheme } from "../services/ThemeContext";
import { imageMap } from "../utils/imageMap";

interface BlurImageProps {
  uri: string | null | undefined;
  style?: ViewStyle | ImageStyle;
  width?: number;
  height?: number;
  borderRadius?: number;
  resizeMode?: "cover" | "contain" | "stretch" | "center";
}

const BlurImage: React.FC<BlurImageProps> = ({
  uri,
  style,
  width,
  height,
  borderRadius = 0,
  resizeMode = "cover",
}) => {
  const { isDark } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Two animated values: blurred thumbnail fades out, sharp image fades in
  const blurOpacity = useRef(new Animated.Value(1)).current;
  const sharpOpacity = useRef(new Animated.Value(0)).current;

  const onLoad = useCallback(() => {
    setIsLoaded(true);
    Animated.parallel([
      Animated.timing(sharpOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(blurOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [sharpOpacity, blurOpacity]);

  const onError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
    Animated.timing(blurOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [blurOpacity]);

  const placeholder = isDark ? "#2C2C3E" : "#E8E0D5";
  const shimmer = isDark ? "#3D3D55" : "#D5C8BC";

  const containerStyle: ViewStyle = {
    width,
    height,
    borderRadius,
    overflow: "hidden",
    backgroundColor: placeholder,
    ...(style as ViewStyle),
  };

  const imageStyle: ImageStyle = {
    ...StyleSheet.absoluteFillObject,
    borderRadius,
  };

  // Show placeholder if no URI or error
  if (!uri || hasError) {
    return (
      <View style={containerStyle}>
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: shimmer, borderRadius },
          ]}
        />
      </View>
    );
  }

  // Use require() mapping if it's a known offline image, otherwise treat as URL
  const imageSource = uri && imageMap[uri] ? imageMap[uri] : { uri };

  return (
    <View style={containerStyle}>
      {/* Shimmer placeholder background */}
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: placeholder, borderRadius }]}
      />

      {/* Blurred version shown while loading */}
      <Animated.Image
        source={imageSource}
        style={[imageStyle, { opacity: blurOpacity }]}
        blurRadius={25}
        resizeMode={resizeMode}
      />

      {/* Sharp version that fades in on load */}
      <Animated.Image
        source={imageSource}
        style={[imageStyle, { opacity: sharpOpacity }]}
        resizeMode={resizeMode}
        onLoad={onLoad}
        onError={onError}
      />
    </View>
  );
};

export default memo(BlurImage);
