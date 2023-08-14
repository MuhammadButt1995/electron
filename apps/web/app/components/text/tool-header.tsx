type ToolHeaderProps = {
  title: string;
  subtitle: string;
};

const ToolHeader = ({ title, subtitle }: ToolHeaderProps) => (
  <div className='flex items-center justify-between'>
    <div className='space-y-1'>
      <div className='flex flex-row items-center justify-start space-x-2'>
        <div className='flex flex-col justify-center items-start'>
          <h2 className='text-lg font-semibold text-brand-teal'>{title}</h2>
          <p className='text-sm text-muted-foreground'>{subtitle}</p>
        </div>
      </div>
    </div>
  </div>
);

export default ToolHeader;
