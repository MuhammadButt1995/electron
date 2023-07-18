'use client';

import React, { useState } from 'react';
import { Info, Wrench, Home, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type SidebarProps = {
  theme: string;
  toggleTheme: () => void;
};

const Sidebar = ({ theme, toggleTheme }: SidebarProps) => {
  const [active, setActive] = useState('home');
  const router = useRouter();

  const onHomeIconClick = () => {
    router.replace('/');
    setActive('home');
  };

  const onFminfoIconClick = () => {
    router.replace('/fminfo');
    setActive('fminfo');
  };

  const onToolsIconClick = () => {
    router.replace('/tools');
    setActive('tools');
  };

  return (
    <div
      className={`flex w-full justify-between px-2 py-2 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-slate-100'
      }`}
    >
      <TooltipProvider>
        <div className='flex w-full space-x-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onHomeIconClick}
                variant={active === 'home' ? 'outline' : 'ghost'}
                size='sm'
              >
                <Home className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top' align='center'>
              <p>Home</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToolsIconClick}
                variant={active === 'tools' ? 'outline' : 'ghost'}
                size='sm'
              >
                <Wrench className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top' align='center'>
              <p>Tools</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className='flex space-x-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onFminfoIconClick}
                variant={active === 'fminfo' ? 'outline' : 'ghost'}
                size='sm'
              >
                <Info className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top' align='center'>
              <p>FMinfo</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={toggleTheme} variant='outline' size='sm'>
                {theme === 'light' ? (
                  <Moon className='h-4 w-4' />
                ) : (
                  <Sun className='h-4 w-4' />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top' align='center'>
              {theme === 'light' ? <p>Dark Mode</p> : <p>Light Mode</p>}
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Sidebar;
