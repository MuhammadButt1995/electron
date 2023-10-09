/* eslint-disable react/no-array-index-key */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import {
  UploadIcon,
  DownloadIcon,
  StopwatchIcon,
  StopIcon,
} from '@radix-ui/react-icons';
import {
  RefreshCw,
  Compass,
  Gauge,
  Signal,
  RadioTower,
  Hash,
} from 'lucide-react';

import { useWiFiData } from '@/hooks/useQueryHooks/useWifiData';
import { useNetworkSpeed } from '@/hooks/useQueryHooks/useNetworkSpeed';
import { useGlobalStateStore } from '@/store/global-state-store';

import WifiSignalCard from '@/components/fminfo/cards/wifi-signal-card';
import TableCard from '@/components/fminfo/ui/table-card';
import ClipboardText from '@/components/text/clipboard-text';
import DialogButton from '@/components/fminfo/ui/dialog-button';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const NetworkHealthTabPage = () => {
  const isDaaSMachine = useGlobalStateStore((state) => state.isDaaSMachine);
  const IS_CONNECTED_TO_INTERNET = useGlobalStateStore(
    (state) => state.isConnectedToInternet
  );

  const isMac = useGlobalStateStore((state) => state.os === 'macos');

  const wifiDataQuery = useWiFiData();
  const networkType = useGlobalStateStore((state) => state.trustedNetworkType);
  const networkSpeedQuery = useNetworkSpeed(networkType);

  const [wifiAssistant, setWifiAsssistant] = useState(false);
  const [countdown, setCountdown] = useState(5 * 60);
  const [isHovered, setIsHovered] = useState(false);

  const IS_WIFI_DATA_LOADING =
    wifiDataQuery.isLoading || wifiDataQuery.isFetching;

  const wifiDataItems = [
    {
      icon: <DownloadIcon className='w-3 h-3 text-muted-foreground' />,
      label: 'Down Speed',
      data: networkSpeedQuery?.data?.data.downloadSpeed,
    },
    {
      icon: <UploadIcon className='w-3 h-3 text-muted-foreground' />,
      label: 'Up Speed',
      data: networkSpeedQuery?.data?.data.uploadSpeed,
    },
    {
      icon: <StopwatchIcon className='w-3 h-3 text-muted-foreground' />,
      label: 'Ping',
      data: networkSpeedQuery?.data?.data.ping,
    },
  ];

  // Store the refetch function in a ref
  const refetchRef = useRef(wifiDataQuery.refetch);

  const stopWifiAssistant = () => {
    setWifiAsssistant(false);
    setIsHovered(false);
    setCountdown(5 * 60);
  };

  useEffect(() => {
    // Update the refetch ref whenever wifiResponse.refetch changes
    refetchRef.current = wifiDataQuery.refetch;
  }, [wifiDataQuery.refetch]);

  useEffect(() => {
    // If connection compass is running and we lose connection, stop it.
    if (!IS_CONNECTED_TO_INTERNET && wifiAssistant) {
      stopWifiAssistant();
    }
  }, [IS_CONNECTED_TO_INTERNET, wifiAssistant]);

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

  return (
    <div className='grid grid-cols-2 grid-rows-4 gap-4'>
      <div className='col-span-1 row-span-2'>
        <TableCard
          isError={!IS_CONNECTED_TO_INTERNET}
          error={
            <div className='flex flex-col items-start justify-between pb-2'>
              <h4 className='font-semibold tracking-wide text-md'>
                Awaiting Internet Connection...
              </h4>
              <p className='pt-2 text-xs tracking-wide text-muted-foreground'>
                Please connect to the internet to see your Internet Connection
                Metrics.
              </p>
            </div>
          }
          header={
            <div className='flex flex-col items-start justify-center'>
              <h4 className='font-semibold tracking-wide text-md'>
                Wi-Fi Connection Metrics
              </h4>

              {!wifiAssistant ? (
                <Badge
                  variant='outline'
                  className='my-2 bg-brand-magenta/10 dark:bg-brand-magenta/20 text-brand-magenta'
                >
                  <div className='flex flex-row items-center justify-center space-x-3'>
                    <Compass className='w-4 h-4' />
                    <p>Connection Compass Inactive</p>
                  </div>
                </Badge>
              ) : (
                <Badge
                  variant='outline'
                  className='my-2 bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal'
                >
                  <div className='flex flex-row items-center justify-center space-x-3'>
                    <Compass className='w-4 h-4' />
                    <p>Connection Compass Active</p>
                  </div>
                </Badge>
              )}
            </div>
          }
          isLoading={IS_WIFI_DATA_LOADING}
          footer={
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant='link'
                    className='font-semibold text-brand-teal'
                  >
                    More Information
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-[425px]'>
                  <div className='grid gap-4'>
                    <div className='space-y-2'>
                      <h4 className='font-medium leading-none w-80'>
                        Wi-Fi Connection Metrics
                      </h4>
                      <h4 className='text-sm leading-none text-muted-foreground w-80'>
                        Understanding Connection Quality at a Glance
                      </h4>
                      <Accordion type='single' collapsible className='w-full'>
                        <AccordionItem value='item-1'>
                          <AccordionTrigger>
                            What are Wi-Fi Connection Metrics?
                          </AccordionTrigger>
                          <AccordionContent>
                            Wi-Fi connection metrics are like a health checkup
                            for your internet. They help you understand how well
                            your Wi-Fi is doing so you can enjoy smoother video
                            calls, faster downloads, and more.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-2'>
                          <AccordionTrigger>Signal Strength</AccordionTrigger>
                          <AccordionContent>
                            {isMac
                              ? "Signal strength shows how strong your Wi-Fi connection is. You'll see it as a negative number like '-30' or '-70.' A rule of thumb: the closer the number is to zero, the stronger your connection. For example, -30 is very strong, but -80 is pretty weak."
                              : 'Think of your Wi-Fi signal strength like the bars on your cell phone. More bars mean a stronger connection. When the signal strength is high, your device communicates effectively with the Wi-Fi network, leading to a stable, fast internet experience.'}
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-3'>
                          <AccordionTrigger>Radio Type</AccordionTrigger>
                          <AccordionContent>
                            {isMac
                              ? "Radio Type on macOS shows the speed at which your device last sent data over Wi-Fi, represented by a number like '1300.' This is different from the typical Radio Type on other systems (802.11ac, 802.11ax, etc) but serves as a real-time indicator of your Wi-Fi performance. A higher number means faster data travel, and generally, anything above 500 is quite good."
                              : "The radio type refers to the Wi-Fi technology your device is using. Numbers like '802.11ac' or '802.11ax' tell you if you're on a modern, fast connection. Wi-Fi 5 (802.11ac) or Wi-Fi 6 (802.11ax) are the best to have. Older numbers may mean slower speeds."}
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-4'>
                          <AccordionTrigger>Channel</AccordionTrigger>
                          <AccordionContent>
                            The channel is like the lane your Wi-Fi uses on a
                            highway. If too many devices are on the same
                            channel, it can slow down your internet. You can
                            change your channel settings from your route&apos;s
                            admin page to potentially improve speed.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant='ghost'
                size='icon'
                disabled={IS_WIFI_DATA_LOADING}
                onClick={() => wifiDataQuery.refetch()}
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    IS_WIFI_DATA_LOADING && 'animate-spin'
                  }`}
                />
              </Button>
            </>
          }
        >
          <div className='flex flex-col'>
            <div>
              <div className='flex flex-row items-center justify-between pt-1'>
                <div className='flex items-center space-x-3'>
                  <Signal className='w-3 h-3 text-muted-foreground' />
                  <Label className='text-sm font-semibold'>
                    Signal Strength
                  </Label>
                </div>

                <ClipboardText
                  text={`${wifiDataQuery?.data?.data.signal.value}%`}
                />
              </div>
              <Separator />

              <div className='flex flex-row items-center justify-between py-1'>
                <div className='flex items-center space-x-3'>
                  <RadioTower className='w-3 h-3 text-muted-foreground' />
                  <Label className='text-sm font-semibold'>Radio Type</Label>
                </div>

                <ClipboardText
                  text={wifiDataQuery?.data?.data.radioType.value}
                />
              </div>
              <Separator />

              <div className='flex flex-row items-center justify-between pb-1'>
                <div className='flex items-center space-x-3'>
                  <Hash className='w-3 h-3 text-muted-foreground' />
                  <Label className='text-sm font-semibold'>Channel</Label>
                </div>

                <ClipboardText
                  text={wifiDataQuery?.data?.data.channel.value.toString()}
                />
              </div>
            </div>
          </div>
        </TableCard>
      </div>

      {!isDaaSMachine && (
        <div className='col-span-5'>
          <WifiSignalCard />
        </div>
      )}

      <div className='col-span-1 row-span-1'>
        <Card
          className={`p-4 shadow-xl ${
            !IS_CONNECTED_TO_INTERNET &&
            'bg-brand-magenta/10 dark:bg-brand-magenta/20'
          }`}
        >
          <div className='flex flex-row items-center justify-between pb-2'>
            <p className='font-semibold tracking-wide text-md'>
              Connection Compass
            </p>
            <DialogButton>
              <div className='grid gap-4'>
                <div className='space-y-2'>
                  <h4 className='font-medium leading-none w-80'>
                    Connection Compass
                  </h4>
                  <h4 className='text-sm leading-none text-muted-foreground w-80'>
                    Your Personal Guide to Optimal Wi-Fi Coverage
                  </h4>
                  <Accordion type='single' collapsible className='w-full'>
                    <AccordionItem value='item-1'>
                      <AccordionTrigger>
                        What is Connection Compass?
                      </AccordionTrigger>
                      <AccordionContent>
                        Connection Compass helps you find the strongest WiFi
                        signal in your location. Think of it as a guide, leading
                        you towards the most reliable internet connectivity.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='item-2'>
                      <AccordionTrigger>How does it work?</AccordionTrigger>
                      <AccordionContent>
                        Click &apos;Start&apos; to activate a 5-minute live
                        update of your WiFi signal strength, radio type, and
                        channel. Walk around with your device to find out the
                        best spots for a strong, stable connection in your home
                        or office.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </DialogButton>
          </div>

          {!wifiAssistant ? (
            <Button
              className='w-full'
              onClick={() => setWifiAsssistant(true)}
              disabled={IS_WIFI_DATA_LOADING || !IS_CONNECTED_TO_INTERNET}
            >
              <div className='flex flex-row items-center space-x-2 justify-evenly'>
                <Compass className='w-4 h-w' />
                <p>Start</p>
              </div>
            </Button>
          ) : (
            <div>
              <Button
                variant='destructive'
                className='w-full'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={stopWifiAssistant}
              >
                {isHovered ? (
                  <div className='flex flex-row items-center space-x-2 justify-evenly'>
                    <StopIcon className='w-4 h-w' />
                    <p>Stop</p>
                  </div>
                ) : (
                  `${Math.floor(countdown / 60)}:${
                    countdown % 60 < 10 ? '0' : ''
                  }${countdown % 60}`
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>

      <div className='col-span-1 row-span-1'>
        <Card
          className={`p-4 shadow-xl ${
            !IS_CONNECTED_TO_INTERNET &&
            'bg-brand-magenta/10 dark:bg-brand-magenta/20'
          }`}
        >
          <div className='flex flex-row items-center justify-between pb-2'>
            <p className='font-semibold tracking-wide text-md'>
              Run a Speed Test?
            </p>
            <DialogButton>
              <div className='grid gap-4'>
                <div className='space-y-2'>
                  <h4 className='font-medium leading-none w-80'>
                    Running an Internet Speed Test
                  </h4>
                  <h4 className='text-sm leading-none text-muted-foreground w-80'>
                    Assessing Your Internet Performance the Easy Way
                  </h4>
                  <Accordion type='single' collapsible className='w-full'>
                    <AccordionItem value='item-1'>
                      <AccordionTrigger>What is a Speed Test?</AccordionTrigger>
                      <AccordionContent>
                        A speed test is a simple tool used to measure the speed
                        of your internet connection. It works by sending a small
                        amount of data to a server and then measuring how
                        quickly that data can be downloaded (download speed) or
                        uploaded (upload speed). It also measures the time it
                        takes for a message to go from your device to the server
                        and back (ping).
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='item-2'>
                      <AccordionTrigger>
                        How it works - Selecting a Server
                      </AccordionTrigger>
                      <AccordionContent>
                        The speed test first selects the best server to use for
                        the test. This is usually the server that&apos;s
                        physically closest to you or the server with the least
                        congestion, as these factors can affect the results.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='item-3'>
                      <AccordionTrigger>
                        How it works - Measuring Ping
                      </AccordionTrigger>
                      <AccordionContent>
                        The speed test sends a message to the server and
                        measures how long it takes for the server to respond.
                        This is your ping.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='item-4'>
                      <AccordionTrigger>
                        How it works - Measuring Download Speed
                      </AccordionTrigger>
                      <AccordionContent>
                        The speed test downloads a file from the server and
                        measures how quickly the file is downloaded. This is
                        your download speed.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='item-5'>
                      <AccordionTrigger>
                        How it works - Measuring Upload Speed
                      </AccordionTrigger>
                      <AccordionContent>
                        The speed test uploads a file to the server and measures
                        how quickly the file is uploaded. This is your upload
                        speed.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </DialogButton>
          </div>

          {networkSpeedQuery.isFetching ? (
            <Button className='w-full' disabled variant='destructive'>
              <div className='flex flex-row items-center space-x-2 justify-evenly'>
                <Gauge className='w-4 h-w' />
                <p>Running Speed Test...</p>
              </div>
            </Button>
          ) : (
            <Button
              className='w-full'
              disabled={!IS_CONNECTED_TO_INTERNET}
              onClick={() => networkSpeedQuery.refetch()}
            >
              <div className='flex flex-row items-center space-x-2 justify-evenly'>
                <Gauge className='w-4 h-w' />
                <p>Run Speed Test Now</p>
              </div>
            </Button>
          )}
        </Card>
      </div>

      <div className='col-span-1 row-span-2'>
        <TableCard
          header={
            <div className='flex flex-col items-start justify-center'>
              <h4 className='font-semibold tracking-wide text-md'>
                Wi-Fi Speed Metrics
              </h4>

              {!networkSpeedQuery.isFetching ? (
                <Badge
                  variant='outline'
                  className='my-2 bg-brand-magenta/10 dark:bg-brand-magenta/20 text-brand-magenta'
                >
                  <div className='flex flex-row items-center justify-center space-x-3'>
                    <Gauge className='w-4 h-4' />
                    <p>Speed Test Inactive</p>
                  </div>
                </Badge>
              ) : (
                <Badge
                  variant='outline'
                  className='my-2 bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal'
                >
                  <div className='flex flex-row items-center justify-center space-x-3'>
                    <Gauge className='w-4 h-4' />
                    <p>Speed Test Active</p>
                  </div>
                </Badge>
              )}
            </div>
          }
          isLoading={networkSpeedQuery.isFetching}
          footer={
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant='link'
                    className='font-semibold text-brand-teal'
                  >
                    More Information
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-[425px]'>
                  <div className='grid gap-4'>
                    <div className='space-y-2'>
                      <h4 className='font-medium leading-none w-80'>
                        Wi-Fi Speed Metrics
                      </h4>
                      <h4 className='text-sm leading-none text-muted-foreground w-80'>
                        Understanding Connection Speed at a Glance
                      </h4>
                      <Accordion type='single' collapsible className='w-full'>
                        <AccordionItem value='item-1'>
                          <AccordionTrigger>
                            What are Wi-Fi Speed Metrics?
                          </AccordionTrigger>
                          <AccordionContent>
                            Wi-Fi speed metrics are crucial to understand the
                            speed at which data moves between your device and
                            the rest of the internet. Wi-Fi speed metrics impact
                            everything from how fast web pages load, to the
                            quality of your video calls, and whether your
                            streaming videos play smoothly.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-2'>
                          <AccordionTrigger>Download Speed</AccordionTrigger>
                          <AccordionContent>
                            The download speed is a measure of how fast data can
                            be transferred from the internet to your device.
                            This is often measured in megabits per second
                            (Mbps). When you&apos;re streaming a movie, loading
                            a webpage, or receiving an email, you&apos;re
                            downloading data. The higher your download speed,
                            the faster these activities will be. A high download
                            speed is particularly important for activities that
                            involve large amounts of data, like streaming
                            high-definition video or downloading large files.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-3'>
                          <AccordionTrigger>Upload Speed</AccordionTrigger>
                          <AccordionContent>
                            Upload speed is the flip side of download speed. It
                            measures how quickly data can be transferred from
                            your device to the internet. This is also measured
                            in Mbps. When you&apos;re sending an email,
                            uploading a photo to social media, or in a video
                            call, you&apos;re uploading data. Typically, upload
                            speeds are slower than download speeds, as most
                            people download much more data than they upload.
                            However, a high upload speed is important for
                            activities that involve sending large amounts of
                            data, like video calls or online gaming.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-4'>
                          <AccordionTrigger>Ping</AccordionTrigger>
                          <AccordionContent>
                            Ping measures the time it takes for a small amount
                            of data to be sent from your device to a server on
                            the internet and back. This is often measured in
                            milliseconds (ms). A lower ping means that the
                            connection is more responsive, which is particularly
                            important for real-time activities like video calls
                            or online gaming. In simple terms, if download and
                            upload speeds are about how much data can be moved
                            at once, ping is about how quickly any amount of
                            data can be moved. Even with high download and
                            upload speeds, a high (slow) ping can make your
                            connection feel slow.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              {networkSpeedQuery.isFetching ? (
                <Button variant='ghost' size='icon' disabled>
                  <RefreshCw className='w-4 h-4 animate-spin' />
                </Button>
              ) : (
                <p className='mr-2 text-sm font-semibold text-muted-foreground'>
                  {networkSpeedQuery?.data
                    ? dayjs(networkSpeedQuery?.data?.timestamp).format('h:mm A')
                    : ''}
                </p>
              )}
            </>
          }
        >
          <div className='flex flex-col mt-2'>
            <div>
              <div>
                {wifiDataItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <div className='flex flex-row items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        {item.icon}
                        <Label className='text-sm font-semibold'>
                          {item.label}
                        </Label>
                      </div>

                      {!networkSpeedQuery.isFetching && !item.data ? (
                        <p className='py-1 text-sm'>Awaiting Test</p>
                      ) : (
                        <ClipboardText text={`${item.data}`} />
                      )}
                    </div>

                    {/* Don't render Separator after the last item */}
                    {index < wifiDataItems.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </TableCard>
      </div>
    </div>
  );
};

export default NetworkHealthTabPage;
