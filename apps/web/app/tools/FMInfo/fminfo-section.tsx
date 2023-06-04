import ClipboardCard from './clipboard-card';
import getFMInfoData from '@/lib/getFMInfoData';
import { Card, CardDescription, CardContent } from '@/components/ui/card';

type UserPage = {
  'Logged on domain': string;
  'Logged on user': string;
  'Last login time': string;
  'Last password set': string;
  'Password expiration date': string;
};
type DevicePage = {
  'Computer name': string;
  'CPU details': string;
  RAM: string;
  'Total disk size': string;
  'Current disk usage': string;
  Manufacturer: string;
  Model: string;
  'CPU architecture': string;
  'Last boot time': string;
  'Serial number': string;
};

type SectionType = {
  user: ApiResponse<UserPage>;
  device: ApiResponse<DevicePage>;
  network: ApiResponse<any>;
  // Add more mappings as necessary
};

type SectionPromise<T extends keyof SectionType> = Promise<SectionType[T]>;

type FMInfoPageProps = {
  section: keyof SectionType;
};

interface ApiResponse<T> {
  result: T;
}

const FMInfoSection = async ({ section }: FMInfoPageProps) => {
  const data: SectionPromise<typeof section> = getFMInfoData(section);
  const pageData = await data;

  return (
    <div>
      {section === 'network' ? (
        <Card className='mt-6'>
          <CardDescription className='px-2 pt-2'>
            Active network adapters
          </CardDescription>
          <CardContent>
            <div className='mt-6 grid w-full grid-cols-2 gap-4 '>
              {Object.keys(pageData.result.active_adapters).map((key) => (
                <ClipboardCard
                  title={key}
                  description={pageData.result.active_adapters[key]}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className='mt-6 grid w-full grid-cols-2 gap-4 '>
          {Object.keys(pageData.result).map((key) => (
            <ClipboardCard title={key} description={pageData.result[key]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FMInfoSection;
