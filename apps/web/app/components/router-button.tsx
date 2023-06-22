/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type RouterButtonProps = {
  icon?: React.ReactNode;
  title: string;
  route: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  classNames?: string;
};

const RouterButton = ({
  icon,
  title,
  route,
  variant = 'default',
  classNames = '',
}: RouterButtonProps) => {
  const router = useRouter();
  return (
    <Button
      variant={variant}
      className={classNames}
      onClick={() => router.replace(route)}
    >
      {icon}
      {title}
    </Button>
  );
};

export default RouterButton;
