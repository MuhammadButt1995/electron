'use client';

import { Separator } from '@/components/ui/separator';
import ToolDashboard from '@/components/toolbox/tool-dashboard';

import { ToolArray, useAllToolsData } from '@/hooks/useToolData';

const ToolsPage = () => {
  const toolsQuery = useAllToolsData();
  const tools = (toolsQuery?.data as ToolArray) ?? [];

  const tags = [...new Set(tools?.flatMap((tool: any) => tool.tags))];
  const types = [...new Set([...tools.flatMap((tool: any) => tool.type)])];

  return (
    <section className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex flex-row items-center justify-start space-x-2'>
            <h2 className='text-lg font-semibold text-brand-teal'>Toolbox</h2>
            <Separator orientation='vertical' className='h-5' />
            <p className='text-sm'>Tools for your workspace environment.</p>
          </div>
        </div>
      </div>

      <ToolDashboard tools={tools} tags={tags} types={types} />
    </section>
  );
};

export default ToolsPage;
