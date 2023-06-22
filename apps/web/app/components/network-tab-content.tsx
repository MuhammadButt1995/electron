import { Lock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import StatefulCard from '@/components/stateful-card';
import { ConnectionState } from '@/store/connection-store';

type NetworkTabContentProps = {
  internetConnection: 'CONNECTED' | 'NOT CONNECTED';
  domainConnection: ConnectionState;
};

const NetworkTabContent = ({
  internetConnection,
  domainConnection,
}: NetworkTabContentProps) => (
  <ScrollArea>
    <div className='grid grid-cols-1 gap-4 pt-6'>
      <StatefulCard
        state={
          internetConnection === 'CONNECTED' ? domainConnection.status : 'ERROR'
        }
        title='TRUSTED NETWORK'
        icon={<Lock className='mr-2 h-4 w-4' />}
        description={
          internetConnection === 'CONNECTED'
            ? domainConnection.description
            : 'Please connect to the internet to see your connection to a trusted network.'
        }
      />
    </div>
  </ScrollArea>
);

export default NetworkTabContent;
