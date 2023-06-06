/* eslint-disable react/function-component-definition */
import { cn } from '@/components/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-muted animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
