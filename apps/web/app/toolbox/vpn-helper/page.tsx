/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-no-undef */

'use client';

import { useQuery } from '@tanstack/react-query';
import ToolHeader from '@/components/text/tool-header';
import { Separator } from '@/components/ui/separator';

const useResetDNSMutation = () => {
  return useQuery({
    queryKey: ['reset-dns'],
    queryFn: async () => {
      const res = await fetch('http://127.0.0.1:8567/tools/reset-dns');

      if (!res.ok) throw new Error('Failed to fetch data');

      const jsonData = await res.json();
      if (jsonData.success) return jsonData;

      throw new Error(jsonData.error);
    },
    refetchInterval: false,
    refetchOnReconnect: false,
    networkMode: 'always',
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    useErrorBoundary: true,
    cacheTime: 0,
    staleTime: 0,
  });
};

const VPNHelperPage = () => {
  const resetDNSQuery = useResetDNSMutation();
  const IS_DNS_REFRESHING = resetDNSQuery.isLoading;

  return (
    <>
      <section className='p-6'>
        <ToolHeader title='VPN Helper' subtitle='Connect to captive portals.' />
        <Separator className='mt-4' />
      </section>
      <div>
        {IS_DNS_REFRESHING ? (
          <div>loading...</div>
        ) : (
          <>
            <p>Captive Portal</p>
            <p>pls connect</p>
          </>
        )}
      </div>
    </>
  );
};

export default VPNHelperPage;
