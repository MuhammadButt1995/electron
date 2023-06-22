/* eslint-disable react/function-component-definition */

'use client';

import { Home, Wrench, Settings, Sun, Moon } from 'lucide-react';

import '@/styles/globals.css';
import { useState } from 'react';
import { Source_Sans_Pro } from '@next/font/google';
import { useRouter } from 'next/navigation';
import { useSettingsStore } from './store/settings-store';

import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Separator } from '@/components/ui/separator';

const SOURCE_SANS_PRO = Source_Sans_Pro({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700', '900'],
  style: ['normal', 'italic'],
});

interface SidebarProps {
  theme: string;
  children: React.ReactNode;
}

const Sidebar = ({ theme, children }: SidebarProps) => (
  <div
    className={`flex w-full justify-between px-2 py-2 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-slate-100'
    }`}
  >
    {children}
  </div>
);

export default function RootLayout({ children }: { children: JSX.Element }) {
  const theme = useSettingsStore((state) => state.theme);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);
  const [active, setActive] = useState('home');
  const router = useRouter();

  const onHomeIconClick = () => {
    router.replace('/');
    setActive('home');
  };

  const onToolsIconClick = () => {
    router.replace('/tools');
    setActive('tools');
  };

  const onSettingsIconClick = () => {
    router.replace('/settings');
    setActive('settings');
  };

  return (
    <html lang='en'>
      <body
        className={`${SOURCE_SANS_PRO.className} ${
          theme === 'dark' ? 'dark' : 'light'
        }`}
      >
        <div className='fixed bottom-0 left-0 right-0 justify-between'>
          <Separator />
          <Sidebar theme={theme}>
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
                      onClick={onSettingsIconClick}
                      variant={active === 'settings' ? 'outline' : 'ghost'}
                      size='sm'
                    >
                      <Settings className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side='top' align='center'>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      // @ts-ignore
                      onClick={toggleTheme}
                      variant='outline'
                      size='sm'
                    >
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
          </Sidebar>
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
