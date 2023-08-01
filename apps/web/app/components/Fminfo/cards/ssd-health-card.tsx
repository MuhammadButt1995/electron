/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */

'use client';

import InfoCard, { FminfoRating } from '@/components/Fminfo/info-card';
import CardPopoverContent from '@/components/Fminfo/card-popover-content';
import { Separator } from '@/components/ui/separator';
import { useSSDHealth } from '@/hooks/useQueryHooks/useSSDHealth';

type SSDHealthCardProps = {
  queryErrorMessage: string;
};

const SSDHealthCard = ({ queryErrorMessage }: SSDHealthCardProps) => {
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
  };

  return (
    <InfoCard {...cardProps}>
      <CardPopoverContent
        isLoading={IS_SSD_HEALTH_LOADING}
        lastUpdated={cardProps.lastUpdated}
      >
        <h4 className='text-md font-semibold'>{cardProps.title}</h4>
        <Separator />
        <p className='pt-2 text-sm'>
          {SSDHealthQuery?.data?.data.description ??
            (SSDHealthQuery?.isError && queryErrorMessage)}
        </p>
      </CardPopoverContent>
    </InfoCard>
  );
};

export default SSDHealthCard;
