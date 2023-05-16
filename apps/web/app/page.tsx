'use client';

import useMounted from '@hooks/useMounted';

const Page = () => {
  const { mounted } = useMounted();
  return (
    <>
      <div className='p-4 text-2xl'>Hello World</div>
      <div>
        <span className='font-bold'>{'App version: '}</span>
        {mounted && window.app.version}
      </div>
    </>
  );
};

export default Page;
