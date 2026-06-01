export { default as AdaptiveLightImage } from './components/AdaptiveLightImage';
export { default as AdaptiveLightOverlay } from './components/AdaptiveLightOverlay';
export { default as AdaptiveLightSvg } from './components/AdaptiveLightSvg';
export { useAmbientLight } from './hooks/useAmbientLight';
export type {
  AdaptiveLightImageProps,
  AdaptiveLightOverlayProps,
  AdaptiveLightSvgProps,
  AmbientLightConfig,
  AmbientLightState,
} from './types';

import AdaptiveLightImage from './components/AdaptiveLightImage';
import AdaptiveLightOverlay from './components/AdaptiveLightOverlay';
import AdaptiveLightSvg from './components/AdaptiveLightSvg';
import { useAmbientLight } from './hooks/useAmbientLight';

export default {
  AdaptiveLightImage,
  AdaptiveLightOverlay,
  AdaptiveLightSvg,
  useAmbientLight,
};
