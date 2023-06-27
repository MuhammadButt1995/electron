import getAllTools from '@/lib/getAllTools';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ToolDashboard from './tool-dashboard';

type Tool = {
  name: string;
  description: string;
  tags: string[];
  tool_type: string;
  icon: string;
};

const ToolsPage = async () => {
  const toolData: Promise<Tool[]> = getAllTools();
  const tools = await toolData;
  const filteredTools = tools.filter((tool) => tool.tool_type !== 'Data');
  const tags = [...new Set(filteredTools.flatMap((tool: Tool) => tool.tags))];
  const types = [
    ...new Set([...filteredTools.flatMap((tool: Tool) => tool.tool_type)]),
  ];

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>
            The Talos Toolbox
          </h2>
          <p className='text-muted-foreground text-sm'>
            Tools that help you work with ease.
          </p>
        </div>
      </div>

      <Card className='mt-4'>
        <CardContent>
          <ToolDashboard tools={filteredTools} tags={tags} types={types} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolsPage;
