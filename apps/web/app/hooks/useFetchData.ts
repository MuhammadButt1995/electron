/* eslint-disable @typescript-eslint/naming-convention */

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useADStore, useTrustedNetworkStore } from '@/store/connection-store';
import { useLDAPPasswordStore } from '@/store/ldap-password-store';
import { useWiFiStore } from '../store/wifi-assistant-store';
import { useDiskSpaceStore } from '@/store/disk-space-store';
import { getFormattedDT } from '@/components/lib/utils';

export const ADStatusWindowsResponse = z.object({
  azure_ad_joined: z.boolean(),
  domain_joined: z.boolean(),
  is_connected: z.boolean(),
});

export const ADStatusMacResponse = z.object({
  ad_bind: z.boolean(),
  is_connected: z.boolean(),
});

export const TrustedNetworkStatusResponse = z.object({
  status: z.union([
    z.literal('ZPA'),
    z.literal('VPN'),
    z.literal('not_connected'),
  ]),
});

export const WiFiDataResponse = z.object({
  details: z.object({
    signal: z.object({
      quality: z.union([
        z.literal('reliable'),
        z.literal('decent'),
        z.literal('slow'),
      ]),
      value: z.number(),
    }),
    radio_type: z.object({
      quality: z.union([
        z.literal('reliable'),
        z.literal('decent'),
        z.literal('slow'),
      ]),
      value: z.string(),
    }),
    channel: z.object({
      quality: z.union([
        z.literal('reliable'),
        z.literal('decent'),
        z.literal('slow'),
      ]),
      value: z.number(),
    }),
    overall: z.union([
      z.literal('RELIABLE'),
      z.literal('DECENT'),
      z.literal('SLOW'),
    ]),
  }),
});

export const LDAPPasswordDataResponse = z.object({
  days_left: z.string(),
  datetime: z.string(),
});

export const DiskSpaceResponse = z.object({
  Total_disk_size: z.string(),
  Current_disk_usage: z.string(),
  Remaining_disk_space: z.string(),
  Disk_space_usage: z.union([
    z.literal('LOW'),
    z.literal('MEDIUM'),
    z.literal('HIGH'),
  ]),
});

// Define a function to fetch data from the API
export async function fetchData<T extends z.ZodType<any, any>>(
  url: string,
  schema: T
): Promise<T['_type']> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return schema.parse(data);
}

