/* eslint-disable react/require-default-props */

'use client';

import InfoCard, { FminfoRating } from '@/components/Fminfo/info-card';
import CardPopoverContent from '@/components/Fminfo/card-popover-content';
import { Separator } from '@/components/ui/separator';
import { useGlobalStateStore } from '@/store/settings-store';

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
      <CardPopoverContent>
        <h4 className='text-md font-semibold'>{cardProps.title}</h4>
        <Separator />
        <p className='pt-2 text-sm'>
          {IS_CONNECTED_TO_INTERNET
            ? 'You are connected to the Internet.'
            : 'Please connect to a Wi-Fi network or switch to a hardwired connection.'}
        </p>
      </CardPopoverContent>
    </InfoCard>
  );
};

export default InternetConnectionCard;
