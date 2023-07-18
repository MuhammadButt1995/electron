import { CheckCircle, AlertTriangle } from 'lucide-react';

type TabButtonProps = {
  name: string;
  allOk: boolean;
};

const TabButton = ({ name, allOk }: TabButtonProps) => (
  <div className='flex flex-row'>
    {name}

    {allOk ? (
      <CheckCircle className='text-brand-green-700 dark:text-brand-green-500 ml-1 h-2 w-2' />
    ) : (
      <AlertTriangle className='text-brand-yellow-700 dark:text-brand-yellow-500 ml-1 h-2 w-2' />
    )}
  </div>
);

export default TabButton;
