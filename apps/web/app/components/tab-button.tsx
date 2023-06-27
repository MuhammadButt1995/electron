/* eslint-disable arrow-body-style */

'use client';

import { CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/components/lib/utils';

type TabContentProps = {
  title: string;
  statuses: string[];
};

const TabButton = ({ title, statuses }: TabContentProps) => {
  const allConnected = statuses.every(
    (status) =>
      status === 'CONNECTED' ||
      status === 'RELIABLE' ||
      status === 'LOW' ||
      parseInt(status.split(' ')[0], 10) >= 7
  );
  const dynamicClasses = cn({
    'text-brand-green-700 dark:text-brand-green-500': allConnected === true,
    'text-brand-yellow-700 dark:text-brand-yellow-500': allConnected === false,
  });

  return (
    <div className='flex flex-row'>
      {title}
      <div className={`${dynamicClasses}`}>
        {allConnected ? (
          <CheckCircle className='ml-1 h-2 w-2' />
        ) : (
          <AlertTriangle className='ml-1 h-2 w-2' />
        )}
      </div>
    </div>
  );
};

export default TabButton;
