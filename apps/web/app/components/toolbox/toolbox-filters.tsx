type ToolboxFiltersProps = {
  children: React.ReactNode;
};

const ToolboxFilters = ({ children }: ToolboxFiltersProps) => (
  <div className='flex items-center justify-start my-4 space-x-6'>
    {children}
  </div>
);

export default ToolboxFilters;
