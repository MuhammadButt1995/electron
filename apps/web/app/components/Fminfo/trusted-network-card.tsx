/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */

'use client';

import { Lock } from 'lucide-react';
import { useTrustedNetworkStatus } from '@/hooks/useQueryHooks/useTrustedNetworkStatus';
import FminfoCard, { FminfoRating } from '@/components/Fminfo/fminfo-card';
import FminfoDescriptionSkeleton from './fminfo-description-skeleton';
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
    title: 'TRUSTED NETWORK',
    value: IS_TRUSTED_NETWORK_LOADING
      ? 'LOADING'
      : IS_CONNECTED_TO_INTERNET
      ? trustedNetworkQuery?.data?.data.status ?? 'ERROR'
      : 'ERROR',
    icon: <Lock className='mr-2 h-4 w-4' />,
    cardBody: IS_TRUSTED_NETWORK_LOADING ? (
      <FminfoDescriptionSkeleton />
    ) : (
      <>
        <p className='text-muted-foreground w-7/12 text-xs'>
          {IS_CONNECTED_TO_INTERNET
            ? trustedNetworkQuery?.data?.data.description ??
              (trustedNetworkQuery?.isError && queryErrorMessage)
            : 'Please connect to the internet to see your connection to a trusted network.'}
        </p>

        {IS_CONNECTED_TO_INTERNET && (
          <p className='text-muted-foreground w-7/12 text-xs'>
            Last Updated: {trustedNetworkQuery?.data?.timestamp ?? ''}
          </p>
        )}
      </>
    ),
  };

  return <FminfoCard {...cardProps} />;
};

export default TrustedNetworkCard;
