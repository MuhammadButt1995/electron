import { Button } from '@/components/ui/button';

import { Popover, PopoverTrigger } from '@/components/ui/popover';

type StatefulCardInfoButtonProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
};

const StatefulCardInfoButton = ({
  icon,
  children,
}: // eslint-disable-next-line arrow-body-style
StatefulCardInfoButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          className='absolute bottom-3 right-5 w-10 rounded-full p-0'
        >
          {icon}
        </Button>
      </PopoverTrigger>
      {children}
    </Popover>
  );
};

export default StatefulCardInfoButton;
