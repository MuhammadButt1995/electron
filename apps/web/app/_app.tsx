import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

const SafeAppContents = ({ Component, pageProps }: AppProps) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  // Lock out users on old versions
  console.log('yerba version');
  console.log(window.yerba.version);
  if (window?.yerba?.version < 0.1) {
    return <div>Please update your app</div>;
  }

  // Lock out SSR and browser users
  if (typeof window === 'undefined' || !window?.yerba?.version) {
    return <div>Please use the app</div>;
  }

  // Only render if top two conditions pass
  return <Component {...pageProps} />;
};

const AppWrapper = (props: AppProps) => (
  <>
    <Head>
      <title>Yerba</title>
    </Head>
    <SafeAppContents {...props} />
  </>
);

export default AppWrapper;
