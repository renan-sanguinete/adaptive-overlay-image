import React, { useMemo } from 'react';
import {
  Image as NativeImage,
  type ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { useAmbientLight } from '../hooks/useAmbientLight';
import type { AdaptiveLightImageProps } from '../types';

const AnimatedImage = Animated.createAnimatedComponent(NativeImage);

function resolveImageSource(sourcePath: string | ImageSourcePropType) {
  if (typeof sourcePath === 'string') {
    return { uri: sourcePath };
  }

  return sourcePath;
}

export default function AdaptiveLightImage({
  sourcePath,
  resizeMode = 'contain',
  rotationAngle = 0,
  ...config
}: AdaptiveLightImageProps) {
  const { luminosity } = useAmbientLight(config);

  const colors = useMemo(
    () => ({
      dark: '#FFFFFF',
      light: '#000000',
    }),
    []
  );

  const imageStyle = useAnimatedStyle(() => ({
    tintColor: interpolateColor(
      luminosity.value,
      [0, 1],
      [colors.dark, colors.light]
    ),
  }));

  const rotationStyle = {
    transform: [{ rotate: `${rotationAngle}deg` }],
  } as const;

  return (
    <View pointerEvents="none" style={styles.container}>
      <AnimatedImage
        source={resolveImageSource(sourcePath)}
        resizeMode={resizeMode}
        style={[styles.image, rotationStyle, imageStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});
