import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

type Tool = {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
};

export type ToggleTool = Tool & {
  type: 'Toggle';
  state: boolean;
};

export type UtilityTool = Tool & {
  type: 'Utility';
  route: string;
};

export type CommandTool = Tool & {
  type: 'Command';
};
export type ToolArray = (CommandTool | ToggleTool | UtilityTool)[];

export const useAllToolsData = () =>
  useQuery({
    queryKey: ['all-tools'],
    queryFn: async () => {
      const res = await fetch('http://127.0.0.1:8000/tools');

      if (!res.ok) throw new Error('Failed to fetch data');

      const jsonData = await res.json();
      if (jsonData.success && Array.isArray(jsonData.data)) {
        return jsonData.data;
      }

      throw new Error('Invalid data format from API');
    },
  });

export const useCommandToolData = (tool: CommandTool) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['toolData', tool?.id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/tools/${tool?.id}`);

      if (!res.ok)
        throw new Error(`Error fetching tool data for ID: ${tool?.id}`);

      const jsonData = await res.json();
      if (jsonData.success) return jsonData;

      throw new Error(
        'Something went wrong while running this command tool. Please try again.'
      );
    },
    enabled: false,
    retry: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
    networkMode: 'always',
    onSuccess: () => {
      toast({
        className: 'text-brand-teal',
        title: `Successfully executed the ${tool?.name} Tool.`,
      });
    },
  });
};

export const useToggleToolData = (tool: ToggleTool) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`http://localhost:8000/tools/${tool?.id}`);

      if (!res.ok)
        throw new Error(`Error fetching tool data for ID: ${tool?.id}`);

      const jsonData = await res.json();
      if (jsonData.success) return jsonData;

      throw new Error(
        'Something went wrong while running this toggle tool. Please try again.'
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-tools']);
    },
  });
};
