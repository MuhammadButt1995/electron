/* eslint-disable no-nested-ternary */

'use client';

import { usePasswordData } from '@/hooks/useQueryHooks/usePasswordData';
import { useGlobalStateStore } from '@/store/global-state-store';

import CardColorLegend from '@/components/fminfo/ui/card-color-legend';
import InfoCard, { FminfoRating } from '@/components/fminfo/ui/info-card';

const items = {
  ok: <p className='text-xs font-semibold '>&gt;14 Days Left</p>,
  warn: <p className='text-xs font-semibold'>7 - 13 Days Left</p>,
  error: <p className='text-xs font-semibold'> &lt; 7 Days Left</p>,
};

const PasswordDataCard = () => {
  const queryErrorMessage = useGlobalStateStore(
    (state) => state.queryErrorMessage
  );
  const passwordDataQuery = usePasswordData();

  const IS_CONNECTED_TO_INTERNET = useGlobalStateStore(
    (state) => state.isConnectedToInternet
  );

  const IS_ON_TRUSTED_NETWORK = useGlobalStateStore(
    (state) => state.isOnTrustedNetwork
  );

  const IS_PASSWORD_DATA_LOADING =
    passwordDataQuery.isLoading || passwordDataQuery.isFetching;

  const IS_CONNECTED_AND_TRUSTED =
    IS_CONNECTED_TO_INTERNET && IS_ON_TRUSTED_NETWORK;
  // const IS_CONNECTED_AND_TRUSTED = IS_CONNECTED_TO_INTERNET && true;

  const cardProps = {
    rating: IS_PASSWORD_DATA_LOADING
      ? 'loading'
      : IS_CONNECTED_AND_TRUSTED
      ? (passwordDataQuery?.data?.data.rating as FminfoRating) ?? 'error'
      : 'error',
    title: 'Password Expires In',
    value: IS_PASSWORD_DATA_LOADING
      ? 'LOADING'
      : IS_CONNECTED_AND_TRUSTED
      ? passwordDataQuery?.data?.data.daysLeft ?? 'ERROR'
      : 'ERROR',
    lastUpdated: passwordDataQuery?.data?.timestamp ?? '',
    isLoading: IS_PASSWORD_DATA_LOADING,
    refreshRate: 'once per day',
  };

  return (
    <InfoCard {...cardProps}>
      <p className='pt-2 text-sm'>
        {IS_CONNECTED_TO_INTERNET
          ? IS_CONNECTED_AND_TRUSTED
            ? passwordDataQuery?.data?.data.description ??
              (passwordDataQuery?.isError && queryErrorMessage)
            : 'Please connect to a trusted network to see your current password data.'
          : 'Please connect to the internet to see your current password data.'}
      </p>

      {IS_CONNECTED_AND_TRUSTED && <CardColorLegend items={items} />}
    </InfoCard>
  );
};

export default PasswordDataCard;
