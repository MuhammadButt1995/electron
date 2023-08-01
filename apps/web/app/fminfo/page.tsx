'use client';

import { useEffect, useState, useRef } from 'react';
import { useTabStateStore } from '@/store/tab-state-store';

import TabButton from './tab-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

import InternetConnectionCard from '@/components/Fminfo/cards/internet-connection-card';
import WifiSignalCard from '@/components/Fminfo/cards/wifi-signal-card';
import TrustedNetworkCard from '@/components/Fminfo/cards/trusted-network-card';
import ADStatusCard from '@/components/Fminfo/cards/ad-status-card';
import PasswordDataCard from '@/components/Fminfo/cards/password-data-card';
import DiskUsageCard from '@/components/Fminfo/cards/disk-usage-card';
import LastBootTimeCard from '@/components/Fminfo/cards/last-boot-time-card';
import BatteryHealthCard from '@/components/Fminfo/cards/battery-health-card';
import SSDHealthCard from '@/components/Fminfo/cards/ssd-health-card';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RefreshCw, Globe, Compass, Gauge } from 'lucide-react';
import ClipboardText from '@/components/clipboard-text';
import { useWiFiData } from '@/hooks/useQueryHooks/useWifiData';
import PopoverButton from '@/components/Fminfo/popover-button';
import DialogButton from '@/components/Fminfo/dialog-button';
import { useNetworkSpeed } from '@/hooks/useQueryHooks/useNetworkSpeed';
import { useGlobalStateStore } from '@/store/settings-store';
import { UploadIcon, DownloadIcon, StopwatchIcon } from '@radix-ui/react-icons';

import dayjs from 'dayjs';

