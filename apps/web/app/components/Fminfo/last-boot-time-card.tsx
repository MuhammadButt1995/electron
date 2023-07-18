/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */

'use client';

import { useEffect } from 'react';
import { Power } from 'lucide-react';
import { useLastBootTime } from '@/hooks/useQueryHooks/useLastBootTime';
import FminfoCard, { FminfoRating } from '@/components/Fminfo/fminfo-card';
import FminfoDescriptionSkeleton from './fminfo-description-skeleton';

type LastBootTimeCardProps = {
  queryErrorMessage: string;
};

const LastBootTimeCard = ({ queryErrorMessage }: LastBootTimeCardProps) => {
  const lastBootTimeQuery = useLastBootTime();

  const IS_LAST_BOOT_TIME_LOADING =
    lastBootTimeQuery.isLoading || lastBootTimeQuery.isFetching;

  const cardProps = {
    rating: IS_LAST_BOOT_TIME_LOADING
      ? 'loading'
      : (lastBootTimeQuery?.data?.data.rating as FminfoRating) ?? 'error',
    title: 'LAST RESTARTED',
    value: IS_LAST_BOOT_TIME_LOADING
      ? 'LOADING'
      : lastBootTimeQuery?.data?.data.daysSinceBoot ?? 'ERROR',
    icon: <Power className='mr-2 h-4 w-4' />,
    cardBody: IS_LAST_BOOT_TIME_LOADING ? (
      <FminfoDescriptionSkeleton />
    ) : (
      <>
        <p className='text-muted-foreground w-7/12 text-xs'>
          {lastBootTimeQuery?.data?.data.description ??
            (lastBootTimeQuery?.isError && queryErrorMessage)}
        </p>

        <p className='text-muted-foreground w-7/12 text-xs'>
          Last Updated: {lastBootTimeQuery?.data?.timestamp ?? ''}
        </p>
      </>
    ),
  };

  return <FminfoCard {...cardProps} />;
};

export default LastBootTimeCard;
