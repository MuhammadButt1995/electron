'use client';

import { useEffect } from 'react';
import { useOs, useNetwork } from '@mantine/hooks';
import { useDomainConnection } from '@/hooks/useDomainConnection';
import { useADConnection } from '@/hooks/useADConnection';
import { useWiFiDetails } from '@/hooks/useWiFiDetails';
import InternetTabContent from '@/components/internet-tab-content';
import NetworkTabContent from '@/components/network-tab-content';
import DirectoryServicesTabContent from '@/components/directory-services-tab-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TabButton from '@/components/tab-button';

const HomePage = () => {
  const ADConnection = useADConnection();
  const domainConnection = useDomainConnection();
  const wifiDetails = useWiFiDetails();
  const os = useOs();

  const networkStatus = useNetwork();
  const isOnWiredConnection = networkStatus.type === 'ethernet';
  const internetConnection = networkStatus.online
    ? 'CONNECTED'
    : 'NOT CONNECTED';

  useEffect(() => {
    window.onInternetStatusChange(internetConnection);
  }, [internetConnection]);

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Your Talos Home
          </h2>
          <p className='text-muted-foreground text-sm'>
            Live health metrics for your work environment.
          </p>
        </div>
      </div>

      <Tabs defaultValue='internet' className='mt-4'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='internet'>
            <TabButton
              title='Internet'
              statuses={[internetConnection, wifiDetails.status]}
            />
          </TabsTrigger>
          <TabsTrigger value='network'>
            <TabButton title='Network' statuses={[domainConnection.status]} />
          </TabsTrigger>
          <TabsTrigger value='directory-services'>
            <TabButton
              title='Directory Services'
              statuses={[ADConnection.status]}
            />
          </TabsTrigger>
        </TabsList>

        <TabsContent value='internet'>
          <InternetTabContent
            internetConnection={internetConnection}
            wifiDetails={wifiDetails}
          />
        </TabsContent>

        <TabsContent value='network'>
          <NetworkTabContent
            internetConnection={internetConnection}
            domainConnection={domainConnection}
          />
        </TabsContent>

        <TabsContent value='directory-services'>
          <DirectoryServicesTabContent ADConnection={ADConnection} os={os} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
