/* eslint-disable react/require-default-props */

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
  disabled?: boolean;
};

export const StaticPopoverButton = ({
  icon,
  btnClasses,
  children,
  disabled = false,
}: StaticPopoverButtonProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant='ghost' className={btnClasses} disabled={disabled}>
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
