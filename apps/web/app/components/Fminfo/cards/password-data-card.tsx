/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-nested-ternary */

'use client';

import { User } from 'lucide-react';
import { usePasswordData } from '@/hooks/useQueryHooks/usePasswordData';
import InfoCard, { FminfoRating } from '@/components/Fminfo/info-card';
import CardPopoverContent from '@/components/Fminfo/card-popover-content';
import { Separator } from '@/components/ui/separator';

import { useGlobalStateStore } from '@/store/settings-store';
import { useDomainData } from '@/hooks/useQueryHooks/useDomainData';
import {
  DataPopoverButton,
  DataPopoverButtonProps,
} from '../../../data-popover-button';
import { Skeleton } from '../../ui/skeleton';
import { ScrollArea } from '../../ui/scroll-area';
import { Label } from '../../ui/label';
import ClipboardText from '../../clipboard-text';

type PasswordDataCardProps = {
  queryErrorMessage: string;
};

const PasswordDataCard = ({ queryErrorMessage }: PasswordDataCardProps) => {
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
  };

  const domainDataQuery = useDomainData();

  const IS_DOMAIN_DATA_LOADING =
    domainDataQuery.isLoading || domainDataQuery.isFetching;
  const IS_DOMAIN_DATA_LOADED = domainDataQuery.isSuccess;

  const getDomainDataCardProps = (): DataPopoverButtonProps => {
    let content: React.ReactNode;

    if (IS_DOMAIN_DATA_LOADING) {
      content = (
        <div className='flex items-center space-x-4'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
          </div>
        </div>
      );
    }

    if (IS_DOMAIN_DATA_LOADED) {
      content = (
        <ScrollArea>
          {Object.entries(domainDataQuery.data.data || {}).map(
            ([key, value]) => (
              <div key={key} className='grid grid-cols-2 items-center gap-4'>
                <Label key={key}>{camelToNormalText(key)}</Label>
                <ClipboardText text={value} classNames='h-8' />
              </div>
            )
          )}
        </ScrollArea>
      );
    }

    return {
      icon: <User className='h-4 w-4' />,
      btnClasses: 'absolute bottom-3 right-5 w-10 rounded-full p-0',
      fetchData: domainDataQuery.refetch,
      disabled: !IS_CONNECTED_AND_TRUSTED || passwordDataQuery.isError,
      children: (
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>
              Your domain information.
            </h4>
            <p className='text-muted-foreground w-72 text-sm'>
              This is information about the current logged on user on this
              machine.
            </p>
          </div>
          <div className='grid gap-2'>{content}</div>
        </div>
      ),
    };
  };

  return (
    <InfoCard {...cardProps}>
      <CardPopoverContent
        isLoading={IS_PASSWORD_DATA_LOADING}
        lastUpdated={cardProps.lastUpdated}
      >
        <h4 className='text-md font-semibold'>{cardProps.title}</h4>
        <Separator />
        <p className='pt-2 text-sm'>
          {IS_CONNECTED_TO_INTERNET
            ? IS_CONNECTED_AND_TRUSTED
              ? passwordDataQuery?.data?.data.description ??
                (passwordDataQuery?.isError && queryErrorMessage)
              : 'Please connect to a trusted network to see your current password data.'
            : 'Please connect to the internet to see your current password data.'}
        </p>
      </CardPopoverContent>
    </InfoCard>
  );
};

function camelToNormalText(text) {
  const result = text
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .trim();

  return result.replace(/\b(\w)/g, (s) => s.toUpperCase());
}

export default PasswordDataCard;
