/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-no-useless-fragment */

'use client';

import { useState, useEffect } from 'react';

import { Laugh, AlertTriangle } from 'lucide-react';

import useConnectionState from './hooks/useConnectionState';
import useMounted from './hooks/useMounted';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import ConnectionBadge from './connection-badge';

export type ConnectionState =
  | 'connected'
  | 'not_connected'
  | 'error'
  | 'loading';

export type ConnectionMessage = {
  connectionState: ConnectionState;
  sublabel: string;
};

const HomePage = () => {
  const [isOptimalEnviroment, setIsOptimalEnvironment] = useState(false);

  const { connectionState: internetState, connectionLabel: internetLabel } =
    useConnectionState('internet');

  const { connectionState: ADState, connectionLabel: ADLabel } =
    useConnectionState('ad');

  const { connectionState: domainState, connectionLabel: domainLabel } =
    useConnectionState('domain');

  useEffect(() => {
    if (
      internetState === 'connected' &&
      ADState === 'connected' &&
      domainState === 'connected'
    ) {
      setIsOptimalEnvironment(true);
    }

    setIsOptimalEnvironment(false);
  }, [internetState, ADState, domainState]);

  return (
    <>
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Your Talos Home
            </h2>
            <p className='text-muted-foreground text-sm'>
              Live health metrics for your work environment.
            </p>
          </div>
        </div>

        <Card className='my-4'>
          <div className='p-4'>
            {isOptimalEnviroment ? (
              <Alert variant='success'>
                <Laugh className='h-4 w-4' />
                <AlertTitle className='text-brand-green-900 dark:text-brand-green-300'>
                  You&apos;re good to go!
                </AlertTitle>
                <AlertDescription>
                  Your device is configured for an optimal work environment!
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className='' variant='warning'>
                <AlertTriangle className='h-4 w-4' />
                <AlertTitle className='text-brand-yellow-700 dark:text-brand-yellow-200'>
                  Heads up!
                </AlertTitle>
                <AlertDescription>
                  Your device isn&apos;t configured for an optimal work
                  enviornment. Check the connection icons below for more details
                </AlertDescription>
              </Alert>
            )}
          </div>

          <CardContent>
            <div>
              <Label className='text-muted-foreground text-md'>
                Connections
                <div className='mt-2 flex items-center justify-around'>
                  <ConnectionBadge
                    title='Internet'
                    state={internetState}
                    sublabel={internetLabel}
                  />

                  <ConnectionBadge
                    title='Azure Active Directory'
                    state={ADState}
                    sublabel={ADLabel}
                  />

                  <ConnectionBadge
                    title='Trusted Network'
                    state={domainState}
                    sublabel={domainLabel}
                  />
                </div>
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default HomePage;
