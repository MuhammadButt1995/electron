/* eslint-disable react/require-default-props */

import { Button } from '@/components/ui/button';

import { Popover, PopoverTrigger } from '@/components/ui/popover';

type StatefulCardInfoButtonProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClickFunc?: any;
};

const StatefulCardInfoButton = ({
  icon,
  children,
  onClickFunc,
}: // eslint-disable-next-line arrow-body-style
StatefulCardInfoButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          className='absolute bottom-3 right-5 w-10 rounded-full p-0'
          onClick={(event) => {
            if (onClickFunc) {
              // Check if the popover is open before running onClickFunc
              if (event.currentTarget.getAttribute('data-state') === 'open') {
                return;
              }
              onClickFunc();
            }
          }}
        >
          {icon}
        </Button>
      </PopoverTrigger>
      {children}
    </Popover>
  );
};

export default StatefulCardInfoButton;
