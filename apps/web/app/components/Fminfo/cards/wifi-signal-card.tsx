/* eslint-disable no-nested-ternary */

'use client';

import { useWiFiData } from '@/hooks/useQueryHooks/useWifiData';
import CardColorLegend from '@/components/fminfo/ui/card-color-legend';
import { useGlobalStateStore } from '@/store/global-state-store';

import InfoCard, { FminfoRating } from '@/components/fminfo/ui/info-card';

const items = {
  ok: <p className='text-xs font-semibold text-center'>Reliable Connection</p>,
  warn: <p className='text-xs font-semibold text-center'>Decent Connection</p>,
  error: (
    <p className='text-xs font-semibold text-center'>
      Slow <span className='block'>Connection</span>
    </p>
  ),
};

const WifiSignalCard = () => {
  const queryErrorMessage = useGlobalStateStore(
    (state) => state.queryErrorMessage
  );
  const wifiDataQuery = useWiFiData();

  const IS_CONNECTED_TO_INTERNET = useGlobalStateStore(
    (state) => state.isConnectedToInternet
  );

  const IS_WIFI_DATA_LOADING =
    wifiDataQuery.isLoading || wifiDataQuery.isFetching;

  const IS_WIFI_DATA_ERROR = wifiDataQuery.isError;

  const cardProps = {
    rating: IS_WIFI_DATA_LOADING
      ? 'loading'
      : IS_WIFI_DATA_ERROR
      ? 'error'
      : IS_CONNECTED_TO_INTERNET
      ? (wifiDataQuery?.data?.data.rating as FminfoRating) ?? 'error'
      : 'error',
    title: 'Wi-Fi Connection',
    value: IS_WIFI_DATA_LOADING
      ? 'LOADING'
      : IS_CONNECTED_TO_INTERNET
      ? wifiDataQuery?.data?.data.overall ?? 'ERROR'
      : 'ERROR',
    lastUpdated: wifiDataQuery?.data?.timestamp ?? '',
    isLoading: IS_WIFI_DATA_LOADING,
    refreshRate: 'every 5 minutes',
  };

  return (
    <InfoCard {...cardProps}>
      <p className='pt-2 text-sm'>
        {IS_CONNECTED_TO_INTERNET
          ? wifiDataQuery?.data?.data.description ??
            (wifiDataQuery?.isError && queryErrorMessage)
          : 'Please connect to a Wi-Fi network to see your Wi-Fi signal details.'}
      </p>

      {IS_CONNECTED_TO_INTERNET && <CardColorLegend items={items} />}
    </InfoCard>
  );
};

export default WifiSignalCard;
