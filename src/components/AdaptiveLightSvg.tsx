import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useAmbientLight } from '../hooks/useAmbientLight';
import type { AdaptiveLightSvgProps } from '../types';
import { interpolateColor } from '../utils/interpolateColor';

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

  const color = interpolateColor(luminosity, colors.dark, colors.light);

  return (
    <View pointerEvents="none" style={styles.container}>
      <SvgUri
        uri={sourcePath}
        color={color}
        fill={color}
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
