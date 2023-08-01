/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */

'use client';

import InfoCard, { FminfoRating } from '@/components/Fminfo/info-card';
import CardPopoverContent from '@/components/Fminfo/card-popover-content';
import { Separator } from '@/components/ui/separator';
import { useTrustedNetworkStatus } from '@/hooks/useQueryHooks/useTrustedNetworkStatus';
import { useGlobalStateStore } from '@/store/settings-store';

type TrustedNetworkCardProps = {
  queryErrorMessage: string;
};

const TrustedNetworkCard = ({ queryErrorMessage }: TrustedNetworkCardProps) => {
  const trustedNetworkQuery = useTrustedNetworkStatus();

  const IS_CONNECTED_TO_INTERNET = useGlobalStateStore(
    (state) => state.isConnectedToInternet
  );

  const IS_TRUSTED_NETWORK_LOADING =
    trustedNetworkQuery.isLoading || trustedNetworkQuery.isFetching;

  const cardProps = {
    rating: IS_TRUSTED_NETWORK_LOADING
      ? 'loading'
      : IS_CONNECTED_TO_INTERNET
      ? (trustedNetworkQuery?.data?.data.rating as FminfoRating) ?? 'error'
      : 'error',
    title: 'VPN/ZPA Connection',
    value: IS_TRUSTED_NETWORK_LOADING
      ? 'LOADING'
      : IS_CONNECTED_TO_INTERNET
      ? trustedNetworkQuery?.data?.data.status ?? 'ERROR'
      : 'ERROR',
    lastUpdated: trustedNetworkQuery?.data?.timestamp ?? '',
  };

  return (
    <InfoCard {...cardProps}>
      <CardPopoverContent
        isLoading={IS_TRUSTED_NETWORK_LOADING}
        lastUpdated={cardProps.lastUpdated}
      >
        <h4 className='text-md font-semibold'>{cardProps.title}</h4>
        <Separator />
        <p className='pt-2 text-sm'>
          {IS_CONNECTED_TO_INTERNET
            ? trustedNetworkQuery?.data?.data.description ??
              (trustedNetworkQuery?.isError && queryErrorMessage)
            : 'Please connect to the internet to see your connection to a trusted network.'}
        </p>
      </CardPopoverContent>
    </InfoCard>
  );
};

export default TrustedNetworkCard;
