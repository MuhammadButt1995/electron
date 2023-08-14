'use client';

import { Filter, Tags } from 'lucide-react';
import { useSelection } from '@/hooks/useSelection';
import { ItemsFilter } from '@/components/filtering/items-filter';
import ToolboxSwitcher from '@/components/toolbox/toolbox-switcher';
import ToolboxFilters from '@/components/toolbox/toolbox-filters';
import ToolboxCommandMenu from '@/components/toolbox/toolbox-command-menu';
import { ToolArray } from '@/lib/getAllTools';

type Props = {
  tools: ToolArray;
  tags: string[];
  types: string[];
};

const ToolDashboard = ({ tools, tags, types }: Props) => {
  const { selectedItems: selectedTags, onSelect: setSelectedTags } =
    useSelection();

  const { selectedItems: selectedTypes, onSelect: setSelectedTypes } =
    useSelection();

  const filteredTools = tools.filter(
    (tool) =>
      (!selectedTags.length ||
        tool.tags.some((tag) => selectedTags.includes(tag))) &&
      (!selectedTypes.length || selectedTypes.includes(tool.type))
  );

  return (
    <div>
      <ToolboxFilters>
        <ItemsFilter
          title='Types'
          icon={<Filter className='w-4 h-4 mr-2' />}
          items={types}
          selectedItems={selectedTypes}
          onSelectedChange={setSelectedTypes}
        />

        <ItemsFilter
          title='Tags'
          icon={<Tags className='w-4 h-4 mr-2' />}
          items={tags}
          selectedItems={selectedTags}
          onSelectedChange={setSelectedTags}
        />

        <ToolboxSwitcher />
      </ToolboxFilters>

      <ToolboxCommandMenu filteredTools={filteredTools} />
    </div>
  );
};

export default ToolDashboard;
