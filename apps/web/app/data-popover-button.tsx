import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';

export type DataPopoverButtonProps = {
  icon: React.ReactNode;
  btnClasses: string;
  children: React.ReactNode;
  fetchData: () => void;
};

export const DataPopoverButton = ({
  icon,
  btnClasses,
  children,
  fetchData,
}: DataPopoverButtonProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant='ghost'
        className={btnClasses}
        onClick={(event) => {
          // Check if the popover is open before running fetchData
          if (event.currentTarget.getAttribute('data-state') === 'open') {
            return;
          }
          fetchData();
        }}
      >
        {icon}
      </Button>
    </PopoverTrigger>

    <PopoverContent
      className='w-120'
      collisionPadding={{
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
      }}
    >
      {children}
    </PopoverContent>
  </Popover>
);
