'use client';

import { z } from 'zod';
import { shallow } from 'zustand/shallow';
import { useFetchData, LDAPPasswordDataResponse } from '@/hooks/useFetchData';
import { useLDAPPasswordStore } from '@/store/ldap-password-store';

export const LDAPDomainDataResponse = z.object({
  Logged_on_Domain: z.string(),
  Logged_on_User: z.string(),
  Last_Logon_Time: z.string(),
});

const ONE_DAY_IN_MS = 86400000;

export const useLDAPData = (method: string) => {
  const { data, isLoading, isFetching, isSuccess, isError, refetch } =
    useFetchData(
      `http://127.0.0.1:8000/tools/execute/LDAPStatus/?method=${method}`,
      method === 'get_password'
        ? LDAPPasswordDataResponse
        : LDAPDomainDataResponse,
      false,
      method === 'get_password' ? ONE_DAY_IN_MS : false,
      false
    );

  const [passwordExpiresIn, description, lastUpdated] = useLDAPPasswordStore(
    (state) => [state.passwordExpiresIn, state.description, state.lastUpdated],
    shallow
  );

  const LDAPDataResponse = {
    data,
    isFetching,
    isLoading,
    isSuccess,
    isError,
    refetch,
  };

  const LDAPPasswordData = {
    passwordExpiresIn,
    description,
    lastUpdated,
  };

  if (method === 'get_password') {
    return { LDAPPasswordData, LDAPDataResponse };
  }

  return { LDAPDataResponse };
};
