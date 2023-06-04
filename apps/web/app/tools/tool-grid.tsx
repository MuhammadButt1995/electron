import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ToolCardIcon from './tool-card-icon';

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
  <div className='grid h-fit w-fit grid-cols-3 gap-6'>
    {tools.map((tool) => (
      <Card
        key={tool.name}
        className='hover:bg-accent hover:text-accent-foreground shadow-accent rounded-xl shadow-sm'
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className='flex flex-col items-center justify-center p-2'>
              <ToolCardIcon iconName={tool.icon} />
              <Button
                variant='link'
                className='text-foreground mt-2'
                onClick={() => onToolClick(tool)}
              >
                {tool.name}
              </Button>
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
