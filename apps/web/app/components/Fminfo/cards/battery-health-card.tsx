'use client';

import { useBatteryHealth } from '@/hooks/useQueryHooks/useBatteryHealth';
import { useGlobalStateStore } from '@/store/global-state-store';

import CardColorLegend from '@/components/fminfo/ui/card-color-legend';
import InfoCard, { FminfoRating } from '@/components/fminfo/ui/info-card';

const items = {
  ok: (
    <p className='text-xs font-semibold text-center'>
      Healthy Battery (&gt; 75%)
    </p>
  ),
  error: (
    <p className='text-xs font-semibold text-center'>
      Unhealthy Battery (&lt; 75%)
    </p>
  ),
};

const BatteryHealthCard = () => {
  const queryErrorMessage = useGlobalStateStore(
    (state) => state.queryErrorMessage
  );

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
    isLoading: IS_BATTERY_HEALTH_LOADING,
    refreshRate: 'once per day',
  };

  return (
    <InfoCard {...cardProps}>
      <p className='pt-2 text-sm'>
        {batteryHealthQuery?.data?.data.description ??
          (batteryHealthQuery?.isError && queryErrorMessage)}
      </p>

      <CardColorLegend items={items} />
    </InfoCard>
  );
};

export default BatteryHealthCard;