export function useFetchData<T extends z.ZodType<any, any>>(
  url: string,
  schema: T,
  refetchOnMount: boolean | 'always',
  refetchInterval?: number | false,
  refetchOnWindowFocus?: boolean
) {
  // Use the useQuery hook to fetch data
  const query = useQuery({
    queryKey: [url],
    queryFn: () => fetchData<T>(url, schema),
    refetchOnMount,
    refetchInterval,
    refetchOnWindowFocus,
    onSuccess: (data) => {
      // Handle the response data
      const jsonData = data;

      if (url.includes('ADStatus')) {
        if (window.navigator.userAgent.indexOf('Mac') !== -1) {
          const parsedData = ADStatusMacResponse.parse(jsonData);

          if (parsedData.is_connected) {
            useADStore.getState().updateStatus('CONNECTED');
            useADStore
              .getState()
              .updateDescription(
                'You machine is bound to On-Prem Active Directory.'
              );
          } else {
            useADStore.getState().updateStatus('NOT CONNECTED');
            useADStore
              .getState()
              .updateDescription(
                'Your machine is not bound to On-Prem Active Directory.'
              );
          }

          useADStore.getState().updateLastUpdated(getFormattedDT());

          window.onADStatusChange(useADStore.getState().status);
        } else {
          const parsedData = ADStatusWindowsResponse.parse(jsonData);

          if (parsedData.is_connected) {
            useADStore.getState().updateStatus('CONNECTED');
            useADStore
              .getState()
              .updateDescription(
                'Your machine is domain joined and bound to Azure AD.'
              );
          } else {
            useADStore.getState().updateStatus('NOT CONNECTED');
            useADStore
              .getState()
              .updateDescription(
                'Your machine is either not domain joined or not bound to Azure AD.'
              );
          }

          useADStore.getState().updateLastUpdated(getFormattedDT());

          window.onADStatusChange(useADStore.getState().status);
        }
      }

      if (url.includes('TrustedNetworkStatus')) {
        const parsedData = TrustedNetworkStatusResponse.parse(jsonData);

        if (parsedData.status === 'ZPA') {
          useTrustedNetworkStore.getState().updateStatus('CONNECTED');
          useTrustedNetworkStore
            .getState()
            .updateDescription('You are connected to ZPA.');
        } else if (parsedData.status === 'VPN') {
          useTrustedNetworkStore.getState().updateStatus('CONNECTED');
          useTrustedNetworkStore
            .getState()
            .updateDescription('You are connected to VPN.');
        } else {
          useTrustedNetworkStore.getState().updateStatus('NOT CONNECTED');
          useTrustedNetworkStore
            .getState()
            .updateDescription(
              'Please connect to either ZScaler ZPA or Citrix VPN to get onto a trusted network.'
            );
        }

        useTrustedNetworkStore.getState().updateLastUpdated(getFormattedDT());

        window.onDomainStatusChange(useTrustedNetworkStore.getState().status);
      }

      if (url.includes('WifiData')) {
        const parsedData = WiFiDataResponse.parse(jsonData);
        console.log(parsedData);

        useWiFiStore
          .getState()
          .updateData({ signal: parsedData.details.signal.value });
        useWiFiStore
          .getState()
          .updateData({ radioType: parsedData.details.radio_type.value });
        useWiFiStore
          .getState()
          .updateData({ channel: parsedData.details.channel.value });

        if (parsedData.details.overall === 'RELIABLE') {
          useWiFiStore.getState().updateStatus('RELIABLE');
          useWiFiStore
            .getState()
            .updateDescription(
              'Your connection is stable and dependable for your work environment.'
            );
        } else if (parsedData.details.overall === 'DECENT') {
          useWiFiStore.getState().updateStatus('DECENT');
          useWiFiStore
            .getState()
            .updateDescription(
              'Your connection is adequate for your work environment, however you may experience occasional slowdowns.'
            );
        } else {
          useWiFiStore.getState().updateStatus('SLOW');
          useWiFiStore
            .getState()
            .updateDescription(
              'Your connection may make it challenging to maintain a stable online presence.'
            );
        }

        useWiFiStore.getState().updateLastUpdated(getFormattedDT());

        window.onWiFiStatusChange(useWiFiStore.getState().status);
      }

      if (url.includes('LDAPStatus/?method=get_password')) {
        const parsedData = LDAPPasswordDataResponse.parse(jsonData);

        useLDAPPasswordStore
          .getState()
          .updatePasswordExpiresIn(parsedData.days_left);
        useLDAPPasswordStore
          .getState()
          .updateDescription(
            `You have until ${parsedData.datetime} to change your password`
          );

        useLDAPPasswordStore.getState().updateLastUpdated(getFormattedDT());

        window.onLDAPPasswordExpiresInChange(parsedData.days_left);
      }

      if (url.includes('DeviceData/?method=get_disk_usage')) {
        const parsedData = DiskSpaceResponse.parse(jsonData);

        useDiskSpaceStore
          .getState()
          .updateDiskData({ totalDiskSpace: parsedData.Total_disk_size });
        useDiskSpaceStore
          .getState()
          .updateDiskData({ currentDiskUsage: parsedData.Current_disk_usage });
        useDiskSpaceStore.getState().updateDiskData({
          remainingDiskSpace: parsedData.Remaining_disk_space,
        });

        useDiskSpaceStore.getState().updateStatus(parsedData.Disk_space_usage);
        useDiskSpaceStore
          .getState()
          .updateDescription(
            `You are using ${parsedData.Current_disk_usage} out of ${parsedData.Total_disk_size}. You have ${parsedData.Remaining_disk_space} of disk space remaining.`
          );

        useDiskSpaceStore.getState().updateLastUpdated(getFormattedDT());

        window.onDiskSpaceStatusChange(parsedData.Disk_space_usage);
      }
    },
    onError: (error) => {
      // Handle the error
      console.error(error);
    },
  });

  return query;
}
