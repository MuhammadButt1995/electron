type Tool = {
  name: string;
  description: string;
  tags: string[];
  tool_type: string;
  icon: string;
};

export const useFilteredTools = (
  tools: Tool[],
  filter: string,
  selectedTags: string[],
  selectedTypes: string[]
) => {
  const lowerCaseFilter = filter.toLowerCase();

  const filteredTools = tools
    .filter((tool) =>
      lowerCaseFilter ? tool.name.toLowerCase().includes(lowerCaseFilter) : true
    )
    .filter((tool) =>
      selectedTags.length
        ? selectedTags.some((tag) => tool.tags.includes(tag))
        : true
    )
    .filter((tool) =>
      selectedTypes.length
        ? selectedTypes.some((type) => {
            if (type === 'Non-Automated') {
              return !tool.tool_type.includes('Auto-Enabled');
            }
            return tool.tool_type.includes(type);
          })
        : true
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return filteredTools;
};
