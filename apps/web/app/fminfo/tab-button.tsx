import { Check, AlertTriangle } from 'lucide-react';

type TabButtonProps = {
  name: string;
  allOk: boolean;
};

const TabButton = ({ name, allOk }: TabButtonProps) => (
  <div className='flex flex-row'>
    {allOk ? (
      <Check className='text-brand-teal mr-2 h-4 w-4' />
    ) : (
      <AlertTriangle className='text-brand-yellow mr-2 h-4 w-4' />
    )}
    {name}
  </div>
);

export default TabButton;
