import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
  AdaptiveLightImage,
  AdaptiveLightOverlay,
  AdaptiveLightSvg,
  useAmbientLight,
} from '../src';

const SAMPLE_IMAGE = {
  uri: 'https://example.com/overlay.png',
};

export default function App() {
  const { luminosity, isSensorAvailable } = useAmbientLight({ enabled: false });

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Adaptive Overlay Example</Text>
      <Text style={styles.subtitle}>
        Sensor disponível: {isSensorAvailable ? 'sim' : 'não'}
      </Text>
      <Text style={styles.subtitle}>
        Luminosidade: {luminosity.value.toFixed(2)}
      </Text>
      <View style={styles.preview}>
        <AdaptiveLightImage sourcePath={SAMPLE_IMAGE} enabled={false} />
      </View>
      <View style={styles.preview}>
        <AdaptiveLightSvg sourcePath="https://example.com/overlay.svg" enabled={false} />
      </View>
      <View style={styles.preview}>
        <AdaptiveLightOverlay
          type="image"
          sourcePath={SAMPLE_IMAGE}
          enabled={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
  },
  preview: {
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111111',
  },
});
