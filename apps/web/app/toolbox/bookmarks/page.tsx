'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ReloadIcon } from '@radix-ui/react-icons';

import { useGlobalStateStore } from '@/store/global-state-store';
import { useToast } from '@/components/ui/use-toast';

import ToolHeader from '@/components/text/tool-header';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type MutationVariables = {
  endpoint: string;
  action: 'export' | 'import';
  browsers: string;
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatBrowsersList(browsers: string): string {
  const browserList = browsers.split(',').map(capitalizeFirstLetter);
  if (browserList.length === 1) return browserList[0];
  if (browserList.length === 2) return browserList.join(' and ');
  const lastBrowser = browserList.pop();
  return `${browserList.join(', ')} and ${lastBrowser}`;
}

function useBookmarkMutation() {
  const { toast } = useToast();
  return useMutation(
    async (variables: MutationVariables) => {
      const res = await fetch(variables.endpoint);
      if (!res.ok) throw new Error(`Error: ${variables.endpoint}`);
      const jsonData = await res.json();
      if (jsonData.success) return jsonData;
      throw new Error('Something went wrong.');
    },
    {
      onSuccess: (data, variables: MutationVariables) => {
        const formattedBrowsers = formatBrowsersList(variables.browsers);
        toast({
          className: 'text-brand-teal',
          title:
            variables.action === 'export'
              ? `Successfully exported bookmarks for ${formattedBrowsers}!`
              : `Successfully imported bookmarks for ${formattedBrowsers}!`,
        });
      },
      onError: (error, variables: MutationVariables) => {
        const formattedBrowsers = formatBrowsersList(variables.browsers);
        toast({
          className: 'text-red-600',
          title:
            variables.action === 'export'
              ? `Error exporting bookmarks for ${formattedBrowsers}!`
              : `Error importing bookmarks for ${formattedBrowsers}!`,
          description: `${error}`,
        });
      },
    }
  );
}

const Bookmarks = () => {
  const os = useGlobalStateStore((state) => state.os);

  const items = [
    {
      id: 'chrome',
      label: 'Chrome',
      disabled: os !== 'windows',
    },
    {
      id: 'safari',
      label: 'Safari',
      disabled: os !== 'macos',
    },
  ] as const;

  const FormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: 'You have to select at least one browser.',
    }),
    action: z.enum(['export', 'import'], {
      required_error: 'You need to select an action.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [''],
    },
  });

  const mutationQuery = useBookmarkMutation();
  const IS_MUTATION_LOADING = mutationQuery.isLoading;

  function getEndpoint(data: z.infer<typeof FormSchema>) {
    const baseURL = `http://localhost:8000/tools/${data.action}-bookmarks`;
    const selectedBrowsers = data.items.filter(Boolean);
    const browserQueryParam = selectedBrowsers.length
      ? `?browser=${selectedBrowsers.join(',')}`
      : '?browser=chrome';
    return baseURL + browserQueryParam;
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const endpoint = getEndpoint(data);
    mutationQuery.mutate({
      endpoint,
      action: data.action,
      browsers: data.items.filter(Boolean).join(','),
    });
  }

  return (
    <header className='p-6'>
      <ToolHeader
        title='Bookmarks Manager'
        subtitle='Import or Export your browser bookmarks.'
      />
      <Separator className='mt-4' />

      <section className='py-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='action'
              render={({ field }) => (
                <FormItem className=''>
                  <div className='mb-4'>
                    <FormLabel className='text-brand-teal text-md font-semibold'>
                      Action
                    </FormLabel>
                    <FormDescription>
                      Do you want to export or import your bookmarks?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1'
                    >
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='export' />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          Export Bookmarks
                        </FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='import' />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          Import Bookmarks
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='items'
              render={() => (
                <FormItem>
                  <div className='mb-4'>
                    <FormLabel className='text-brand-teal text-md font-semibold'>
                      Browser
                    </FormLabel>
                    <FormDescription>
                      Select the browsers for bookmark management.
                    </FormDescription>
                  </div>
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name='items'
                      render={({ field }) => (
                        <FormItem
                          key={item.id}
                          className='flex flex-row items-start space-x-3 space-y-0'
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              disabled={item.disabled}
                              onCheckedChange={(checked) =>
                                checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }
                            />
                          </FormControl>
                          <FormLabel className='text-sm font-normal'>
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-row justify-start items-start space-x-8'>
              {IS_MUTATION_LOADING ? (
                <Button disabled variant='secondary'>
                  <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                  {form.getValues().action === 'export'
                    ? 'Exporting Bookmarks...'
                    : 'Importing Bookmarks...'}
                </Button>
              ) : (
                <Button type='submit'>Submit</Button>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='link'>Looking for Edge Bookmarks?</Button>
                </DialogTrigger>
                <DialogContent className='max-w-[425px]'>
                  <div className='grid gap-4'>
                    <div className='space-y-2'>
                      <h4 className='font-medium leading-none w-80'>
                        Microsoft Edge Auto-Sync
                      </h4>
                      <h4 className='text-sm leading-none text-muted-foreground w-80'>
                        Edge Bookmarks are auto-synced with the cloud!
                      </h4>
                      <Accordion type='single' collapsible className='w-full'>
                        <AccordionItem value='item-1'>
                          <AccordionTrigger>
                            What does auto-synced cloud bookmarks mean for me?
                          </AccordionTrigger>
                          <AccordionContent>
                            Your Microsoft Edge bookmarks are automatically
                            synced and saved across all your devices using your
                            enterprise account. Due to this auto-sync feature,
                            there&apos;s no need to manually import or export
                            bookmarks for Edge.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </Form>
      </section>
    </header>
  );
};

export default Bookmarks;
