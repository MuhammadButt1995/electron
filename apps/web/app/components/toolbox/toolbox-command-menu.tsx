/* eslint-disable no-unneeded-ternary */
/* eslint-disable @next/next/no-img-element */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReloadIcon } from '@radix-ui/react-icons';

import {
  useCommandToolData,
  useToggleToolData,
  ToolArray,
  CommandTool,
  ToggleTool,
  UtilityTool,
} from '@/hooks/useToolData';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ToolboxCommandMenuProps = {
  filteredTools: ToolArray;
};

const ToolboxCommandMenu = ({ filteredTools }: ToolboxCommandMenuProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const selectedTool = filteredTools.find(
    (tool) => tool.name.toLowerCase() === selected
  );

  const toolDataQuery = useCommandToolData(selectedTool as CommandTool);
  const toggleToolMutation = useToggleToolData(selectedTool as ToggleTool);

  const IS_TOOL_DATA_LOADING = toolDataQuery.isFetching;

  const handleButtonClick = () => {
    if (selectedTool?.type === 'Toggle') {
      toggleToolMutation.mutate();
    } else if (selectedTool?.type === 'Command') {
      toolDataQuery.refetch();
    } else {
      router.replace(selectedTool?.route);
    }
  };

  return (
    <Command
      className='rounded-lg border shadow-lg h-[21rem]'
      value={selected ? selected : ''}
      onValueChange={setSelected}
    >
      <CommandInput
        placeholder='Search for a tool..'
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          <div className='flex flex-col items-center justify-center'>
            <p className='py-2 text-lg text-semibold'>No tools found.</p>
          </div>
        </CommandEmpty>
        {filteredTools.length > 0 && (
          <div className='flex items-center justify-start'>
            <CommandGroup heading='Tools'>
              <ScrollArea className='h-64 pr-4'>
                {filteredTools.map((tool) => (
                  <CommandItem
                    key={tool.name}
                    className='grid grid-cols-2 row-span-2 gap-2 rounded-lg w-44 aria-selected:bg-brand-teal/20 aria-selected:text-brand-teal'
                    value={tool.name.toLowerCase()} // use lowercase for value
                  >
                    <img
                      src={tool.icon}
                      alt=''
                      className='w-10 h-10 col-span-1 row-span-2'
                    />
                    <div>{tool.name}</div>
                    <div className='text-xs text-primary'>{tool.type}</div>
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
            {(search || search.length === 0) && selected && (
              <CommandSeparator className='h-72 w-[1px]' alwaysRender />
            )}
            <div className='flex flex-col items-center justify-center flex-grow px-4 space-y-4 w-36'>
              {selectedTool && (
                <p className='text-lg font-semibold text-brand-teal'>
                  {selectedTool.name}
                </p>
              )}
              {selectedTool && (
                <p className='text-center'>{selectedTool.description}</p>
              )}
              {selectedTool &&
                selectedTool.type === 'Command' &&
                (IS_TOOL_DATA_LOADING ? (
                  <Button disabled variant='secondary'>
                    <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                    Executing...
                  </Button>
                ) : (
                  <Button onClick={handleButtonClick}>Execute</Button>
                ))}
              {selectedTool && selectedTool.type === 'Utility' && (
                <Button onClick={handleButtonClick}>Launch</Button>
              )}
              {selectedTool && selectedTool.type === 'Toggle' && (
                <>
                  <Switch
                    checked={selectedTool.state}
                    onCheckedChange={handleButtonClick}
                  />
                  <Badge
                    variant='outline'
                    className={cn('bg-brand-magenta/20 text-brand-magenta', {
                      'bg-brand-teal/20 text-brand-teal': selectedTool.state,
                    })}
                  >
                    {selectedTool.state ? 'Enabled' : 'Disabled'}
                  </Badge>
                </>
              )}
            </div>
          </div>
        )}
      </CommandList>
    </Command>
  );
};

export default ToolboxCommandMenu;
