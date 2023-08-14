/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-no-undef */

'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';

import ToolHeader from '@/components/text/tool-header';
import { Separator } from '@/components/ui/separator';

import { useGlobalStateStore } from '@/store/global-state-store';

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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data));
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
                    <FormLabel className='text-base'>Action</FormLabel>
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
                    <FormLabel className='text-base'>Browser</FormLabel>
                    <FormDescription>
                      Select the browsers for bookmark management.
                    </FormDescription>
                  </div>
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name='items'
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className='flex flex-row items-start space-x-3 space-y-0'
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                disabled={item.disabled}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className='text-sm font-normal'>
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </section>
    </header>
  );
};

export default Bookmarks;
