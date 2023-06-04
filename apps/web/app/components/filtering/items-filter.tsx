/* eslint-disable import/prefer-default-export */
/* eslint-disable arrow-body-style */

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type ItemsFilterProps = {
  title: string;
  icon: JSX.Element;
  items: string[];
  selectedItems: string[];
  onSelectedChange: (item: string) => void;
};

export const ItemsFilter = ({
  title,
  icon,
  items,
  selectedItems,
  onSelectedChange,
}: ItemsFilterProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          {icon}
          {title}
          {selectedItems.length > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <div className='flex space-x-1'>
                <Badge
                  variant='secondary'
                  className='rounded-sm px-1 font-normal'
                >
                  {selectedItems.length}
                </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[150px] p-0'
        align='start'
        collisionPadding={20}
      >
        <Command>
          <CommandInput placeholder={`Filter ${title.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No {title.toLowerCase()} found.</CommandEmpty>
            {items
              .sort((a, b) => a.localeCompare(b))
              .map((item) => (
                <CommandItem key={item}>
                  <Checkbox
                    key={item}
                    id={item}
                    className='mr-4'
                    checked={selectedItems.includes(item)}
                    onCheckedChange={() => onSelectedChange(item)}
                  />
                  {item}
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
