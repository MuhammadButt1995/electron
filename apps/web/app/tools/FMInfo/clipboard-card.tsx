'use client';

import { useClipboard } from '@mantine/hooks';
import { Card, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type ClipboardCardProps = {
  title: string;
  description: string;
};

const ClipboardCard = ({ title, description }: ClipboardCardProps) => {
  const clipboard = useClipboard({ timeout: 800 });

  return (
    <div>
      <Card>
        <CardDescription className='px-2 pt-2'>{title}</CardDescription>

        <ScrollArea>
          <Button
            variant='link'
            onClick={() => clipboard.copy(description)}
            className={`hover:text-primary ${
              clipboard.copied && 'text-primary'
            }`}
          >
            {clipboard.copied ? 'Copied' : description}
          </Button>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ClipboardCard;
