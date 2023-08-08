'use client';

import { useLastBootTime } from '@/hooks/useQueryHooks/useLastBootTime';
import { useGlobalStateStore } from '@/store/global-state-store';

import CardColorLegend from '@/components/fminfo/ui/card-color-legend';
import InfoCard, { FminfoRating } from '@/components/fminfo/ui/info-card';

const items = {
  ok: (
    <p className='text-xs font-semibold text-center'>Healthy (&lt; 8 Days)</p>
  ),
  warn: (
    <p className='text-xs font-semibold text-center'>At Risk (8 - 10 Days)</p>
  ),
  error: (
    <p className='text-xs font-semibold text-center'>
      Unhealthy (&gt; 10 Days)
    </p>
  ),
};

const LastBootTimeCard = () => {
  const queryErrorMessage = useGlobalStateStore(
    (state) => state.queryErrorMessage
  );
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
    isLoading: IS_LAST_BOOT_TIME_LOADING,
    refreshRate: 'once per day',
  };

  return (
    <InfoCard {...cardProps}>
      <p className='pt-2 text-sm'>
        {lastBootTimeQuery?.data?.data.description ??
          (lastBootTimeQuery?.isError && queryErrorMessage)}
      </p>

      <CardColorLegend items={items} />
    </InfoCard>
  );
};

export default LastBootTimeCard;
