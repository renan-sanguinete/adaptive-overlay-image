import type { ImageSourcePropType } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export type AmbientLightState = {
  lux: number;
  luminosity: SharedValue<number>;
  isSensorAvailable: boolean;
};

export type AmbientLightConfig = {
  darkThreshold?: number;
  brightThreshold?: number;
  transitionDuration?: number;
  enabled?: boolean;
  onLuxChange?: (lux: number) => void;
};

export type AdaptiveLightBaseProps = AmbientLightConfig & {
  rotationAngle?: number;
};

export type AdaptiveLightImageProps = AdaptiveLightBaseProps & {
  sourcePath: string | ImageSourcePropType;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center' | 'repeat';
};

export type AdaptiveLightSvgProps = AdaptiveLightBaseProps & {
  sourcePath: string;
};

export type AdaptiveLightOverlayProps =
  | (AdaptiveLightImageProps & { type?: 'image' })
  | (AdaptiveLightSvgProps & { type: 'svg' });
