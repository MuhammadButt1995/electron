/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */

'use client';

import InfoCard, { FminfoRating } from '@/components/Fminfo/info-card';
import CardPopoverContent from '@/components/Fminfo/card-popover-content';
import { Separator } from '@/components/ui/separator';
import { useDiskSpace } from '@/hooks/useQueryHooks/useDiskData';

type DiskUsageCardProps = {
  queryErrorMessage: string;
};

const DiskUsageCard = ({ queryErrorMessage }: DiskUsageCardProps) => {
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
  };

  return (
    <InfoCard {...cardProps}>
      <CardPopoverContent
        isLoading={IS_DISK_SPACE_LOADING}
        lastUpdated={cardProps.lastUpdated}
      >
        <h4 className='text-md font-semibold'>{cardProps.title}</h4>
        <Separator />
        <p className='pt-2 text-sm'>
          {diskSpaceQuery?.data?.data.description ??
            (diskSpaceQuery?.isError && queryErrorMessage)}
        </p>
      </CardPopoverContent>
    </InfoCard>
  );
};

export default DiskUsageCard;
