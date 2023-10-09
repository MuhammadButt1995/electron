'use client';

import dayjs from 'dayjs';
import { RefreshCw, Factory, Laptop, Hash, Cpu } from 'lucide-react';
import { IdCardIcon } from '@radix-ui/react-icons';

import { useDeviceData } from '@/hooks/useQueryHooks/useDeviceData';
import { camelToNormalText } from '@/lib/utils';
import { useGlobalStateStore } from '@/store/global-state-store';

import BatteryHealthCard from '@/components/fminfo/cards/battery-health-card';
import DiskUsageCard from '@/components/fminfo/cards/disk-usage-card';
import LastBootTimeCard from '@/components/fminfo/cards/last-boot-time-card';
import SSDHealthCard from '@/components/fminfo/cards/ssd-health-card';
import ClipboardText from '@/components/text/clipboard-text';
import TableCard from '@/components/fminfo/ui/table-card';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const DeviceTabPage = () => {
  const isDaaSMachine = useGlobalStateStore((state) => state.isDaaSMachine);
  const deviceDataQuery = useDeviceData();

  const IS_DEVICE_DATA_LOADING =
    deviceDataQuery.isLoading || deviceDataQuery.isFetching;

  const deviceIconMapping = {
    computerName: <IdCardIcon className='w-4 h-4 text-muted-foreground' />,
    ram: <Cpu className='w-4 h-4 text-muted-foreground' />,
    manufacturer: <Factory className='w-4 h-4 text-muted-foreground' />,
    model: <Laptop className='w-4 h-4 text-muted-foreground' />,
    serialNumber: <Hash className='w-4 h-4 text-muted-foreground' />,
  };

  return (
    <div className='grid w-full grid-cols-10 gap-4'>
      {!isDaaSMachine && (
        <>
          <div className='col-span-5'>
            <BatteryHealthCard />
          </div>
          <div className='col-span-5'>
            <SSDHealthCard />
          </div>
        </>
      )}

      <div className='col-span-5'>
        <DiskUsageCard />
      </div>

      <div className='col-span-5'>
        <LastBootTimeCard />
      </div>

      <div className='col-span-7'>
        <TableCard
          header={
            <div className='flex flex-row items-center justify-between pb-2'>
              <h4 className='font-semibold tracking-wide text-md'>
                Device Details
              </h4>
            </div>
          }
          isLoading={IS_DEVICE_DATA_LOADING}
          footer={
            <>
              <Button
                variant='ghost'
                size='icon'
                disabled={IS_DEVICE_DATA_LOADING}
                onClick={() => deviceDataQuery.refetch()}
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    IS_DEVICE_DATA_LOADING && 'animate-spin'
                  }`}
                />
              </Button>

              <Separator orientation='vertical' className='h-5 bg-primary/60' />

              <p className='text-sm font-semibold text-muted-foreground'>
                {deviceDataQuery?.data?.timestamp &&
                  dayjs(deviceDataQuery.data.timestamp).format('h:mm A')}
              </p>
            </>
          }
        >
          <div className='flex flex-col'>
            {Object.entries(deviceDataQuery?.data?.data || {}).map(
              ([key, value], index, array) => (
                <div key={key}>
                  <div className='flex flex-row items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      {deviceIconMapping[key]}
                      <Label className='text-sm font-semibold'>
                        {camelToNormalText(key)}
                      </Label>
                    </div>

                    <ClipboardText text={value.toString()} />
                  </div>
                  {index !== array.length - 1 && <Separator />}
                </div>
              )
            )}
          </div>
        </TableCard>
      </div>
    </div>
  );
};

export default DeviceTabPage;
