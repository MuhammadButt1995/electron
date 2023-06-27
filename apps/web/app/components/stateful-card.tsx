/* eslint-disable react/require-default-props */
import dayjs from 'dayjs';
import { RefreshCw } from 'lucide-react';
import { ConnectionState } from '@/store/connection-store';
import { WiFiState } from '@/store/wifi-assistant-store';
import { cn } from '@/components/lib/utils';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from './ui/button';

type StatefulCardProps = {
  state: ConnectionState['status'] | WiFiState['status'] | string;
  title: string;
  icon: React.ReactNode;
  description: string;
  children?: React.ReactNode;
  lastUpdated?: string;
};

const StatefulCard = ({
  state,
  title,
  icon,
  description,
  children,
  lastUpdated,
}: StatefulCardProps) => {
  const dynamicClasses = cn({
    'text-brand-green-700 dark:text-brand-green-500':
      state === 'CONNECTED' ||
      state === 'RELIABLE' ||
      parseInt(state.split(' ')[0], 10) >= 7 ||
      state === 'LOW',
    'text-brand-yellow-700 dark:text-brand-yellow-500':
      state === 'NOT CONNECTED' ||
      state === 'DECENT' ||
      (parseInt(state.split(' ')[0], 10) < 7 &&
        parseInt(state.split(' ')[0], 10) >= 3) ||
      state === 'MEDIUM',
    'text-brand-magenta-800 dark:text-brand-magenta-600':
      state === 'ERROR' ||
      state === 'SLOW' ||
      parseInt(state.split(' ')[0], 10) < 3 ||
      state.split(' ')[0] === 'Today' ||
      state === 'HIGH',
  });

  return (
    <Card className='relative'>
      <CardHeader>
        <div
          className={`flex flex-row items-center justify-between ${dynamicClasses}`}
        >
          <CardDescription className='text-xs'>{title}</CardDescription>
          {icon}
        </div>

        <div className='flex flex-col items-start justify-start space-y-1'>
          <div className={`text-sm font-bold ${dynamicClasses}`}>{state}</div>
          <p className='text-muted-foreground w-7/12 text-xs'>{description}</p>
        </div>

        {lastUpdated && (
          <p className='text-muted-foreground text-xs'>
            Updated: {lastUpdated}
          </p>
        )}
      </CardHeader>
      {state !== 'ERROR' && children}
    </Card>
  );
};

export default StatefulCard;
