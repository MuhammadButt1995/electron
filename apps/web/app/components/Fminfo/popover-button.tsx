/* eslint-disable react/require-default-props */

'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type PopoverButtonProps = {
  children: React.ReactNode;
  icon?: React.ReactNode
};

const PopoverButton = ({ children, icon }: PopoverButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = (state) => setIsOpen(state);
  return (
    <Popover onOpenChange={toggleOpen}>
      <PopoverTrigger asChild>
        <Button className='h-6 w-6 rounded-full ' variant='default' size='icon'>
          <div
            className={`transform transition-transform duration-75 ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            {icon || <ChevronDownIcon className='h-4 w-4' />}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>{children}</PopoverContent>
    </Popover>
  );
};

export default PopoverButton;
