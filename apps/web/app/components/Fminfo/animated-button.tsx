'use client'

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const AnimatedButton = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
      <div>
           <Button className='h-6 w-6 rounded-full ' variant='default' size='icon'>
          <div
            className={`transform transition-transform duration-75 ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            <ChevronDownIcon className='h-4 w-4' />
          </div>
        </Button>
    </div>
  )
}

export default AnimatedButton