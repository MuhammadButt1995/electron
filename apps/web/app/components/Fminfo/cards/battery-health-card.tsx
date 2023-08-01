/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */

'use client';

import InfoCard, { FminfoRating } from '@/components/Fminfo/info-card';
import CardPopoverContent from '@/components/Fminfo/card-popover-content';
import { Separator } from '@/components/ui/separator';
import { useBatteryHealth } from '@/hooks/useQueryHooks/useBatteryHealth';

type BatteryHealthCardProps = {
  queryErrorMessage: string;
};

const BatteryHealthCard = ({ queryErrorMessage }: BatteryHealthCardProps) => {
  const batteryHealthQuery = useBatteryHealth();

  const IS_BATTERY_HEALTH_LOADING =
    batteryHealthQuery.isLoading || batteryHealthQuery.isFetching;

  const cardProps = {
    rating: IS_BATTERY_HEALTH_LOADING
      ? 'loading'
      : (batteryHealthQuery?.data?.data.rating as FminfoRating) ?? 'error',
    title: 'Battery Health',
    value: IS_BATTERY_HEALTH_LOADING
      ? 'LOADING'
      : batteryHealthQuery?.data?.data.batteryHealthStatus ?? 'ERROR',
    lastUpdated: batteryHealthQuery?.data?.timestamp ?? '',
  };

  return (
    <InfoCard {...cardProps}>
      <CardPopoverContent
        isLoading={IS_BATTERY_HEALTH_LOADING}
        lastUpdated={cardProps.lastUpdated}
      >
        <h4 className='text-md font-semibold'>{cardProps.title}</h4>
        <Separator />
        <p className='pt-2 text-sm'>
          {batteryHealthQuery?.data?.data.description ??
            (batteryHealthQuery?.isError && queryErrorMessage)}
        </p>
      </CardPopoverContent>
    </InfoCard>
  );
};

export default BatteryHealthCard;
