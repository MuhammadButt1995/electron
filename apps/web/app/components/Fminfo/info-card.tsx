/* eslint-disable react/require-default-props */

import dayjs from 'dayjs';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import PopoverButton from '@/components/Fminfo/popover-button';

export type FminfoRating = 'loading' | 'ok' | 'warn' | 'error';

export type FminfoCardProps = {
  rating: FminfoRating;
  title: string;
  value: string;
  lastUpdated?: string;
  children?: React.ReactNode;
};

const InfoCard = ({
  rating,
  title,
  value,
  lastUpdated,
  children,
}: FminfoCardProps) => {
  const stateClasses = cn({
    'text-brand-teal': rating === 'ok',
    'text-brand-yellow': rating === 'warn',
    'text-brand-magenta': rating === 'error',
    '': rating === 'loading',
  });

  const bgClasses = cn({
    'bg-brand-teal/10': rating === 'ok',
    'bg-brand-yellow/10': rating === 'warn',
    'bg-brand-magenta/10': rating === 'error',
    '': rating === 'loading',
  });

  return (
    <Card className={`${bgClasses} shadow-xl`}>
      <div className='flex flex-row items-center justify-between p-4'>
        <p className='text-md font-semibold tracking-wide'>{title}</p>
        <PopoverButton>
          {children}
        </PopoverButton>
        
      </div>

      <div className='flex flex-row items-center justify-between px-4 pb-4'>
        <div className={`text-lg font-bold ${stateClasses}`}>{value}</div>

        {lastUpdated && (
          <p className='text-muted-foreground text-sm font-semibold'>
            {dayjs(lastUpdated).format('h:mm A')}
          </p>
        )}
      </div>
    </Card>
  );
};

export default InfoCard;
