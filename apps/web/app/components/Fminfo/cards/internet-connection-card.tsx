'use client';

import { useGlobalStateStore } from '@/store/global-state-store';

import CardColorLegend from '@/components/fminfo/ui/card-color-legend';
import InfoCard, { FminfoRating } from '@/components/fminfo/ui/info-card';
import { Separator } from '@/components/ui/separator';

const items = {
  ok: (
    <p className='text-xs font-semibold text-center'>Connected to Internet</p>
  ),
  warn: (
    <p className='text-xs font-semibold text-center'>
      Disconnected from Internet
    </p>
  ),
};

const InternetConnectionCard = () => {
  const IS_CONNECTED_TO_INTERNET = useGlobalStateStore(
    (state) => state.isConnectedToInternet
  );

  const internetConnectionValue = IS_CONNECTED_TO_INTERNET
    ? 'CONNECTED'
    : 'DISCONNECTED';

  const cardProps = {
    rating: IS_CONNECTED_TO_INTERNET ? 'ok' : ('warn' as FminfoRating),
    title: 'Internet Connection',
    value: internetConnectionValue,
  };

  return (
    <InfoCard {...cardProps}>
      <p className='pt-2 text-sm'>
        {IS_CONNECTED_TO_INTERNET
          ? 'You are connected to the Internet.'
          : 'Please connect to a Wi-Fi network or switch to a hardwired connection.'}
      </p>

      <CardColorLegend items={items} />
      <Separator />
    </InfoCard>
  );
};

export default InternetConnectionCard;
