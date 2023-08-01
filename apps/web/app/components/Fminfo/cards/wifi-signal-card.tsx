/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */

'use client';

import { useEffect, useRef, useState } from 'react';
import { Footprints, HelpCircle, Signal } from 'lucide-react';
import { useWiFiData } from '@/hooks/useQueryHooks/useWifiData';
import InfoCard, { FminfoRating } from '@/components/Fminfo/info-card';
import CardPopoverContent from '@/components/Fminfo/card-popover-content';
import { Separator } from '@/components/ui/separator';
import FminfoDescriptionSkeleton from '../info-card-popover-skeleton';
import { useGlobalStateStore } from '@/store/settings-store';
import {
  StaticPopoverButton,
  StaticPopoverButtonProps,
} from '../../../static-popover-button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

type WifiSignalCardProps = {
  queryErrorMessage: string;
};

const WifiSignalCard = ({ queryErrorMessage }: WifiSignalCardProps) => {
  const wifiDataQuery = useWiFiData();
  const [wifiAssistant, setWifiAsssistant] = useState(false);
  const [countdown, setCountdown] = useState(5 * 60);
  const [isHovered, setIsHovered] = useState(false);

  const stopWifiAssistant = () => {
    setWifiAsssistant(false);
    setIsHovered(false);
    setCountdown(5 * 60);
  };

  // Store the refetch function in a ref
  const refetchRef = useRef(wifiDataQuery.refetch);

  useEffect(() => {
    // Update the refetch ref whenever wifiResponse.refetch changes
    refetchRef.current = wifiDataQuery.refetch;
  }, [wifiDataQuery.refetch]);

  useEffect(() => {
    let refetchIntervalId = null;
    let countdownIntervalId = null;

    if (wifiAssistant) {
      // Start a new interval for refetching
      refetchIntervalId = setInterval(async () => {
        // Use the refetch function from the ref
        await refetchRef.current();
        // Check if wifiState.status is 'ERROR' after refetching
        if (wifiDataQuery.isError) {
          // If it is, stop the wifiAssistant
          setWifiAsssistant(false);
        }
      }, 5000); // 5000 milliseconds = 5 seconds

      // Start a new interval for countdown
      countdownIntervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            // If countdown has reached 0, stop the wifiAssistant
            setWifiAsssistant(false);
            setIsHovered(false);
            return 5 * 60; // Reset the countdown
          }
          return prevCountdown - 1;
        });
      }, 1000); // 1000 milliseconds = 1 second
    }

    // This function is run when the component unmounts or when wifiAssistant changes
    return () => {
      // Clear any existing intervals
      if (refetchIntervalId) {
        clearInterval(refetchIntervalId);
      }
      if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
      }
    };
  }, [wifiAssistant, wifiDataQuery.isError]); // Only re-run the effect if wifiAssistant changes

  const IS_CONNECTED_TO_INTERNET = useGlobalStateStore(
    (state) => state.isConnectedToInternet
  );

  const IS_WIFI_DATA_LOADING =
    wifiDataQuery.isLoading ||
    wifiDataQuery.isFetching ||
    wifiDataQuery.isPaused;

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
  };

  const getWifiDataContentProps = (): StaticPopoverButtonProps => ({
    icon: <HelpCircle className='h-4 w-4' />,
    btnClasses: 'absolute bottom-3 right-5 w-10 rounded-full p-0',
    disabled: !IS_CONNECTED_TO_INTERNET || wifiDataQuery.isError,
    children: (
      <div className='grid gap-4'>
        <div className='space-y-2'>
          <h4 className='font-medium leading-none'>
            How we&apos;re measuring your Wi-Fi signal
          </h4>
          <p className='text-muted-foreground w-72 text-sm'>
            We&apos;re using a weighted average from analyzing these data points
            from your machine:
          </p>
        </div>
        <div className='grid gap-2'>
          <div className='grid grid-cols-3 items-center gap-4'>
            <Label>Signal Strength</Label>
            <Input
              disabled
              value={`${wifiDataQuery?.data?.data.signal.value}%`}
              className='col-span-2 h-8'
            />
          </div>
          <div className='grid grid-cols-3 items-center gap-4'>
            <Label>Radio Type</Label>
            <Input
              disabled
              value={wifiDataQuery?.data?.data.radioType.value}
              className='col-span-2 h-8'
            />
          </div>
          <div className='grid grid-cols-3 items-center gap-4'>
            <Label>Channel</Label>
            <Input
              disabled
              value={wifiDataQuery?.data?.data.channel.value}
              className='col-span-2 h-8'
            />
          </div>
          <div className='mt-4 grid grid-cols-3 items-center gap-4'>
            <Label className='font-bold'>Overall Rating</Label>
            <Label>{wifiDataQuery?.data?.data.overall}</Label>
          </div>
        </div>
      </div>
    ),
  });

  const getWifiAssistantContentProps = (): StaticPopoverButtonProps => ({
    icon: <Footprints className='h-4 w-4' />,
    btnClasses: 'absolute right-28 top-3 flex items-center',
    disabled: !IS_CONNECTED_TO_INTERNET || wifiDataQuery.isError,
    children: (
      <div className='grid gap-4'>
        <div className='space-y-2'>
          <h4 className='w-72 font-medium leading-none'>
            Start Your Journey to Find the Ideal Workspace Environment.
          </h4>
          <p className='text-muted-foreground w-72 text-sm'>
            We&apos;ll provide Wi-Fi data every 5 seconds for 5 minutes. Find a
            spot with consistent strong signals to set up your workspace.
          </p>
        </div>

        <Button
          variant='outline'
          className='mt-2'
          onClick={() => setWifiAsssistant(true)}
        >
          Start
        </Button>
      </div>
    ),
  });

  const wifiAssistantCardProps = {
    rating: IS_WIFI_DATA_LOADING
      ? 'loading'
      : IS_WIFI_DATA_ERROR
      ? 'error'
      : IS_CONNECTED_TO_INTERNET
      ? (wifiDataQuery?.data?.data.rating as FminfoRating) ?? 'error'
      : 'error',
    title: 'WI-FI SIGNAL',
    value: IS_WIFI_DATA_LOADING
      ? 'LOADING'
      : IS_CONNECTED_TO_INTERNET
      ? wifiDataQuery?.data?.data.overall ?? 'ERROR'
      : 'ERROR',
    icon: <Signal className='mr-2 h-4 w-4' />,
    cardBody: IS_WIFI_DATA_LOADING ? (
      <FminfoDescriptionSkeleton />
    ) : (
      <>
        <div>
          <p className='text-foreground text-xs'>
            Signal Strength: {wifiDataQuery?.data?.data?.signal.value}
          </p>
          <p className='text-foreground text-xs'>
            Radio Type: {wifiDataQuery?.data?.data?.radioType.value}
          </p>
          <p className='text-foreground text-xs'>
            Channel: {wifiDataQuery?.data?.data.channel.value}
          </p>
        </div>

        <p className='text-muted-foreground text-xs'>
          Updated: {wifiDataQuery?.data?.timestamp}
        </p>

        <div className='absolute bottom-20 right-28 flex items-center'>
          <Button
            variant='outline'
            size='lg'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={stopWifiAssistant}
          >
            {isHovered
              ? 'Stop'
              : `${Math.floor(countdown / 60)}:${
                  countdown % 60 < 10 ? '0' : ''
                }${countdown % 60}`}
          </Button>
        </div>
      </>
    ),
  };

  return (
    <div>
      {!wifiAssistant ? (
        <InfoCard {...cardProps}>
          <CardPopoverContent
            isLoading={IS_WIFI_DATA_LOADING}
            lastUpdated={cardProps.lastUpdated}
          >
            <h4 className='text-md font-semibold'>{cardProps.title}</h4>
            <Separator />
            <p className='pt-2 text-sm'>
              {IS_CONNECTED_TO_INTERNET
                ? wifiDataQuery?.data?.data.description ??
                  (wifiDataQuery?.isError && queryErrorMessage)
                : 'Please connect to a Wi-Fi network to see your Wi-Fi signal details.'}
            </p>
          </CardPopoverContent>
        </InfoCard>
      ) : (
        <InfoCard {...wifiAssistantCardProps} />
      )}
    </div>
  );
};

export default WifiSignalCard;
