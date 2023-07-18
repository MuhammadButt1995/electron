/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */

'use client';

import { Laptop } from 'lucide-react';
import { useADStatus } from '@/hooks/useQueryHooks/useADStatus';
import FminfoCard, { FminfoRating } from '@/components/Fminfo/fminfo-card';
import FminfoDescriptionSkeleton from './fminfo-description-skeleton';
import { useGlobalStateStore } from '@/store/settings-store';

type ADStatusCardProps = {
  queryErrorMessage: string;
};

const ADStatusCard = ({ queryErrorMessage }: ADStatusCardProps) => {
  const OS = useGlobalStateStore((state) => state.os);
  const IS_MACOS = OS === 'macos';

  const ADStatusQuery = useADStatus();
  const IS_AD_STATUS_LOADING =
    ADStatusQuery.isLoading || ADStatusQuery.isFetching;

  const cardProps = {
    rating: IS_AD_STATUS_LOADING
      ? 'loading'
      : (ADStatusQuery?.data?.data.rating as FminfoRating) ?? 'error',
    title: IS_MACOS ? 'ON-PREM ACTIVE DIRECTORY' : 'AZURE ACTIVE DIRECTORY',
    value: IS_AD_STATUS_LOADING
      ? 'LOADING'
      : ADStatusQuery?.data?.data.isBound ?? 'ERROR',
    icon: <Laptop className='mr-2 h-4 w-4' />,
    cardBody: IS_AD_STATUS_LOADING ? (
      <FminfoDescriptionSkeleton />
    ) : (
      <>
        <p className='text-muted-foreground w-7/12 text-xs'>
          {ADStatusQuery?.data?.data.description ??
            (ADStatusQuery?.isError && queryErrorMessage)}
        </p>

        <p className='text-muted-foreground w-7/12 text-xs'>
          Last Updated: {ADStatusQuery?.data?.timestamp ?? ''}
        </p>
      </>
    ),
  };

  return <FminfoCard {...cardProps} />;
};

export default ADStatusCard;
