import React, { useMemo } from 'react';
import {
  Image as NativeImage,
  type ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import { useAmbientLight } from '../hooks/useAmbientLight';
import type { AdaptiveLightImageProps } from '../types';
import { interpolateColor } from '../utils/interpolateColor';

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

  const tintColor = interpolateColor(luminosity, colors.dark, colors.light);

  const rotationStyle = {
    transform: [{ rotate: `${rotationAngle}deg` }],
  } as const;

  return (
    <View pointerEvents="none" style={styles.container}>
      <NativeImage
        source={resolveImageSource(sourcePath)}
        resizeMode={resizeMode}
        style={[styles.image, rotationStyle, { tintColor }]}
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
