'use client';

import * as icons from 'lucide-react';
import { useSettingsStore } from '@/store/settings-store';

type Props = {
  iconName: string;
};

const ToolCardIcon = ({ iconName }: Props) => {
  const theme = useSettingsStore((state) => state.theme);
  const Icon = icons[iconName];

  return (
    <Icon
      className={`h-4 w-4 ${
        theme === 'dark' ? 'text-brand-teal-300' : 'text-brand-teal-800'
      }`}
    />
  );
};

export default ToolCardIcon;
