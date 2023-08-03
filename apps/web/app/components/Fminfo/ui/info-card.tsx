/* eslint-disable react/require-default-props */

import dayjs from 'dayjs';
import { CalendarIcon } from '@radix-ui/react-icons';
import { RefreshCw } from 'lucide-react';

import { cn } from '@/lib/utils';

import InfoCardPopoverSkeleton from '@/components/fminfo/ui/info-card-popover-skeleton';
import InfoCardBadge from '@/components/fminfo/ui/info-card-badge';
import PopoverButton from '@/components/fminfo/ui/popover-button';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export type FminfoRating = 'loading' | 'ok' | 'warn' | 'error';

export type CardClasses = {
  foreground: string;
  background: string;
};

export type InfoCardProps = {
  rating: FminfoRating;
  title: string;
  value: string;
  lastUpdated?: string;
  isLoading?: boolean;
  refreshRate?: string;
  children?: React.ReactNode;
};

const InfoCard = ({
  rating,
  title,
  value,
  lastUpdated,
  isLoading,
  children,
  refreshRate,
}: InfoCardProps) => {
  const cardClasses = {
    foreground: cn({
      'text-brand-teal': rating === 'ok',
      'text-brand-yellow': rating === 'warn',
      'text-brand-magenta': rating === 'error',
      '': rating === 'loading',
    }),

    background: cn({
      'bg-brand-teal/10 dark:bg-brand-teal/20': rating === 'ok',
      'bg-brand-yellow/10 dark:bg-brand-yellow/20': rating === 'warn',
      'bg-brand-magenta/10 dark:bg-brand-magenta/20': rating === 'error',
      '': rating === 'loading',
    }),
  };

  return (
    <Card className={`${cardClasses.background} shadow-xl`}>
      <div className='flex flex-row items-center justify-between p-4'>
        <p className='font-semibold tracking-wide text-md'>{title}</p>
        <PopoverButton>
          {isLoading ? (
            <InfoCardPopoverSkeleton />
          ) : (
            <div className='flex items-center justify-between space-y-2'>
              <div className='space-y-2 w-72'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-semibold text-md'>{title}</h4>
                  <InfoCardBadge rating={rating} cardClasses={cardClasses}>
                    {value}
                  </InfoCardBadge>
                </div>
                <Separator />

                {children}

                {lastUpdated && (
                  <div className='flex flex-col'>
                    <Separator />
                    <div className='flex items-center pt-4'>
                      <CalendarIcon className='w-4 h-4 mr-2 opacity-70' />{' '}
                      <span className='text-sm'>Updated: {lastUpdated}</span>
                    </div>

                    <div className='flex items-center pt-4'>
                      <RefreshCw className='w-4 h-4 mr-2 opacity-70' />{' '}
                      <span className='text-sm'>
                        {`Updates automatically ${refreshRate}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </PopoverButton>
      </div>

      <div className='flex flex-row items-center justify-between px-4 pb-4'>
        <div className={`text-lg font-bold ${cardClasses.foreground}`}>
          {value}
        </div>

        {lastUpdated && (
          <p className='text-sm font-semibold text-muted-foreground'>
            {dayjs(lastUpdated).format('h:mm A')}
          </p>
        )}
      </div>
    </Card>
  );
};

export default InfoCard;
