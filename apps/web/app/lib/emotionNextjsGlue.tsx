import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useGluedEmotionCache = (key = 'emotion') => {
  const [cache] = useState(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const cache = createCache({ key });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const entries = Object.entries(cache.inserted);
    if (entries.length === 0) return null;
    const names = entries
      .map(([n]) => n)
      .filter((n) => typeof n === 'string')
      .join(' ');
    const styles = entries.map(([, s]) => s).join('\n');
    const emotionKey = `${key} ${names}`;
    return (
      <style
        data-emotion={emotionKey}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return cache;
};
