/* eslint-disable react/require-default-props */

'use client';

import { useEffect } from 'react';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { cn } from '../lib/utils';

export type FminfoRating = 'loading' | 'ok' | 'warn' | 'error';

export type FminfoCardProps = {
  rating: FminfoRating;
  title: string;
  value;
  icon: React.ReactNode;
  cardBody: React.ReactNode;
  children?: React.ReactNode;
  onRatingChange?: (rating: FminfoRating) => void;
};

const FminfoCard = ({
  rating,
  title,
  value,
  icon,
  cardBody,
  children,
  onRatingChange,
}: FminfoCardProps) => {
  useEffect(() => {
    if (onRatingChange) {
      onRatingChange(rating);
    }
  }, [rating, onRatingChange]);

  const stateClasses = cn({
    'text-brand-green-700 dark:text-brand-green-500': rating === 'ok',
    'text-brand-yellow-700 dark:text-brand-yellow-500': rating === 'warn',
    'text-brand-magenta-800 dark:text-brand-magenta-600': rating === 'error',
    '': rating === 'loading',
  });

  return (
    <Card className='relative'>
      <CardHeader>
        <div
          className={`flex flex-row items-center justify-between ${stateClasses}`}
        >
          <CardDescription className='text-xs font-bold tracking-tight'>
            {title}
          </CardDescription>
          {icon}
        </div>

        <div className='flex flex-col items-start justify-start space-y-2'>
          <div className={`text-sm font-bold ${stateClasses}`}>{value}</div>
          {cardBody}
        </div>
      </CardHeader>
      {children}
    </Card>
  );
};

export default FminfoCard;
