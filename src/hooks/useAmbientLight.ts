import { useEffect, useState } from 'react';
import {
  NativeEventEmitter,
  type EmitterSubscription,
} from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import {
  AmbientLightSensor,
  isAmbientLightSensorAvailable,
} from '../native/android/AmbientLightSensor';
import type { AmbientLightConfig } from '../types';
import { normalizeLux } from '../utils/normalizeLux';

const DEFAULT_LUMINOSITY = 0.5;
const DEFAULT_DARK_THRESHOLD = 10;
const DEFAULT_BRIGHT_THRESHOLD = 50;
const DEFAULT_TRANSITION_DURATION = 1000;
const SENSOR_SAMPLE_INTERVAL_MS = 2000;
const MIN_LUMINOSITY_DELTA = 0.2;
const EVENT_NAME = 'AmbientLightSensorChanged';

type AmbientLightEvent = {
  illuminance: number;
};

export function useAmbientLight(config: AmbientLightConfig = {}) {
  const {
    darkThreshold = DEFAULT_DARK_THRESHOLD,
    brightThreshold = DEFAULT_BRIGHT_THRESHOLD,
    transitionDuration = DEFAULT_TRANSITION_DURATION,
    enabled = true,
    onLuxChange,
  } = config;

  const luminosity = useSharedValue(DEFAULT_LUMINOSITY);
  const [lux, setLux] = useState(0);

  useEffect(() => {
    if (!enabled || !AmbientLightSensor) {
      luminosity.value = DEFAULT_LUMINOSITY;
      setLux(0);
      return;
    }

    const emitter = new NativeEventEmitter(AmbientLightSensor);
    let subscription: EmitterSubscription | undefined;
    let lastProcessedAt = 0;
    let lastNormalized = DEFAULT_LUMINOSITY;

    subscription = emitter.addListener(
      EVENT_NAME,
      ({ illuminance }: AmbientLightEvent) => {
        const now = Date.now();
        if (now - lastProcessedAt < SENSOR_SAMPLE_INTERVAL_MS) {
          return;
        }

        const normalized = normalizeLux(
          illuminance,
          darkThreshold,
          brightThreshold
        );
        const delta = Math.abs(normalized - lastNormalized);

        if (delta < MIN_LUMINOSITY_DELTA) {
          return;
        }

        lastProcessedAt = now;
        lastNormalized = normalized;
        setLux(illuminance);
        onLuxChange?.(illuminance);

        luminosity.value = withTiming(normalized, {
          duration: transitionDuration,
        });
      }
    );

    AmbientLightSensor.start();

    return () => {
      subscription?.remove();
      AmbientLightSensor.stop();
    };
  }, [
    brightThreshold,
    darkThreshold,
    enabled,
    luminosity,
    onLuxChange,
    transitionDuration,
  ]);

  return {
    luminosity,
    lux,
    isSensorAvailable: isAmbientLightSensorAvailable,
  };
}
