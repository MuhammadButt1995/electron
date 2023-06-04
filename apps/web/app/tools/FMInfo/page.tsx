/* eslint-disable arrow-body-style */

import { Card, CardContent } from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import FMInfoSection from './fminfo-section';

const FMInfoPage = () => {
  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>FMInfo</h2>
          <p className='text-muted-foreground text-sm'>
            Your system & user data.
          </p>
        </div>
      </div>

      <Card className='mt-4'>
        <CardContent className='p-4'>
          <Tabs defaultValue='user'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='user'>User</TabsTrigger>
              <TabsTrigger value='device'>Device</TabsTrigger>
              <TabsTrigger value='networking'>Networking</TabsTrigger>
            </TabsList>
            <ScrollArea className='h-[300px] w-fit pr-4'>
              <TabsContent value='user'>
                {/* @ts-expect-error Server Component */}
                <FMInfoSection section='user' />
              </TabsContent>
              <TabsContent value='device'>
                {/* @ts-expect-error Server Component */}
                <FMInfoSection section='device' />
              </TabsContent>
              <TabsContent value='networking'>
                {/* @ts-expect-error Server Component */}
                <FMInfoSection section='network' />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FMInfoPage;
