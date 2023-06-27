/* eslint-disable react/require-default-props */
import { Signal } from 'lucide-react';
import { WiFiState } from '@/store/wifi-assistant-store';
import { cn } from '@/components/lib/utils';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';

type WiFiAssistantCardProps = {
  state: WiFiState['status'];
  data: WiFiState['data'];
  description: string;
  children?: React.ReactNode;
  lastUpdated: string;
};

const WiFiAssistantCard = ({
  state,
  data,
  description,
  children,
  lastUpdated,
}: WiFiAssistantCardProps) => {
  const dynamicClasses = cn({
    'text-brand-green-700 dark:text-brand-green-500': state === 'RELIABLE',
    'text-brand-yellow-700 dark:text-brand-yellow-500': state === 'DECENT',
    'text-brand-magenta-800 dark:text-brand-magenta-600': state === 'SLOW',
  });

  return (
    <Card className='relative'>
      <CardHeader>
        <div
          className={`flex flex-row items-center justify-between ${dynamicClasses}`}
        >
          <CardDescription className='text-xs'>WI-FI SIGNAL</CardDescription>
          <Signal className='mr-2 h-4 w-4' />
        </div>

        <div className='flex flex-col items-start justify-start space-y-1'>
          <div className={`text-sm font-bold ${dynamicClasses}`}>{state}</div>
          <p className='text-muted-foreground w-7/12 text-xs'>{description}</p>
        </div>

        <div>
          <p className='text-foreground text-xs'>
            Signal Strength: {data.signal}
          </p>
          <p className='text-foreground text-xs'>
            Radio Type: {data.radioType}
          </p>
          <p className='text-foreground text-xs'>Channel: {data.channel}</p>
        </div>

        <p className='text-muted-foreground text-xs'>Updated: {lastUpdated}</p>
      </CardHeader>
      {state !== 'ERROR' && children}
    </Card>
  );
};

export default WiFiAssistantCard;
