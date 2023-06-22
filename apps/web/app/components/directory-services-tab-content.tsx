import { OS } from '@mantine/hooks';
import { Laptop } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import StatefulCard from '@/components/stateful-card';
import { ConnectionState } from '@/store/connection-store';

type DirectoryServicesTabContentProps = {
  ADConnection: ConnectionState;
  os: OS;
};

const DirectoryServicesTabContent = ({
  ADConnection,
  os,
}: DirectoryServicesTabContentProps) => (
  <ScrollArea>
    <div className='grid grid-cols-1 gap-4 pt-6'>
      <StatefulCard
        state={ADConnection.status}
        title={os === 'macos' ? 'ON-PREM AD' : 'AZURE AD'}
        icon={<Laptop className='mr-2 h-4 w-4' />}
        description={ADConnection.description}
      />
    </div>
  </ScrollArea>
);

export default DirectoryServicesTabContent;
