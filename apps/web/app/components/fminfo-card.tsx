/* eslint-disable react/require-default-props */
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { cn } from './lib/utils';

export type FminfoCardProps = {
  rating: 'loading' | 'ok' | 'warn' | 'error';
  title: string;
  value;
  icon: React.ReactNode;
  cardBody: React.ReactNode;
  children?: React.ReactNode;
};

const FminfoCard = ({
  rating,
  title,
  value,
  icon,
  cardBody,
  children,
}: FminfoCardProps) => {
  const stateClasses = cn({
    'text-brand-green-700 dark:text-brand-green-500': rating === 'ok',
    'text-brand-yellow-700 dark:text-brand-yellow-500': rating === 'warn',
    'text-brand-magenta-800 dark:text-brand-magenta-600': rating === 'error',
    '': rating === 'loading',
  });

  return (
    <Card className='relative'>
      <CardHeader>
        <div
          className={`flex flex-row items-center justify-between ${stateClasses}`}
        >
          <CardDescription className='text-xs'>{title}</CardDescription>
          {icon}
        </div>

        <div className='flex flex-col items-start justify-start space-y-1'>
          <div className={`text-sm font-bold ${stateClasses}`}>{value}</div>
          {cardBody}
        </div>
      </CardHeader>
      {rating !== 'error' && children}
    </Card>
  );
};

export default FminfoCard;
