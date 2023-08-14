/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

'use client';

import React from 'react';
import { CaretSortIcon, CheckIcon, PersonIcon } from '@radix-ui/react-icons';
import { Users2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const toolboxes = [
  {
    label: 'End-User Toolbox',
    toolbox: [
      {
        label: 'My Toolbox',
        value: 'end-user',
      },
    ],
  },
  {
    label: 'Role Based Toolbox',
    toolbox: [
      {
        label: 'Desktop Engineering',
        value: 'DE',
      },
      {
        label: 'Tech Center',
        value: 'TC',
      },
    ],
  },
];

type Team = (typeof toolboxes)[number]['toolbox'][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface ToolboxSwitcherProps extends PopoverTriggerProps {}

export default function ToolboxSwitcher({ className }: ToolboxSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(
    toolboxes[0].toolbox[0]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-[215px] justify-between', className)}
        >
          {selectedTeam.label === 'My Toolbox' ? (
            <PersonIcon className='w-4 h-4 mr-2' />
          ) : (
            <Users2 className='w-4 h-4 mr-2' />
          )}

          {selectedTeam.label}
          <CaretSortIcon className='w-4 h-4 ml-auto opacity-50 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[215px] p-0'>
        <Command>
          <CommandList>
            {toolboxes.map((toolbox) => (
              <CommandGroup key={toolbox.label} heading={toolbox.label}>
                {toolbox.toolbox.map((team) => (
                  <CommandItem
                    key={team.value}
                    onSelect={() => {
                      setSelectedTeam(team);
                      setOpen(false);
                    }}
                    className='text-sm'
                  >
                    {toolbox.label === 'End-User Toolbox' ? (
                      <PersonIcon className='w-4 h-4 mr-2' />
                    ) : (
                      <Users2 className='w-4 h-4 mr-2' />
                    )}

                    {team.label}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedTeam.value === team.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
