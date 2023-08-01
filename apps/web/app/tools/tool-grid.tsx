'use client';

import { Cog, ToggleRight, AppWindow, DatabaseBackup } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type Tool = {
  name: string;
  description: string;
  tags: string[];
  tool_type: string;
  icon: string;
};

type ToolGridProps = {
  tools: Tool[];
  onToolClick: (tool: Tool) => void;
};

const ToolGrid = ({ tools, onToolClick }: ToolGridProps) => (
  <div className='grid w-full grid-cols-2 gap-4'>
    {tools.map((tool) => (
      <Card
        key={tool.name}
        className='hover:bg-accent hover:text-accent-foreground shadow-accent rounded-xl shadow-sm'
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className='flex flex-col items-center justify-center p-2'>
              {tool.tool_type === 'Data' && (
                <DatabaseBackup className={`my-2 mt-2 h-4 w-4 `} />
              )}
              {tool.tool_type === 'Action' && (
                <Cog className={`my-2 mt-2 h-4 w-4 `} />
              )}
              {tool.tool_type === 'Widget' && (
                <AppWindow className={`my-2 mt-2 h-4 w-4 `} />
              )}
              {tool.tool_type === 'Switch' && (
                <ToggleRight className={`my-2 mt-2 h-4 w-4 `} />
              )}
              <Label className='text-foreground'>{tool.name}</Label>
              {tool.tool_type === 'Switch' && <Switch className='mt-4' />}
              {tool.tool_type === 'Widget' && (
                <Button variant='secondary' className='mt-4'>
                  Open
                </Button>
              )}
              {tool.tool_type === 'Action' && (
                <Button variant='secondary' className='mt-4'>
                  Execute
                </Button>
              )}
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            className='w-80'
            side='bottom'
            sideOffset={10}
            collisionPadding={{
              top: 20,
              left: 20,
              right: 20,
              bottom: 20,
            }}
          >
            <div className='flex justify-between space-x-4'>
              <div className='space-y-1'>
                <h4 className='text-sm font-semibold'>{tool.name}</h4>
                <p className='text-sm'>{tool.description}</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Card>
    ))}
  </div>
);

export default ToolGrid;
