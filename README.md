# Adaptive Overlay Image

Lib React Native para adaptar a aparência de imagens e SVGs de acordo com a luz ambiente no Android.

## O que já vem pronto

- Módulo nativo Android `AmbientLightSensor` com `start`, `stop`, `addListener` e `removeListeners`
- Hook `useAmbientLight` com normalização de lux e suavização em JS, sem `react-native-reanimated`
- Componentes `AdaptiveLightImage`, `AdaptiveLightSvg` e `AdaptiveLightOverlay`
- Estrutura inicial de `example/` para validação em dispositivo real

## Uso

```ts
import { AdaptiveLightOverlay } from 'adaptive-overlay-image';

export function Screen() {
  return (
    <AdaptiveLightOverlay
      type="image"
      sourcePath={{ uri: 'https://example.com/overlay.png' }}
      enabled
    />
  );
}
```

## Observações

- A leitura do sensor só faz sentido no Android.
- A lib não depende de `react-native-reanimated`/`worklets`; a transição é feita em JS.
- Para SVG, o arquivo precisa respeitar `color`/`fill` para refletir bem a adaptação.
- O `sourcePath` pode ser uma `uri` remota ou um `ImageSourcePropType` para imagens.
