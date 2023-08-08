/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-no-undef */

'use client';

import { useEffect, useState } from 'react';
import { Tags, Filter } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { Separator } from '@/components/ui/separator';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import { useSelection } from '@/hooks/useSelection';
import { ItemsFilter } from '@/components/filtering/items-filter';

const ToolsPage = () => {
  const tools = [
    {
      name: 'Low Wi-Fi Notifications',
      type: 'Toggle',
      description: 'Lorem ipsum dolor sit.',
      icon: '/wifi-notifs.png',
      state: false,
      tags: 'Wi-FI',
    },

    {
      name: 'VPN Helper',
      type: 'Utility',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
      icon: '/vpn.png',
      state: false,
      tags: 'VPN',
    },

    {
      name: 'AD Rebind',
      type: 'Command',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam placeat similique obcaecati!',
      icon: '/aad.png',
      state: false,
      tags: 'AD',
    },
  ];

  const [selected, setSelected] = useState(tools[0].name);

  const selectedHandler = (value: string) => {
    console.log(`hovered over ${value}`);
    setSelected(value);
  };

  const selectedTool = tools.find((tool) => tool.name === selected);
  const selectedType = selectedTool.type;

  const { selectedItems: selectedTags, onSelect: setSelectedTags } =
    useSelection();

  const { selectedItems: selectedTypes, onSelect: setSelectedTypes } =
    useSelection();

  const tags = [...new Set(tools.flatMap((tool: any) => tool.tags))];
  const types = [...new Set([...tools.flatMap((tool: any) => tool.type)])];

  const filteredTools = tools.filter(
    (tool) =>
      (!selectedTags.length || selectedTags.includes(tool.tags)) &&
      (!selectedTypes.length || selectedTypes.includes(tool.type))
  );

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex flex-row items-center justify-start space-x-2'>
            <h2 className='text-lg font-semibold text-brand-teal'>Toolbox</h2>
            <Separator orientation='vertical' className='h-5' />
            <p className='text-sm'>Tools for your workspace environment.</p>
          </div>
        </div>
      </div>

      <div className='my-6 flex items-center justify-start space-x-6'>
        <ItemsFilter
          title='Types'
          icon={<Filter className='mr-2 h-4 w-4' />}
          items={types}
          selectedItems={selectedTypes}
          onSelectedChange={setSelectedTypes}
        />

        <ItemsFilter
          title='Tags'
          icon={<Tags className='mr-2 h-4 w-4' />}
          items={tags}
          selectedItems={selectedTags}
          onSelectedChange={setSelectedTags}
        />
      </div>

      <div className=''>
        <Command className='rounded-lg border shadow-lg h-[21rem]'>
          <CommandInput placeholder='Search for a tool..' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <div className='flex justify-start items-center'>
              <CommandGroup heading='Tools'>
                <ScrollArea className='h-64 pr-4'>
                  {filteredTools.map((tool) => (
                    <CommandItem
                      key={tool.name}
                      onMouseEnter={() => selectedHandler(tool.name)}
                      className='grid grid-cols-2 gap-2 row-span-2 w-44 rounded-lg aria-selected:bg-brand-teal/20 aria-selected:text-brand-teal'
                    >
                      <img
                        src={tool.icon}
                        alt=''
                        className='row-span-2 col-span-1 h-10 w-10'
                      />

                      <div>{tool.name}</div>
                      <div className='text-xs text-primary'>{tool.type}</div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>

              <Separator orientation='vertical' className='ml-2 h-72 w-[2px]' />

              <div className='flex flex-col flex-grow justify-center items-center w-36 px-4 h-72 space-y-4'>
                {selectedTool ? (
                  <>
                    <p className='text-lg font-semibold text-brand-teal'>
                      {selectedTool.name}
                    </p>

                    <p className='text-center'>{selectedTool.description}</p>

                    {selectedType === 'Command' && <Button>Execute</Button>}
                    {selectedType === 'Utility' && <Button>Launch</Button>}
                    {selectedType === 'Toggle' && <Switch />}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default ToolsPage;
