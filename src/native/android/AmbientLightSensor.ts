import { NativeModules, Platform } from 'react-native';

export type AmbientLightSensorModule = {
  start: () => void;
  stop: () => void;
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
};

export const AmbientLightSensor = NativeModules.AmbientLightSensor as
  | AmbientLightSensorModule
  | undefined;

export const isAmbientLightSensorAvailable =
  Platform.OS === 'android' && !!AmbientLightSensor;
