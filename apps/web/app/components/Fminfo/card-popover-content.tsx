/* eslint-disable react/require-default-props */

import { CalendarIcon } from 'lucide-react';
import InfoCardPopoverSkeleton from '@/components/Fminfo/info-card-popover-skeleton';

type CardPopoverContentProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  lastUpdated?: string;
};

const CardPopoverContent = ({
  children,
  isLoading,
  lastUpdated,
}: CardPopoverContentProps) => (
    <div>
      {isLoading ? (
        <InfoCardPopoverSkeleton />
      ) : (
        <div className='flex justify-between space-x-4'>
          <div className='space-y-1'>
            {children}

            {lastUpdated && (
              <div className='flex items-center pt-4'>
                <CalendarIcon className='mr-2 h-4 w-4 opacity-70' />{' '}
                <span className='text-muted-foreground text-sm'>
                  Updated: {lastUpdated}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

export default CardPopoverContent;
