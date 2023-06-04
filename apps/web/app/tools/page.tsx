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
  const tags = [...new Set(tools.flatMap((tool: Tool) => tool.tags))];
  const types = [
    ...new Set([
      'Non-Automated',
      ...tools.flatMap((tool: Tool) => tool.tool_type),
    ]),
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
        <CardHeader className='h-16'>
          <CardTitle>Click on a tool open it up.</CardTitle>
          <CardDescription>
            Hover over a tool to see its description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ToolDashboard tools={tools} tags={tags} types={types} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolsPage;
