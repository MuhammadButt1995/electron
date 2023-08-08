/* eslint-disable no-nested-ternary */

'use client';

import { useTrustedNetworkStatus } from '@/hooks/useQueryHooks/useTrustedNetworkStatus';
import { useGlobalStateStore } from '@/store/global-state-store';

import CardColorLegend from '@/components/fminfo/ui/card-color-legend';
import InfoCard, { FminfoRating } from '@/components/fminfo/ui/info-card';

const items = {
  ok: <p className='text-xs font-semibold text-center'>Connected to ZPA/VPN</p>,
  warn: (
    <p className='text-xs font-semibold text-center'>
      Disconnected from ZPA/VPN
    </p>
  ),
};

const TrustedNetworkCard = () => {
  const queryErrorMessage = useGlobalStateStore(
    (state) => state.queryErrorMessage
  );
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
    isLoading: IS_TRUSTED_NETWORK_LOADING,
    refreshRate: 'in real time',
  };

  return (
    <InfoCard {...cardProps}>
      <p className='pt-2 text-sm'>
        {IS_CONNECTED_TO_INTERNET
          ? trustedNetworkQuery?.data?.data.description ??
            (trustedNetworkQuery?.isError && queryErrorMessage)
          : 'Please connect to the internet to see your connection to a trusted network.'}
      </p>

      {IS_CONNECTED_TO_INTERNET && <CardColorLegend items={items} />}
    </InfoCard>
  );
};

export default TrustedNetworkCard;
