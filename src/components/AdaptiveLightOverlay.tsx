import React from 'react';
import AdaptiveLightImage from './AdaptiveLightImage';
import AdaptiveLightSvg from './AdaptiveLightSvg';
import type {
  AdaptiveLightImageProps,
  AdaptiveLightOverlayProps,
  AdaptiveLightSvgProps,
} from '../types';

export default function AdaptiveLightOverlay(props: AdaptiveLightOverlayProps) {
  if (props.type === 'svg') {
    return <AdaptiveLightSvg {...(props as AdaptiveLightSvgProps)} />;
  }

  return <AdaptiveLightImage {...(props as AdaptiveLightImageProps)} />;
}
