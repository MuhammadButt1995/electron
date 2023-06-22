import { Wifi, Signal, HelpCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import StatefulCard from '@/components/stateful-card';
import { WiFiState } from '@/store/wifi-assistant-store';
import StatefulCardInfoButton from './stateful-card-info-button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { PopoverContent } from '@/components/ui/popover';
import RouterButton from '@/components/router-button';

type InternetTabContentProps = {
  internetConnection: 'CONNECTED' | 'NOT CONNECTED';
  wifiDetails: WiFiState;
};

const InternetTabContent = ({
  internetConnection,
  wifiDetails,
}: InternetTabContentProps) => (
  <ScrollArea>
    <div className='grid grid-cols-1 gap-4 pt-6'>
      <StatefulCard
        state={internetConnection}
        title='INTERNET CONNECTION'
        icon={<Wifi className='mr-2 h-4 w-4' />}
        description={
          internetConnection === 'CONNECTED'
            ? 'You are connected to the Internet.'
            : 'Please connect to a Wi-Fi network or switch to a hardwired connection.'
        }
      />

      <StatefulCard
        state={
          internetConnection === 'CONNECTED' ? wifiDetails.status : 'ERROR'
        }
        title='WI-FI SIGNAL'
        icon={<Signal className='mr-2 h-4 w-4' />}
        description={
          internetConnection === 'CONNECTED'
            ? wifiDetails.description
            : 'Please connect to a Wi-Fi network for signal information.'
        }
      >
        <StatefulCardInfoButton icon={<HelpCircle className='h-4 w-4' />}>
          <PopoverContent
            className='w-120'
            collisionPadding={{
              top: 40,
              left: 20,
              right: 20,
              bottom: 20,
            }}
          >
            <div className='grid gap-4'>
              <div className='space-y-2'>
                <h4 className='font-medium leading-none'>
                  How we&apos;re measuring your Wi-Fi signal
                </h4>
                <p className='text-muted-foreground w-72 text-sm'>
                  We&apos;re using a weighted average from analyzing these data
                  points from your machine:
                </p>
              </div>
              <div className='grid gap-2'>
                <div className='grid grid-cols-3 items-center gap-4'>
                  <Label htmlFor='width'>Signal Strength</Label>
                  <Input
                    id='width'
                    disabled
                    defaultValue={`${wifiDetails.data.signal}%`}
                    className='col-span-2 h-8'
                  />
                </div>
                <div className='grid grid-cols-3 items-center gap-4'>
                  <Label htmlFor='maxWidth'>Radio Type</Label>
                  <Input
                    id='maxWidth'
                    disabled
                    defaultValue={wifiDetails.data.link}
                    className='col-span-2 h-8'
                  />
                </div>
                <div className='grid grid-cols-3 items-center gap-4'>
                  <Label htmlFor='height'>Channel</Label>
                  <Input
                    id='height'
                    disabled
                    defaultValue={wifiDetails.data.channel}
                    className='col-span-2 h-8'
                  />
                </div>
                <RouterButton
                  title='Learn More'
                  variant='outline'
                  classNames='mt-2'
                  route='/info/wifi-factors'
                />
              </div>
            </div>
          </PopoverContent>
        </StatefulCardInfoButton>
      </StatefulCard>
    </div>
  </ScrollArea>
);

export default InternetTabContent;
