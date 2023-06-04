/* eslint-disable arrow-body-style */
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export type ConnectionState =
  | 'connected'
  | 'not_connected'
  | 'error'
  | 'loading';

export type ConnectionMessage = {
  connectionState: ConnectionState;
  sublabel: string;
};

type ConnectionBadgeProps = {
  title: string;
  state: ConnectionState;
  sublabel: string;
};

const ConnectionBadge = ({ title, state, sublabel }: ConnectionBadgeProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div>
          <Badge
            className={`${
              state === 'connected' &&
              'bg-brand-green-800 dark:bg-brand-green-400'
            } ${
              state === 'not_connected' &&
              'bg-brand-yellow-700 dark:bg-brand-yellow-200'
            }
      ${state === 'error' && 'bg-destructive/50 dark:bg-destructive'}${
              state === 'loading' && 'bg-accent'
            }`}
          >
            {title}
          </Badge>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className='w-80'
        collisionPadding={{
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
        }}
      >
        <div className='flex justify-between space-x-4'>
          <div className='space-y-1'>
            <h4 className='text-sm font-semibold'>{`${state}`}</h4>
            <p className='text-sm'>{sublabel}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ConnectionBadge;
