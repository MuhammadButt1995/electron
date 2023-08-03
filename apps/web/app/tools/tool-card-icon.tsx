'use client';

import { ToggleRight, AppWindow, Cog } from 'lucide-react';

import { useSettingsStore } from '@/store/global-state-store';

type Props = {
  iconName: string;
};

const ToolCardIcon = ({ iconName }: Props) => {
  const theme = useSettingsStore((state) => state.theme);

  return (
    <Cog
      className={`my-2 mt-2 h-4 w-4 ${
        theme === 'dark' ? 'text-brand-teal-300' : 'text-brand-teal-800'
      }`}
    />
  );
};

export default ToolCardIcon;
