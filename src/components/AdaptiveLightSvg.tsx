import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedProps,
} from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
import { useAmbientLight } from '../hooks/useAmbientLight';
import type { AdaptiveLightSvgProps } from '../types';

const AnimatedSvgUri = Animated.createAnimatedComponent(SvgUri);

export default function AdaptiveLightSvg({
  sourcePath,
  rotationAngle = 0,
  ...config
}: AdaptiveLightSvgProps) {
  const { luminosity } = useAmbientLight(config);

  const colors = useMemo(
    () => ({
      dark: '#FFFFFF',
      light: '#000000',
    }),
    []
  );

  const animatedProps = useAnimatedProps(() => {
    const color = interpolateColor(
      luminosity.value,
      [0, 1],
      [colors.dark, colors.light]
    );

    return {
      color,
      fill: color,
    } as Record<string, unknown>;
  });

  return (
    <View pointerEvents="none" style={styles.container}>
      <AnimatedSvgUri
        uri={sourcePath}
        animatedProps={animatedProps}
        width="100%"
        height="100%"
        style={{ transform: [{ rotate: `${rotationAngle}deg` }] }}
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
});
