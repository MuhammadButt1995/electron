'use client';

import { CacheProvider } from '@emotion/react';
import { useEmotionCache, MantineProvider } from '@mantine/core';
import { useServerInsertedHTML } from 'next/navigation';

// eslint-disable-next-line react/function-component-definition
export default function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: 'sans-serif',
          primaryShade: 2,
          primaryColor: 'brand-blue',
          colorScheme: 'dark',
          black: '121212',
          colors: {
            'brand-blue': [
              '#509ED5',
              '#1C6FA3',
              '#085280',
              '#063C5E',
              '#05314D',
            ],
            'brand-teal': [
              '#8DE1E2',
              '#5DC7D0',
              '#238196',
              '#026C84',
              '#005065',
            ],
            'brand-orange': [
              '#FF9C66',
              '#E66E39',
              '#C55422',
              '#B34718',
              '#8F2400',
            ],
            'brand-yellow': [
              '#FFD260',
              '#FFC13B',
              '#FFB400',
              '#EE9B09',
              '#CA7C1D',
            ],
            'brand-green': [
              '#71A679',
              '#418152',
              '#2C6937',
              '#2559C2',
              '#1C4621',
            ],
            'brand-magenta': [
              '#F29AC9',
              '#C44786',
              '#911A5B',
              '#761148',
              '#5A0030',
            ],
          },
        }}
      >
        {children}
      </MantineProvider>
    </CacheProvider>
  );
}
