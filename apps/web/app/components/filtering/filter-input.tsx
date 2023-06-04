import { useState, useEffect } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { Input } from '@/components/ui/input';

type FilterInputProps = {
  onFilterChange: (value: string) => void;
};

const FilterInput = ({ onFilterChange }: FilterInputProps) => {
  const [inputFilter, setInputFilter] = useState('');
  const [debouncedFilter] = useDebouncedValue(inputFilter, 200);

  // use useEffect to call onFilterChange whenever debouncedFilter changes
  useEffect(() => {
    onFilterChange(debouncedFilter);
  }, [debouncedFilter, onFilterChange]);

  const onChange = (e) => {
    setInputFilter(e.target.value);
  };

  return (
    <Input
      type='search'
      placeholder='Filter tools...'
      onChange={onChange}
      value={inputFilter}
      className='my-4 h-7 w-[140px] rounded-lg'
    />
  );
};

export default FilterInput;
