/* eslint-disable react/jsx-no-useless-fragment */

'use client';

import useMounted from '@hooks/useMounted';
import AppShell from '@components/AppShell';

const Page = () => {
  const { mounted } = useMounted();
  return (
    <>
      <AppShell />
    </>
  );
};

export default Page;
