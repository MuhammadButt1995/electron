'use client';

import dayjs from 'dayjs';
import { RefreshCw, Globe } from 'lucide-react';

import { useNetworkAdapters } from '@/hooks/useQueryHooks/useNetworkAdapters';

import InternetConnectionCard from '@/components/fminfo/cards/internet-connection-card';
import WifiSignalCard from '@/components/fminfo/cards/wifi-signal-card';
import TableCard from '@/components/fminfo/ui/table-card';
import ClipboardText from '@/components/text/clipboard-text';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const InternetTabPage = () => {
  const networkAdapterQuery = useNetworkAdapters();
  const IS_NETWORK_ADAPTER_LOADING =
    networkAdapterQuery.isLoading || networkAdapterQuery.isFetching;

  return (
    <div className='grid w-full grid-cols-10 gap-4'>
      <div className='col-span-5'>
        <InternetConnectionCard />
      </div>

      <div className='col-span-5'>
        <WifiSignalCard />
      </div>

      <div className='col-span-7 pt-4'>
        <TableCard
          header={
            <div className='flex flex-row items-center justify-between pb-2'>
              <h4 className='font-semibold tracking-wide text-md'>
                Active Network Addresses
              </h4>
            </div>
          }
          isLoading={IS_NETWORK_ADAPTER_LOADING}
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
                  <DialogHeader>
                    <DialogTitle>My Active Network Addresses</DialogTitle>
                    <DialogDescription>
                      Your IP Address is will usually correspond to the
                      &quot;Wi-Fi&quot; or &quot;Ethernet&quot; adapter.
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

              <div className='flex flex-row items-center space-x-6'>
                <Separator
                  orientation='vertical'
                  className='h-5 bg-primary/60'
                />
                <p className='text-sm font-semibold text-muted-foreground'>
                  {networkAdapterQuery?.data?.timestamp &&
                    dayjs(networkAdapterQuery.data.timestamp).format('h:mm A')}
                </p>
              </div>
            </>
          }
        >
          <div className='flex flex-col'>
            {Object.entries(
              networkAdapterQuery?.data?.data.active_adapters || {}
            ).map(([key, value]) => (
              <div key={key}>
                <div className='flex flex-row items-center justify-between pt-2'>
                  <div className='flex items-center space-x-3'>
                    <Globe className='w-4 h-4 text-muted-foreground' />
                    <Label className='text-sm font-semibold'>{key}</Label>
                  </div>

                  <ClipboardText text={value} />
                </div>
              </div>
            ))}
          </div>
        </TableCard>
      </div>
    </div>
  );
};

export default InternetTabPage;
