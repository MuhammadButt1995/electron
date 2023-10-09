'use client';

import dayjs from 'dayjs';
import { RefreshCw, KeyRound, Network, User2, History } from 'lucide-react';

import { useGlobalStateStore } from '@/store/global-state-store';
import { useDomainData } from '@/hooks/useQueryHooks/useDomainData';
import { camelToNormalText } from '@/lib/utils';

import ADStatusCard from '@/components/fminfo/cards/ad-status-card';
import PasswordDataCard from '@/components/fminfo/cards/password-data-card';
import TableCard from '@/components/fminfo/ui/table-card';
import ClipboardText from '@/components/text/clipboard-text';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const IdentityServicesTabPage = () => {
  const onLinkClick = (event: any) => {
    event.preventDefault();
    window.meta.openLink('');
  };

  const domainDataQuery = useDomainData();

  const IS_DOMAIN_DATA_LOADING =
    domainDataQuery.isLoading || domainDataQuery.isFetching;

  const IS_CONNECTED_TO_INTERNET = useGlobalStateStore(
    (state) => state.isConnectedToInternet
  );

  const IS_ON_TRUSTED_NETWORK = useGlobalStateStore(
    (state) => state.isOnTrustedNetwork
  );

  const IS_CONNECTED_AND_TRUSTED =
    IS_CONNECTED_TO_INTERNET && IS_ON_TRUSTED_NETWORK;

  // const IS_CONNECTED_AND_TRUSTED = IS_CONNECTED_TO_INTERNET && true;

  const domainIconMapping = {
    loggedOnDomain: <Network className='w-4 h-4 text-muted-foreground' />,
    loggedOnUser: <User2 className='w-4 h-4 text-muted-foreground' />,
    lastLogonTime: <History className='w-4 h-4 text-muted-foreground' />,
  };

  return (
    <div className='grid w-full grid-cols-10 gap-4'>
      <div className='col-span-5'>
        <PasswordDataCard />
      </div>

      <div className='col-span-5'>
        <ADStatusCard />
      </div>

      <div className='col-span-6 row-span-2'>
        <TableCard
          isError={!IS_CONNECTED_AND_TRUSTED}
          error={
            <div className='flex flex-col items-start justify-between pb-2'>
              <h4 className='font-semibold tracking-wide text-md'>
                {IS_CONNECTED_TO_INTERNET
                  ? 'Awaiting ZPA/VPN Connection...'
                  : 'Awaiting Internet Connection...'}
              </h4>
              <p className='pt-2 text-xs tracking-wide text-muted-foreground'>
                {IS_CONNECTED_TO_INTERNET
                  ? 'Please connect to either ZScaler ZPA or Citrix VPN to see your User and Domain Details.'
                  : 'Please connect to the internet to see your User and Domain Details.'}
              </p>
            </div>
          }
          header={
            <div className='flex flex-row items-center justify-between pb-2'>
              <h4 className='font-semibold tracking-wide text-md'>
                User & Domain Details
              </h4>
            </div>
          }
          isLoading={IS_DOMAIN_DATA_LOADING}
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
                        User & Domain Details
                      </h4>
                      <h4 className='text-sm leading-none text-muted-foreground w-80'>
                        Understanding Your Account and Network Usage
                      </h4>
                      <Accordion type='single' collapsible className='w-full'>
                        <AccordionItem value='item-1'>
                          <AccordionTrigger>Logged On Domain</AccordionTrigger>
                          <AccordionContent>
                            Your current network. This indicates the network (or
                            &apos;domain&apos;) that you&apos;re currently
                            logged into. This could be your work, school, or
                            other organizational network. Knowing your current
                            domain can help you understand where your
                            information is being accessed and stored, ensuring
                            you&apos;re connected to the right network.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-2'>
                          <AccordionTrigger>Logged On User</AccordionTrigger>
                          <AccordionContent>
                            Your user account. This shows the username that
                            you&apos;re currently logged in as. This can be
                            helpful in identifying if you&apos;re using the
                            correct account, especially if you handle multiple
                            usernames or profiles.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-3'>
                          <AccordionTrigger>Last Logon Time</AccordionTrigger>
                          <AccordionContent>
                            Your last sign-in time. This is the exact date and
                            time when you last logged into your account. Keeping
                            track of this can be useful to verify your recent
                            activity and ensure that there hasn&apos;t been any
                            unexpected or unauthorized access to your account.
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
                disabled={IS_DOMAIN_DATA_LOADING}
                onClick={() => domainDataQuery.refetch()}
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    IS_DOMAIN_DATA_LOADING && 'animate-spin'
                  }`}
                />
              </Button>

              <div className='flex flex-row items-center'>
                <Separator
                  orientation='vertical'
                  className='h-5 mr-4 bg-primary/60'
                />
                <p className='text-sm font-semibold text-muted-foreground'>
                  {domainDataQuery?.data?.timestamp &&
                    dayjs(domainDataQuery.data.timestamp).format('h:mm A')}
                </p>
              </div>
            </>
          }
        >
          <div className='flex flex-col'>
            {Object.entries(domainDataQuery?.data?.data || {}).map(
              ([key, value], index, array) => (
                <div key={key}>
                  <div className='flex flex-row items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      {domainIconMapping[key]}
                      <Label className='text-sm font-semibold'>
                        {camelToNormalText(key)}
                      </Label>
                    </div>

                    <ClipboardText text={value} />
                  </div>
                  {index !== array.length - 1 && <Separator />}
                </div>
              )
            )}
          </div>
        </TableCard>
      </div>

      <div className='col-span-4 pt-8'>
        <Button className='w-full'>
          <div className='flex flex-row items-center space-x-2 justify-evenly'>
            <KeyRound className='w-4 h-w' />
            <p>Reset Password</p>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default IdentityServicesTabPage;
