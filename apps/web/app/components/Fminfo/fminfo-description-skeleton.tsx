import React from 'react';
import { Skeleton } from '@/components//ui/skeleton';

const FminfoDescriptionSkeleton = () => (
  <div className='flex items-center space-x-4'>
    <div className='space-y-2'>
      <Skeleton className='h-4 w-[200px]' />
      <Skeleton className='h-4 w-[150px]' />
    </div>
  </div>
);

export default FminfoDescriptionSkeleton;
