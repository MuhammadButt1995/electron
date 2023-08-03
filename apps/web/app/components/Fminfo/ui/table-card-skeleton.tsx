import { Skeleton } from '@/components/ui/skeleton';

const TableCardSkeleton = () => (
  <div className='flex flex-row items-center justify-between pt-2'>
    <div className='flex space-x-3'>
      <Skeleton className='h-3 w-3 rounded-full' />
      <Skeleton className='h-4 w-[75px]' />
    </div>
    <div>
      <Skeleton className='h-4 w-[100px]' />
    </div>
  </div>
);

export default TableCardSkeleton;
