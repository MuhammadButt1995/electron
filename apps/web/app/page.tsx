'use client';

import { useTabStateStore } from '@/store/tab-state-store';

import InternetTabPage from '@/components/fminfo/tab-page/internet-tab-page';
import EnterpriseTabPage from '@/components/fminfo/tab-page/enterprise-tab-page';
import NetworkHealthTabPage from '@/components/fminfo/tab-page/network-health-tab-page';
import IdentityServicesTabPage from '@/components/fminfo/tab-page/identity-services-tab-page';
import DeviceTabPage from '@/components/fminfo/tab-page/device-tab-page';

import TabButton from '@/components/fminfo/ui/tab-button';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useDaaSStatus } from './hooks/useQueryHooks/useDaasStatus';
import { useGlobalStateStore } from './store/global-state-store';

const Fminfo = () => {
  const {
    networkStatus,
    identityServicesStatus,
    deviceStatus,
    internetStatus,
    enterpriseStatus,
  } = useTabStateStore();

  const daasStatusQuery = useDaaSStatus();

  const updateIsDaaSMachine = useGlobalStateStore(
    (state) => state.updateIsDaaSMachine
  );

  updateIsDaaSMachine(daasStatusQuery?.data?.data.isOnDaas);

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex flex-row items-center justify-start space-x-2'>
            <h2 className='text-lg font-semibold text-brand-teal'>FMInfo</h2>
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
              <TabsList className='grid grid-cols-2 w-fit'>
                <TabsTrigger value='internet'>
                  <TabButton name='Internet' allOk={internetStatus} />
                </TabsTrigger>
                <TabsTrigger value='enterprise'>
                  <TabButton name='Enterprise' allOk={enterpriseStatus} />
                </TabsTrigger>
              </TabsList>

              <div>
                <TabsList className='grid grid-cols-1 w-fit'>
                  <TabsTrigger value='health-hub'>
                    <p>Network Health Hub</p>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <ScrollArea className='h-[20.5rem] pr-4'>
              <TabsContent value='internet' className='pt-4'>
                <InternetTabPage />
              </TabsContent>

              <TabsContent value='enterprise' className='pt-4'>
                <EnterpriseTabPage />
              </TabsContent>

              <TabsContent value='health-hub' className='pt-4'>
                <NetworkHealthTabPage />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </TabsContent>

        <TabsContent value='identity-services' className='pt-4'>
          <ScrollArea className='h-[22rem] pr-4'>
            <IdentityServicesTabPage />
          </ScrollArea>
        </TabsContent>

        <TabsContent value='device' className='pt-4'>
          <ScrollArea className='h-[22rem] pr-4'>
            <DeviceTabPage />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Fminfo;
