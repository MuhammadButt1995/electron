/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable arrow-body-style */

import { cn } from './components/lib/utils';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { ConnectionState } from './store/connection-store';

type ConnectionCardProps = {
  state: ConnectionState['status'];
  title: string;
  icon: React.ReactNode;
  description: string;
};

const ConnectionCard = ({
  state,
  title,
  icon,
  description,
}: ConnectionCardProps) => {
  const dynamicClasses = cn({
    'text-brand-green-700 dark:text-brand-green-500': state === 'CONNECTED',
    'text-brand-yellow-700 dark:text-brand-yellow-500':
      state === 'NOT CONNECTED',
    'text-brand-magenta-800 dark:text-brand-magenta-600': state === 'ERROR',
  });

  return (
    <Card>
      <CardHeader>
        <div
          className={`flex flex-row items-center justify-between ${dynamicClasses}`}
        >
          <CardDescription className='text-xs'>{title}</CardDescription>
          {icon}
        </div>

        <div className='flex flex-col items-start justify-start space-y-1'>
          <div className={`text-sm font-bold ${dynamicClasses}`}>{state}</div>
          <p className='text-muted-foreground text-xs'>{description}</p>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ConnectionCard;
