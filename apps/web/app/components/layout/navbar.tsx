'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  return (
    <nav className={`flex w-full justify-around px-2 py-2 `}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
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
        </Link>
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
