'use-client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useToggle } from '@mantine/hooks';
import { Toggle } from '@/components/ui/toggle';

type ThemeToggleProps = {
  theme: string;
  toggle: React.SetStateAction<string>;
};

const ThemeToggle = ({ theme, toggle }: ThemeToggleProps) => {
  const toggleTheme = () => {
    toggle();
  };

  return (
    <Toggle
      variant='outline'
      aria-label='Toggle theme'
      onPressedChange={toggleTheme}
    >
      {theme === 'light' ? (
        <Moon className='h-4 w-4' />
      ) : (
        <Sun className='h-4 w-4' />
      )}
    </Toggle>
  );
};

export default ThemeToggle;
