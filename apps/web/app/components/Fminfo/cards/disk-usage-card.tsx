'use client';

import { useDiskSpace } from '@/hooks/useQueryHooks/useDiskData';
import { useGlobalStateStore } from '@/store/global-state-store';

import CardColorLegend from '@/components/fminfo/ui/card-color-legend';
import InfoCard, { FminfoRating } from '@/components/fminfo/ui/info-card';

const items = {
  ok: (
    <p className='text-xs font-semibold text-center'>
      Healthy Usage (&gt; 25% left)
    </p>
  ),
  warn: (
    <p className='text-xs font-semibold text-center'>
      At Risk Usage (15% - 25% left)
    </p>
  ),
  error: (
    <p className='text-xs font-semibold text-center'>
      Unhealthy Usage (&lt; 15% left)
    </p>
  ),
};

const DiskUsageCard = () => {
  const queryErrorMessage = useGlobalStateStore(
    (state) => state.queryErrorMessage
  );
  const diskSpaceQuery = useDiskSpace();

  const IS_DISK_SPACE_LOADING =
    diskSpaceQuery.isLoading || diskSpaceQuery.isFetching;

  const cardProps = {
    rating: IS_DISK_SPACE_LOADING
      ? 'loading'
      : (diskSpaceQuery?.data?.data.rating as FminfoRating) ?? 'error',
    title: 'Disk Space Health',
    value: IS_DISK_SPACE_LOADING
      ? 'LOADING'
      : diskSpaceQuery?.data?.data.diskUtilizationHealth ?? 'ERROR',
    lastUpdated: diskSpaceQuery?.data?.timestamp ?? '',
    isLoading: IS_DISK_SPACE_LOADING,
    refreshRate: 'once per day',
  };

  return (
    <InfoCard {...cardProps}>
      <p className='pt-2 text-sm'>
        {diskSpaceQuery?.data?.data.description ??
          (diskSpaceQuery?.isError && queryErrorMessage)}
      </p>

      <CardColorLegend items={items} />
    </InfoCard>
  );
};

export default DiskUsageCard;
