import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';

export type StaticPopoverButtonProps = {
  icon: React.ReactNode;
  btnClasses: string;
  children: React.ReactNode;
};

export const StaticPopoverButton = ({
  icon,
  btnClasses,
  children,
}: StaticPopoverButtonProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant='ghost' className={btnClasses}>
        {icon}
      </Button>
    </PopoverTrigger>

    <PopoverContent
      className='w-120'
      collisionPadding={{
        top: 40,
        left: 20,
        right: 20,
        bottom: 20,
      }}
    >
      {children}
    </PopoverContent>
  </Popover>
);
