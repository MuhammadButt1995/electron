/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */

'use client';

import InfoCard, { FminfoRating } from '@/components/Fminfo/info-card';
import CardPopoverContent from '@/components/Fminfo/card-popover-content';
import { Separator } from '@/components/ui/separator';
import { useLastBootTime } from '@/hooks/useQueryHooks/useLastBootTime';

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
    title: 'System Reboot Health',
    value: IS_LAST_BOOT_TIME_LOADING
      ? 'LOADING'
      : lastBootTimeQuery?.data?.data.healthStatus ?? 'ERROR',
    subvalue: IS_LAST_BOOT_TIME_LOADING
      ? ''
      : lastBootTimeQuery?.data?.data.daysSinceBoot,
    lastUpdated: lastBootTimeQuery?.data?.timestamp ?? '',
  };

  return (
    <InfoCard {...cardProps}>
      <CardPopoverContent
        isLoading={IS_LAST_BOOT_TIME_LOADING}
        lastUpdated={cardProps.lastUpdated}
      >
        <h4 className='text-md font-semibold'>{cardProps.title}</h4>
        <Separator />
        <p className='pt-2 text-sm'>
          {lastBootTimeQuery?.data?.data.description ??
            (lastBootTimeQuery?.isError && queryErrorMessage)}
        </p>
      </CardPopoverContent>
    </InfoCard>
  );
};

export default LastBootTimeCard;
