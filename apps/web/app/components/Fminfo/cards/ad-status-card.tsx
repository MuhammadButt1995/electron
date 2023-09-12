'use client';

import { useADStatus } from '@/hooks/useQueryHooks/useADStatus';
import { useGlobalStateStore } from '@/store/global-state-store';

import CardColorLegend from '@/components/fminfo/ui/card-color-legend';
import InfoCard, { FminfoRating } from '@/components/fminfo/ui/info-card';

const ADStatusCard = () => {
  const queryErrorMessage = useGlobalStateStore(
    (state) => state.queryErrorMessage
  );
  const OS = useGlobalStateStore((state) => state.os);
  const IS_MACOS = OS === 'macos';

  const items = {
    ok: (
      <p className='text-xs font-semibold text-center'>
        {IS_MACOS ? 'Bound to AD' : 'Bound to Azure AD'}
      </p>
    ),
    error: (
      <p className='text-xs font-semibold text-center'>
        {IS_MACOS ? 'Not Bound to AD' : 'Not Bound to Azure AD'}
      </p>
    ),
  };

  const ADStatusQuery = useADStatus();
  const IS_AD_STATUS_LOADING =
    ADStatusQuery.isLoading || ADStatusQuery.isFetching;

  const cardProps = {
    rating: IS_AD_STATUS_LOADING
      ? 'loading'
      : (ADStatusQuery?.data?.data.rating as FminfoRating) ?? 'error',
    title: IS_MACOS ? 'Active Directory' : 'Azure Active Directory',
    value: IS_AD_STATUS_LOADING
      ? 'LOADING'
      : ADStatusQuery?.data?.data.isBound ?? 'ERROR',
    lastUpdated: ADStatusQuery?.data?.timestamp,
    isLoading: IS_AD_STATUS_LOADING,
    refreshRate: 'every 15 minutes',
  };

  return (
    <InfoCard {...cardProps}>
      <p className='pt-2 text-sm'>
        {ADStatusQuery?.data?.data.description ??
          (ADStatusQuery?.isError && queryErrorMessage)}
      </p>
      <CardColorLegend items={items} />
    </InfoCard>
  );
};

export default ADStatusCard;
