'use client';

import { useTabStateStore } from '@/store/tab-state-store';

import TabButton from './tab-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

import InternetConnectionCard from '@/components/Fminfo/internet-connection-card';
import WifiSignalCard from '@/components/Fminfo/wifi-signal-card';
import TrustedNetworkCard from '@/components/Fminfo/trusted-network-card';
import ADStatusCard from '@/components/Fminfo/ad-status-card';
import PasswordDataCard from '@/components/Fminfo/password-data-card';
import DiskUsageCard from '@/components/Fminfo/disk-usage-card';
import LastBootTimeCard from '@/components/Fminfo/last-boot-time-card';

const Fminfo = () => {
  const {
    networkStatus,
    identityServicesStatus,
    deviceStatus,
    internetStatus,
    enterpriseStatus,
  } = useTabStateStore();

  const queryErrorMessage =
    'Whoops! Something went wrong while fetching this data. Please contact the tech center..';

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold tracking-tight'>FMInfo</h2>
          <p className='text-muted-foreground text-sm'>
            Everything to know about your workplace environment - in real time.
          </p>
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
            <div className='flex items-center justify-start space-x-10'>
              <TabsList className='grid w-fit grid-cols-2'>
                <TabsTrigger value='internet'>
                  <TabButton name='Internet' allOk={internetStatus} />
                </TabsTrigger>
                <TabsTrigger value='company'>
                  <TabButton name='Enterprise' allOk={enterpriseStatus} />
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className='mt-4 h-64 pr-4'>
              <TabsContent value='internet'>
                <div className='grid grid-cols-1 gap-4'>
                  <InternetConnectionCard />
                  <WifiSignalCard queryErrorMessage={queryErrorMessage} />
                </div>
              </TabsContent>

              <TabsContent value='company'>
                <div className='grid grid-cols-1 gap-4'>
                  <TrustedNetworkCard queryErrorMessage={queryErrorMessage} />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </TabsContent>

        <TabsContent value='identity-services' className='pt-4'>
          <ScrollArea className='h-72 pr-4'>
            <div className='grid grid-cols-1 gap-4'>
              <ADStatusCard queryErrorMessage={queryErrorMessage} />
              <PasswordDataCard queryErrorMessage={queryErrorMessage} />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value='device' className='pt-4'>
          <ScrollArea className='h-72 pr-4'>
            <div className='grid grid-cols-1 gap-4'>
              <LastBootTimeCard queryErrorMessage={queryErrorMessage} />
              <DiskUsageCard queryErrorMessage={queryErrorMessage} />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Fminfo;
