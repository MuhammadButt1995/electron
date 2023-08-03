/* eslint-disable react/require-default-props */

import TableCardSkeleton from '@/components/fminfo/ui/table-card-skeleton';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type TableCardProps = {
  header: React.ReactNode;
  isLoading: boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
  isError?: boolean;
  error?: React.ReactNode;
};

const TableCard = ({
  header,
  isLoading,
  children,
  footer,
  isError,
  error,
}: TableCardProps) => (
  <div>
    {isError ? (
      <Card
        className={`shadow-xl ${
          isError && 'bg-brand-magenta/10 dark:bg-brand-magenta/20'
        }`}
      >
        <div className='p-4'>
          {error}
          <TableCardSkeleton />
        </div>
      </Card>
    ) : (
      <Card className='shadow-xl'>
        <div className='px-4 pt-4 pb-1'>
          {header}

          {isLoading ? <TableCardSkeleton /> : children}
        </div>

        <Separator />
        <div className='flex flex-row items-center justify-evenly bg-accent'>
          {footer}
        </div>
      </Card>
    )}
  </div>
);

export default TableCard;
