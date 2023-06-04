'use-client';

import { Home, Wrench, Settings, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/components/lib/utils';
import { Button } from '@/components/ui/button';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// eslint-disable-next-line import/prefer-default-export, react/function-component-definition, react/prop-types
export function Sidebar({ theme, onToggle }) {
  const router = useRouter();
  return (
    <div className={cn('block pb-12')}>
      <div className='space-y-4 py-2'>
        <div className='p-2'>
          <TooltipProvider>
            <div className='space-y-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => router.replace('/')}
                    variant='secondary'
                    size='default'
                    className='justify-start'
                  >
                    <Home className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => router.replace('/toolbox')}
                    variant='ghost'
                    size='default'
                    className='justify-start'
                  >
                    <Wrench className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  <p>Tools</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='default'
                    className='justify-start'
                  >
                    <Settings className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onToggle}
                    variant='ghost'
                    size='default'
                    className='justify-start'
                  >
                    {theme === 'light' ? (
                      <Moon className='h-4 w-4' />
                    ) : (
                      <Sun className='h-4 w-4' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  {theme === 'light' ? <p>Dark Mode</p> : <p>Light Mode</p>}
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
