/* eslint-disable react/require-default-props */

'use client';

import { useClipboard } from '@mantine/hooks';
import { Button } from '@/components/ui/button';

type ClipboardCardProps = {
  text: string;
  classNames?: string;
};

const ClipboardText = ({ text, classNames }: ClipboardCardProps) => {
  const clipboard = useClipboard({ timeout: 800 });

  return (
    <div className={classNames}>
      <Button
        variant='link'
        onClick={() => clipboard.copy(text)}
        className={`hover:text-primary ${clipboard.copied && 'text-primary'}`}
      >
        {clipboard.copied ? 'Copied' : text}
      </Button>
    </div>
  );
};

export default ClipboardText;
