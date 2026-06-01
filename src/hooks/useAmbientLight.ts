import { useEffect, useRef, useState } from 'react';
import {
  NativeEventEmitter,
  type EmitterSubscription,
} from 'react-native';
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

  const [lux, setLux] = useState(0);
  const [luminosity, setLuminosity] = useState(DEFAULT_LUMINOSITY);
  const currentLuminosityRef = useRef(DEFAULT_LUMINOSITY);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !AmbientLightSensor) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      currentLuminosityRef.current = DEFAULT_LUMINOSITY;
      setLuminosity(DEFAULT_LUMINOSITY);
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

        if (transitionDuration <= 0) {
          currentLuminosityRef.current = normalized;
          setLuminosity(normalized);
          return;
        }

        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        const fromValue = currentLuminosityRef.current;
        const startTime = Date.now();

        const step = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(1, elapsed / transitionDuration);
          const nextValue =
            fromValue + (normalized - fromValue) * progress;

          currentLuminosityRef.current = nextValue;
          setLuminosity(nextValue);

          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(step);
          } else {
            animationFrameRef.current = null;
          }
        };

        animationFrameRef.current = requestAnimationFrame(step);
      }
    );

    AmbientLightSensor.start();

    return () => {
      subscription?.remove();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      AmbientLightSensor.stop();
    };
  }, [
    brightThreshold,
    darkThreshold,
    enabled,
    onLuxChange,
    transitionDuration,
  ]);

  return {
    luminosity,
    lux,
    isSensorAvailable: isAmbientLightSensorAvailable,
  };
}
