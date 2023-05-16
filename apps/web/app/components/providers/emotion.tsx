'use client';

import { useGluedEmotionCache } from '@lib//emotionNextjsGlue';
import { CacheProvider } from '@emotion/react';
import { MantineProvider } from '@mantine/core';

// eslint-disable-next-line react/function-component-definition
export default function EmotionProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const cache = useGluedEmotionCache();
  return (
    <CacheProvider value={cache}>
      {/* You can wrap ColorSchemeProvider right here but skipping that for brevity ;) */}
      <MantineProvider withGlobalStyles withNormalizeCSS emotionCache={cache}>
        {children}
      </MantineProvider>
    </CacheProvider>
  );
}
