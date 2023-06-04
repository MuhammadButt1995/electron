'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconCategory } from '@tabler/icons-react';
import { Tags } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { ItemsFilter } from '@/components/filtering/items-filter';
import FilterInput from '@/components/filtering/filter-input';
import { useSelection } from '@/hooks/useSelection';
import { useMutuallyExclusiveSelection } from '@/hooks/useMutuallyExclusiveSelection';
import { useFilteredTools } from '@/hooks/useFilteredTools';
import ToolGrid from './tool-grid';

type Tool = {
  name: string;
  description: string;
  tags: string[];
  tool_type: string;
  icon: string;
};

type Props = {
  tools: Tool[];
  tags: string[];
  types: string[];
};

const ToolDashboard = ({ tools, tags, types }: Props) => {
  const [filter, setFilter] = useState('');

  const { selectedItems: selectedTags, onSelect: setSelectedTags } =
    useSelection();

  const { selectedItems: selectedTypes, onSelect: setSelectedTypes } =
    useMutuallyExclusiveSelection(
      ['Non-Automated'],
      ['Non-Automated', 'Auto-Enabled']
    );

  const filteredTools = useFilteredTools(
    tools,
    filter,
    selectedTags,
    selectedTypes
  );

  const { toast } = useToast();
  const router = useRouter();

  const onToolClick = (tool: Tool) => {
    if (tool.tool_type === 'Auto-Enabled') {
      toast({
        title: `The ${tool.name} tool is Auto-Enabled!`,
        description:
          "This tool doesn't have a specific page since it's always running in the background!",
        action: <ToastAction altText='Got it!'>Got it!</ToastAction>,
        duration: 8000,
      });
    } else {
      // Otherwise, navigate to the tool's specific page
      router.replace(`/tools/${tool.name}`);
    }
  };

  return (
    <div className='mt-2 flex flex-col items-start justify-start px-1'>
      <div className='mb-2 flex items-center justify-start space-x-4'>
        <FilterInput onFilterChange={setFilter} />

        <ItemsFilter
          title='Types'
          icon={<IconCategory className='mr-2 h-4 w-4' />}
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
      <ScrollArea className='h-[230px] w-fit pr-4'>
        <ToolGrid tools={filteredTools} onToolClick={onToolClick} />
      </ScrollArea>
    </div>
  );
};

export default ToolDashboard;
