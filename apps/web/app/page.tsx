'use client';

import useMounted from './hooks/useMounted';

const Page = () => {
  const { mounted } = useMounted();
  return (
    <>
      <div className="bg-red-400">pawwge</div>
      <div>
        <span className="font-bold">{'Yerba version: '}</span>
        {mounted && window.yerba.version}
      </div>
    </>
  );
};

export default Page;
