'use client';

import { useSSDHealth } from '@/hooks/useQueryHooks/useSSDHealth';
import { useGlobalStateStore } from '@/store/global-state-store';

import InfoCard, { FminfoRating } from '@/components/fminfo/ui/info-card';
import CardColorLegend from '../ui/card-color-legend';

const items = {
  ok: <p className='text-xs font-semibold text-center'>Healthy SSD</p>,
  error: <p className='text-xs font-semibold text-center'>Unhealthy SSD</p>,
};

const SSDHealthCard = () => {
  const queryErrorMessage = useGlobalStateStore(
    (state) => state.queryErrorMessage
  );
  const SSDHealthQuery = useSSDHealth();

  const IS_SSD_HEALTH_LOADING =
    SSDHealthQuery.isLoading || SSDHealthQuery.isFetching;

  const cardProps = {
    rating: IS_SSD_HEALTH_LOADING
      ? 'loading'
      : (SSDHealthQuery?.data?.data.rating as FminfoRating) ?? 'error',
    title: 'SSD Health',
    value: IS_SSD_HEALTH_LOADING
      ? 'LOADING'
      : SSDHealthQuery?.data?.data.ssdHealthStatus ?? 'ERROR',
    lastUpdated: SSDHealthQuery?.data?.timestamp ?? '',
    isLoading: IS_SSD_HEALTH_LOADING,
    refreshRate: 'once per day',
  };

  return (
    <InfoCard {...cardProps}>
      <p className='pt-2 text-sm'>
        {SSDHealthQuery?.data?.data.description ??
          (SSDHealthQuery?.isError && queryErrorMessage)}
      </p>

      <CardColorLegend items={items} />
    </InfoCard>
  );
};

export default SSDHealthCard;