import { useNetworkAdapters } from '@/hooks/useQueryHooks/useNetworkAdapters';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const Fminfo = () => {
  const {
    networkStatus,
    identityServicesStatus,
    deviceStatus,
    internetStatus,
    enterpriseStatus,
  } = useTabStateStore();

  const networkAdapterQuery = useNetworkAdapters();
  const wifiDataQuery = useWiFiData();
  const networkType = useGlobalStateStore((state) => state.trustedNetworkType);
  const networkSpeedQuery = useNetworkSpeed(networkType);

  const IS_NETWORK_ADAPTER_LOADING =
    networkAdapterQuery.isLoading || networkAdapterQuery.isFetching;

  const IS_WIFI_DATA_LOADING =
    wifiDataQuery.isLoading ||
    wifiDataQuery.isFetching ||
    wifiDataQuery.isPaused;

  const IS_NETWORK_SPEED_LOADING =
    networkSpeedQuery.isLoading || networkSpeedQuery.isFetching;

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

  const queryErrorMessage =
    'Whoops! Something went wrong while fetching this data. Please contact the tech center..';

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex flex-row items-center justify-start space-x-2'>
            <h2 className='text-brand-teal text-lg font-semibold'>FMInfo</h2>
            <Separator orientation='vertical' className='h-5' />
            <p className='text-sm'>
              Health metrics for your workspace environment.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue='network' className='mt-4'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='network'>
            <TabButton name='Network' allOk={networkStatus} />
          </TabsTrigger>
          <TabsTrigger value='identity-services'>
            <TabButton
              name='Identity Services'
              allOk={identityServicesStatus}
            />
          </TabsTrigger>
          <TabsTrigger value='device'>
            <TabButton name='Device' allOk={deviceStatus} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value='network'>
          <Tabs defaultValue='internet' className='mt-4'>
            <div className='flex items-center justify-start space-x-8'>
              <TabsList className='grid w-fit grid-cols-2'>
                <TabsTrigger value='internet'>
                  <TabButton name='Internet' allOk={internetStatus} />
                </TabsTrigger>
                <TabsTrigger value='company'>
                  <TabButton name='Enterprise' allOk={enterpriseStatus} />
                </TabsTrigger>
              </TabsList>

              <div>
                <TabsList className='grid w-fit grid-cols-1'>
                  <TabsTrigger value='health-hub'>
                    <p>Network Health Hub</p>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <ScrollArea className='mt-4 h-[19rem] pr-4'>
              <TabsContent value='internet'>
                <div className='grid w-full grid-cols-10 gap-4 pb-6'>
                  <div className='col-span-5'>
                    <InternetConnectionCard />
                  </div>

                  <div className='col-span-5'>
                    <WifiSignalCard queryErrorMessage={queryErrorMessage} />
                  </div>

                  <div className='col-span-7 pt-4'>
                    <Card className='shadow-xl'>
                      <div className='p-4'>
                        <div className='flex flex-row items-center justify-between pb-2'>
                          <h4 className='text-md font-semibold tracking-wide'>
                            Active Network Addresses
                          </h4>

                          <p className='text-muted-foreground text-sm font-semibold'>
                            {networkAdapterQuery?.data?.timestamp &&
                              dayjs(networkAdapterQuery.data.timestamp).format(
                                'h:mm A'
                              )}
                          </p>
                        </div>

                        {IS_NETWORK_ADAPTER_LOADING ? (
                          <div className='flex flex-row items-center justify-between pt-2'>
                            <div className='flex space-x-3'>
                              <Skeleton className='h-3 w-3 rounded-full' />
                              <Skeleton className='h-4 w-[75px]' />
                            </div>
                            <div>
                              <Skeleton className='h-4 w-[100px]' />
                            </div>
                          </div>
                        ) : (
                          <div className='flex flex-col'>
                            {Object.entries(
                              networkAdapterQuery.data.data.active_adapters ||
                                {}
                            ).map(([key, value]) => (
                              <div key={key}>
                                <div className='flex flex-row items-center justify-between pt-2'>
                                  <div className='flex space-x-3'>
                                    <Globe className='text-muted-foreground h-3 w-3' />
                                    <Label className='text-sm font-semibold'>
                                      {key}
                                    </Label>
                                  </div>

                                  <ClipboardText text={value} />
                                </div>
                                <Separator />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Separator />
                      <div className='bg-accent flex flex-row items-center justify-around'>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant='link'
                              className='hover:text-brand-teal'
                            >
                              What Are These Addresses?
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='max-w-[425px]'>
                            <DialogHeader>
                              <DialogTitle>
                                My Active Network Addresses
                              </DialogTitle>
                              <DialogDescription>
                                Your IP Address is will usually correspond to
                                the &quot;Wi-Fi&quot; or &quot;Ethernet&quot;
                                adapter.
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant='ghost'
                          size='icon'
                          disabled={IS_NETWORK_ADAPTER_LOADING}
                          onClick={() => networkAdapterQuery.refetch()}
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${
                              IS_NETWORK_ADAPTER_LOADING && 'animate-spin'
                            }`}
                          />
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='company'>
                <div className='grid grid-cols-2 gap-4'>
                  <TrustedNetworkCard queryErrorMessage={queryErrorMessage} />
                </div>
              </TabsContent>

              <TabsContent value='health-hub'>
                <div className='grid grid-cols-2 grid-rows-4 gap-4 pb-6'>
                  <div className='col-span-1 row-span-2'>
                    <Card className='shadow-xl'>
                      <div className='px-4 pb-2 pt-4'>
                        <div>
                          <div className='flex flex-col items-start justify-center'>
                            <h4 className='text-md font-semibold tracking-wide'>
                              Wi-Fi Connection Metrics
                            </h4>

                            {!wifiAssistant ? (
                              <Badge
                                variant='outline'
                                className='bg-brand-magenta/10  text-brand-magenta my-1'
                              >
                                <div className='flex flex-row items-center justify-center space-x-3'>
                                  <Compass className='h-4 w-4' />
                                  <p>Connection Compass Inactive</p>
                                </div>
                              </Badge>
                            ) : (
                              <Badge
                                variant='outline'
                                className='bg-brand-teal/10  text-brand-teal my-1'
                              >
                                <div className='flex flex-row items-center justify-center space-x-3'>
                                  <Compass className='h-4 w-4' />
                                  <p>Connection Compass Active</p>
                                </div>
                              </Badge>
                            )}
                          </div>
                        </div>

                        {IS_WIFI_DATA_LOADING ? (
                          <div className='flex flex-row items-center justify-between pt-2'>
                            <div className='flex space-x-3'>
                              <Skeleton className='h-3 w-3 rounded-full' />
                              <Skeleton className='h-4 w-[75px]' />
                            </div>
                            <div>
                              <Skeleton className='h-4 w-[100px]' />
                            </div>
                          </div>
                        ) : (
                          <div className='flex flex-col'>
                            <div>
                              <div className='flex flex-row items-center justify-between'>
                                <div className='flex'>
                                  <Label className='text-sm font-semibold'>
                                    Signal Strength
                                  </Label>
                                </div>

                                <ClipboardText
                                  text={`${wifiDataQuery?.data?.data.signal.value}%`}
                                />
                              </div>
                              <Separator />

                              <div className='flex flex-row items-center justify-between'>
                                <div className='flex'>
                                  <Label className='text-sm font-semibold'>
                                    Radio Type
                                  </Label>
                                </div>

                                <ClipboardText
                                  text={wifiDataQuery.data.data.radioType.value}
                                />
                              </div>
                              <Separator />

                              <div className='flex flex-row items-center justify-between'>
                                <div className='flex'>
                                  <Label className='text-sm font-semibold'>
                                    Channel
                                  </Label>
                                </div>

                                <ClipboardText
                                  text={wifiDataQuery.data.data.channel.value.toString()}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <Separator />
                      <div className='bg-accent flex flex-row items-center justify-around'>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant='link' className='text-brand-teal'>
                              What do these mean?
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='max-w-[425px]'>
                            <div className='grid gap-4'>
                              <div className='space-y-2'>
                                <h4 className='w-80 font-medium leading-none'>
                                  Wi-Fi Connection Metrics
                                </h4>
                                <h4 className='text-muted-foreground w-80 text-sm leading-none'>
                                  Understanding Connection Quality at a Glance
                                </h4>
                                <Accordion
                                  type='single'
                                  collapsible
                                  className='w-full'
                                >
                                  <AccordionItem value='item-1'>
                                    <AccordionTrigger>
                                      What are Wi-Fi Connection Metrics?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      Wi-Fi connection metrics are crucial to
                                      understand the performance and quality of
                                      your Wi-Fi connection. In simple terms,
                                      these metrics tell you how strong your
                                      Wi-Fi signal is, what kind of technology
                                      it&apos;s using, and how well it&apos;s
                                      performing.
                                    </AccordionContent>
                                  </AccordionItem>
                                  <AccordionItem value='item-2'>
                                    <AccordionTrigger>
                                      Signal Strength
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      Think of your Wi-Fi signal strength like
                                      the bars on your cell phone. More bars
                                      mean a stronger connection. When the
                                      signal strength is high, your device is
                                      able to communicate effectively with the
                                      Wi-Fi network, and you should experience a
                                      stable, fast internet connection. On the
                                      other hand, a low signal strength could
                                      lead to a slower connection or possible
                                      interruptions.
                                    </AccordionContent>
                                  </AccordionItem>
                                  <AccordionItem value='item-3'>
                                    <AccordionTrigger>
                                      Radio Type
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      The radio type refers to the Wi-Fi
                                      technology your device is using to connect
                                      to the Wi-Fi network. This is often
                                      represented as 802.11 followed by a letter
                                      or series of letters. Devices using Wi-Fi
                                      5 (802.11ac) or Wi-Fi 6 (802.11ax) are
                                      considered good, while Wi-Fi 4 (802.11n)
                                      is adequate, and anything older is poor
                                      and may limit your internet speed.
                                    </AccordionContent>
                                  </AccordionItem>
                                  <AccordionItem value='item-4'>
                                    <AccordionTrigger>Channel</AccordionTrigger>
                                    <AccordionContent>
                                      This is like the lane your Wi-Fi uses on a
                                      highway. If too many devices are in the
                                      same lane, it can get crowded and slow
                                      everyone down. Channels 1, 6, and 11 are
                                      often the least crowded in the 2.4 GHz
                                      band, while higher channels in the 5 GHz
                                      band are typically less congested. If you
                                      notice slower speeds, it may be because of
                                      congestion on that channel. In many Wi-Fi
                                      routers, you can manually change the
                                      channel, or you can set it to
                                      &quot;Auto,&quot; allowing the router to
                                      automatically select the best available
                                      channel.
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
                      </div>
                    </Card>
                  </div>

                  <div className='col-span-1 row-span-1'>
                    <WifiSignalCard queryErrorMessage={queryErrorMessage} />
                  </div>

                  <div className='col-span-1 row-span-1'>
                    <div className='col-span-1'>
                      <Card className='p-4 shadow-xl'>
                        <div className='flex flex-row items-center justify-between pb-2'>
                          <p className='text-md font-semibold tracking-wide'>
                            Connection Compass
                          </p>
                          <DialogButton>
                            <div className='grid gap-4'>
                              <div className='space-y-2'>
                                <h4 className='w-80 font-medium leading-none'>
                                  Connection Compass
                                </h4>
                                <h4 className='text-muted-foreground w-80 text-sm leading-none'>
                                  Your Personal Guide to Optimal Wi-Fi Coverage
                                </h4>
                                <Accordion
                                  type='single'
                                  collapsible
                                  className='w-full'
                                >
                                  <AccordionItem value='item-1'>
                                    <AccordionTrigger>
                                      What is Connection Compass?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      Connection Compass helps you find the
                                      strongest WiFi signal in your location.
                                      Think of it as a guide, leading you
                                      towards the most reliable internet
                                      connectivity.
                                    </AccordionContent>
                                  </AccordionItem>
                                  <AccordionItem value='item-2'>
                                    <AccordionTrigger>
                                      How does it work?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      Click &apos;Start&apos; to activate a
                                      5-minute live update of your WiFi signal
                                      strength, radio type, and channel. Walk
                                      around with your device to find out the
                                      best spots for a strong, stable connection
                                      in your home or office.
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
                          >
                            <div className='flex flex-row items-center justify-evenly space-x-2'>
                              <Compass className='h-w w-4' />
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
                              {isHovered
                                ? 'Stop'
                                : `${Math.floor(countdown / 60)}:${
                                    countdown % 60 < 10 ? '0' : ''
                                  }${countdown % 60}`}
                            </Button>
                          </div>
                        )}
                      </Card>
                    </div>
                  </div>

                  <div className='col-span-1 row-span-1'>
                    <Card className='p-4 shadow-xl'>
                      <div className='flex flex-row items-center justify-between pb-2'>
                        <p className='text-md font-semibold tracking-wide'>
                          Run a Speed Test?
                        </p>
                        <DialogButton>
                          <div className='grid gap-4'>
                            <div className='space-y-2'>
                              <h4 className='w-80 font-medium leading-none'>
                                Running an Internet Speed Test
                              </h4>
                              <h4 className='text-muted-foreground w-80 text-sm leading-none'>
                                Assessing Your Internet Performance the Easy Way
                              </h4>
                              <Accordion
                                type='single'
                                collapsible
                                className='w-full'
                              >
                                <AccordionItem value='item-1'>
                                  <AccordionTrigger>
                                    What is a Speed Test?
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    A speed test is a simple tool used to
                                    measure the speed of your internet
                                    connection. It works by sending a small
                                    amount of data to a server and then
                                    measuring how quickly that data can be
                                    downloaded (download speed) or uploaded
                                    (upload speed). It also measures the time it
                                    takes for a message to go from your device
                                    to the server and back (ping).
                                  </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value='item-2'>
                                  <AccordionTrigger>
                                    How it works - Selecting a Server
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    The speed test first selects the best server
                                    to use for the test. This is usually the
                                    server that&apos;s physically closest to you
                                    or the server with the least congestion, as
                                    these factors can affect the results.
                                  </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value='item-3'>
                                  <AccordionTrigger>
                                    How it works - Measuring Ping
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    The speed test sends a message to the server
                                    and measures how long it takes for the
                                    server to respond. This is your ping.
                                  </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value='item-4'>
                                  <AccordionTrigger>
                                    How it works - Measuring Download Speed
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    The speed test downloads a file from the
                                    server and measures how quickly the file is
                                    downloaded. This is your download speed.
                                  </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value='item-5'>
                                  <AccordionTrigger>
                                    How it works - Measuring Upload Speed
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    The speed test uploads a file to the server
                                    and measures how quickly the file is
                                    uploaded. This is your upload speed.
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                        </DialogButton>
                      </div>

                      {networkSpeedQuery.isFetching ? (
                        <Button
                          className='w-full'
                          disabled
                          variant='destructive'
                        >
                          <div className='flex flex-row items-center justify-evenly space-x-2'>
                            <Gauge className='h-w w-4' />
                            <p>Running Speed Test...</p>
                          </div>
                        </Button>
                      ) : (
                        <Button
                          className='w-full'
                          onClick={() => networkSpeedQuery.refetch()}
                        >
                          <div className='flex flex-row items-center justify-evenly space-x-2'>
                            <Gauge className='h-w w-4' />
                            <p>Run Speedtest Now</p>
                          </div>
                        </Button>
                      )}
                    </Card>
                  </div>

                  <div className='col-span-1 row-span-2'>
                    <Card className='shadow-xl'>
                      <div className='px-4 pb-2 pt-4'>
                        <div>
                          <div className='flex flex-col items-start justify-center'>
                            <h4 className='text-md font-semibold tracking-wide'>
                              Wi-Fi Speed Metrics
                            </h4>

                            {!networkSpeedQuery.isFetching ? (
                              <Badge
                                variant='outline'
                                className='bg-brand-magenta/10  text-brand-magenta my-1'
                              >
                                <div className='flex flex-row items-center justify-center space-x-3'>
                                  <Gauge className='h-4 w-4' />
                                  <p>Speedtest Inactive</p>
                                </div>
                              </Badge>
                            ) : (
                              <Badge
                                variant='outline'
                                className='bg-brand-teal/10  text-brand-teal my-1'
                              >
                                <div className='flex flex-row items-center justify-center space-x-3'>
                                  <Gauge className='h-4 w-4' />
                                  <p>Speedtest Active</p>
                                </div>
                              </Badge>
                            )}
                          </div>
                        </div>

                        {networkSpeedQuery.isFetching ? (
                          <div className='flex flex-row items-center justify-between pt-2'>
                            <div className='flex space-x-3'>
                              <Skeleton className='h-3 w-3 rounded-full' />
                              <Skeleton className='h-4 w-[75px]' />
                            </div>
                            <div>
                              <Skeleton className='h-4 w-[100px]' />
                            </div>
                          </div>
                        ) : (
                          <div className='mt-2 flex flex-col'>
                            <div>
                              <div>
                                <div className='flex flex-row items-center justify-between pt-2'>
                                  <div className='flex space-x-3'>
                                    <DownloadIcon className='text-muted-foreground h-3 w-3' />
                                    <Label className='text-sm font-semibold'>
                                      Down Speed
                                    </Label>
                                  </div>

                                  {!networkSpeedQuery.isFetching &&
                                  !networkSpeedQuery.data ? (
                                    <p className='text-sm'>Awaiting Test</p>
                                  ) : (
                                    <ClipboardText
                                      text={`${networkSpeedQuery?.data?.data.downloadSpeed}`}
                                    />
                                  )}
                                </div>
                                <Separator />

                                <div className='flex flex-row items-center justify-between pt-2'>
                                  <div className='flex space-x-3'>
                                    <UploadIcon className='text-muted-foreground h-3 w-3' />
                                    <Label className='text-sm font-semibold'>
                                      Up Speed
                                    </Label>
                                  </div>

                                  {!networkSpeedQuery.isFetching &&
                                  !networkSpeedQuery.data ? (
                                    <p className='text-sm'>Awaiting Test</p>
                                  ) : (
                                    <ClipboardText
                                      text={`${networkSpeedQuery?.data?.data.uploadSpeed}`}
                                    />
                                  )}
                                </div>
                                <Separator />

                                <div className='flex flex-row items-center justify-between pt-2'>
                                  <div className='flex space-x-3'>
                                    <StopwatchIcon className='text-muted-foreground h-3 w-3' />
                                    <Label className='text-sm font-semibold'>
                                      Ping
                                    </Label>
                                  </div>

                                  {!networkSpeedQuery.isFetching &&
                                  !networkSpeedQuery.data ? (
                                    <p className='text-sm'>Awaiting Test</p>
                                  ) : (
                                    <ClipboardText
                                      text={`${networkSpeedQuery?.data?.data.ping}`}
                                    />
                                  )}
                                </div>
                                <Separator />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <Separator />
                      <div className='bg-accent flex flex-row items-center justify-evenly'>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant='link' className='text-brand-teal'>
                              What do these mean?
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='max-w-[425px]'>
                            <div className='grid gap-4'>
                              <div className='space-y-2'>
                                <h4 className='w-80 font-medium leading-none'>
                                  Wi-Fi Speed Metrics
                                </h4>
                                <h4 className='text-muted-foreground w-80 text-sm leading-none'>
                                  Understanding Connection Speed at a Glance
                                </h4>
                                <Accordion
                                  type='single'
                                  collapsible
                                  className='w-full'
                                >
                                  <AccordionItem value='item-1'>
                                    <AccordionTrigger>
                                      What are Wi-Fi Speed Metrics?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      Wi-Fi speed metrics are crucial to
                                      understand the speed at which data moves
                                      between your device and the rest of the
                                      internet. Wi-Fi speed metrics impact
                                      everything from how fast web pages load,
                                      to the quality of your video calls, and
                                      whether your streaming videos play
                                      smoothly.
                                    </AccordionContent>
                                  </AccordionItem>
                                  <AccordionItem value='item-2'>
                                    <AccordionTrigger>
                                      Download Speed
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      The download speed is a measure of how
                                      fast data can be transferred from the
                                      internet to your device. This is often
                                      measured in megabits per second (Mbps).
                                      When you&apos;re streaming a movie,
                                      loading a webpage, or receiving an email,
                                      you&apos;re downloading data. The higher
                                      your download speed, the faster these
                                      activities will be. A high download speed
                                      is particularly important for activities
                                      that involve large amounts of data, like
                                      streaming high-definition video or
                                      downloading large files.
                                    </AccordionContent>
                                  </AccordionItem>
                                  <AccordionItem value='item-3'>
                                    <AccordionTrigger>
                                      Upload Speed
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      Upload speed is the flip side of download
                                      speed. It measures how quickly data can be
                                      transferred from your device to the
                                      internet. This is also measured in Mbps.
                                      When you&apos;re sending an email,
                                      uploading a photo to social media, or in a
                                      video call, you&apos;re uploading data.
                                      Typically, upload speeds are slower than
                                      download speeds, as most people download
                                      much more data than they upload. However,
                                      a high upload speed is important for
                                      activities that involve sending large
                                      amounts of data, like video calls or
                                      online gaming.
                                    </AccordionContent>
                                  </AccordionItem>
                                  <AccordionItem value='item-4'>
                                    <AccordionTrigger>Ping</AccordionTrigger>
                                    <AccordionContent>
                                      Ping measures the time it takes for a
                                      small amount of data to be sent from your
                                      device to a server on the internet and
                                      back. This is often measured in
                                      milliseconds (ms). A lower ping means that
                                      the connection is more responsive, which
                                      is particularly important for real-time
                                      activities like video calls or online
                                      gaming. In simple terms, if download and
                                      upload speeds are about how much data can
                                      be moved at once, ping is about how
                                      quickly any amount of data can be moved.
                                      Even with high download and upload speeds,
                                      a high (slow) ping can make your
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
                            <RefreshCw className='h-4 w-4 animate-spin' />
                          </Button>
                        ) : (
                          <p className='text-muted-foreground text-sm font-semibold'>
                            {networkSpeedQuery?.data
                              ? dayjs(
                                  networkSpeedQuery?.data?.timestamp
                                ).format('h:mm A')
                              : ''}
                          </p>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </TabsContent>

        <TabsContent value='identity-services' className='pt-4'>
          <ScrollArea className='h-72 pr-4'>
            <div className='grid grid-cols-2 gap-4'>
              <PasswordDataCard queryErrorMessage={queryErrorMessage} />
              <ADStatusCard queryErrorMessage={queryErrorMessage} />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value='device' className='pt-4'>
          <ScrollArea className='h-72 pr-4'>
            <div className='grid grid-cols-2 gap-4'>
              <BatteryHealthCard queryErrorMessage={queryErrorMessage} />
              <SSDHealthCard queryErrorMessage={queryErrorMessage} />
              <DiskUsageCard queryErrorMessage={queryErrorMessage} />
              <LastBootTimeCard queryErrorMessage={queryErrorMessage} />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Fminfo;
