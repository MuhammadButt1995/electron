/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-no-undef */

import ToolHeader from '@/components/text/tool-header';
import { Separator } from '@/components/ui/separator';

const VPNHelperPage = () => {
  return (
    <section className='p-6'>
      <ToolHeader title='VPN Helper' subtitle='Connect to captive portals.' />
      <Separator className='mt-4' />
    </section>
  );
};

export default VPNHelperPage;
