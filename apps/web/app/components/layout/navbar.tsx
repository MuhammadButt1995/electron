/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-nested-ternary */

'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

import { Button, buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    icon: React.ReactNode;
    title: string;
  }[];
}

const Navbar = ({ className, items, ...props }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isDev, setIsDev] = useState(true);

  useEffect(() => {
    if (window) {
      setIsDev(window.meta.isDev);
    }
  }, []);

  const navigate = (path: string) => {
    !isDev
      ? window.navigate
        ? window.navigate(path)
        : ''
      : router.replace(path);
  };

  return (
    <nav className={`flex w-full justify-around px-2 py-2 `}>
      {items.map((item) => (
        <Button
          variant='ghost'
          key={item.href}
          onClick={() => navigate(item.href)}
          className={cn(
            buttonVariants({
              variant:
                (item.href === '/' && pathname === '/') ||
                (item.href !== '/' && pathname.includes(item.href))
                  ? 'link'
                  : 'ghost',
              className:
                (item.href === '/' && pathname === '/') ||
                (item.href !== '/' && pathname.includes(item.href))
                  ? 'text-brand-teal'
                  : '',
            }),
            'py-6',
            'px-2'
          )}
        >
          <div className='flex flex-col items-center justify-center text-xs'>
            {item.icon}
            {item.title}
          </div>
        </Button>
      ))}

      <Button variant='ghost' asChild className='px-2 py-6'>
        <div className='flex flex-col items-center justify-center text-xs'>
          <ThemeToggle />
          <p className='mt-1 cursor-pointer'>Theme</p>
        </div>
      </Button>
    </nav>
  );
};

export default Navbar;
