/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */

'use client';

import { HardDrive } from 'lucide-react';
import { useDiskSpace } from '@/hooks/useQueryHooks/useDiskData';
import FminfoCard, { FminfoRating } from '@/components/Fminfo/fminfo-card';
import FminfoDescriptionSkeleton from './fminfo-description-skeleton';

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
    title: 'DISK UTILIZATION HEALTH',
    value: IS_DISK_SPACE_LOADING
      ? 'LOADING'
      : diskSpaceQuery?.data?.data.diskUtilizationHealth ?? 'ERROR',
    icon: <HardDrive className='mr-2 h-4 w-4' />,
    cardBody: IS_DISK_SPACE_LOADING ? (
      <FminfoDescriptionSkeleton />
    ) : (
      <>
        <p className='text-muted-foreground w-7/12 text-xs'>
          {diskSpaceQuery?.data?.data.description ??
            (diskSpaceQuery?.isError && queryErrorMessage)}
        </p>

        <p className='text-muted-foreground w-7/12 text-xs'>
          Last Updated: {diskSpaceQuery?.data?.timestamp ?? ''}
        </p>
      </>
    ),
  };

  return <FminfoCard {...cardProps} />;
};

export default DiskUsageCard;
