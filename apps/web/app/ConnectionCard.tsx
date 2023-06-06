import React from 'react';

import { Card, CardDescription, CardHeader } from '@/components/ui/card';

export type ConnectionState =
  | 'connected'
  | 'not_connected'
  | 'error'
  | 'loading';

type ConnectionCardProps = {
  title: string;
  icon: React.ReactNode;
  state: ConnectionState;
  sublabel: string;
  classNames: object;
};

const ConnectionCard = ({
  title,
  state,
  icon,
  sublabel,
  classNames,
}: ConnectionCardProps) => {
  const colors = classNames[state];
  return (
    <Card>
      <CardHeader>
        <div className='flex flex-row items-center justify-between'>
          <CardDescription className='text-xs'>{title}</CardDescription>
          {icon}
        </div>

        <div className='flex flex-col items-start justify-start space-y-1'>
          <div className={`${colors} text-sm font-bold`}>
            {state.toUpperCase().replace(/_/g, ' ')}
          </div>
          <p className='text-muted-foreground text-xs'>{sublabel}</p>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ConnectionCard;
