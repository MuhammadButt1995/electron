/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */

'use client';

import InfoCard, { FminfoRating } from '@/components/Fminfo/info-card';
import CardPopoverContent from '@/components/Fminfo/card-popover-content';
import { Separator } from '@/components/ui/separator';
import { useADStatus } from '@/hooks/useQueryHooks/useADStatus';
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
    title: IS_MACOS ? 'On-Prem Active Directory' : 'Azure Active Directory',
    value: IS_AD_STATUS_LOADING
      ? 'LOADING'
      : ADStatusQuery?.data?.data.isBound ?? 'ERROR',
    lastUpdated: ADStatusQuery?.data?.timestamp,
  };

  return (
    <InfoCard {...cardProps}>
      <CardPopoverContent
        isLoading={IS_AD_STATUS_LOADING}
        lastUpdated={cardProps.lastUpdated}
      >
        <h4 className='text-md font-semibold'>{cardProps.title}</h4>
        <Separator />
        <p className='pt-2 text-sm'>
          {ADStatusQuery?.data?.data.description ??
            (ADStatusQuery?.isError && queryErrorMessage)}
        </p>
      </CardPopoverContent>
    </InfoCard>
  );
};

export default ADStatusCard;
