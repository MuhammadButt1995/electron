/* eslint-disable react/require-default-props */

'use client';

import { useClipboard } from '@mantine/hooks';
import { Button } from '@/components/ui/button';

type ClipboardCardProps = {
  text: string;
};

const ClipboardText = ({text}: ClipboardCardProps) => {
  const clipboard = useClipboard({ timeout: 800 });

  return (
    <div>
      <Button
        variant='link'
        onClick={() => clipboard.copy(text)}
        className={`hover:text-brand-teal ${clipboard.copied && 'text-brand-teal'}`}
      >
        {clipboard.copied ? 'Copied' : text}
      </Button>
    </div>
  );
};

export default ClipboardText;
