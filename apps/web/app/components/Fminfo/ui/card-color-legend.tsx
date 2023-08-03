'use client';

import { useState } from 'react';
import { RectangleHorizontal } from 'lucide-react';
import { CaretSortIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

const cards = {
  ok: (
    <RectangleHorizontal className='w-6 h-6 text-brand-teal fill-brand-teal/20' />
  ),
  warn: (
    <RectangleHorizontal className='w-6 h-6 text-brand-yellow fill-brand-yellow/20' />
  ),
  error: (
    <RectangleHorizontal className='w-6 h-6 text-brand-magenta fill-brand-magenta/20 dark:fill-brand-magenta/30' />
  ),
};

type Item = {
  [key: string]: React.ReactNode;
};

type CardColorLegendProps = {
  items: Item;
};

const CardColorLegend = ({ items }: CardColorLegendProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const n = Object.keys(items).length;
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className='space-y-2'>
      <div className='flex flex-col'>
        <div className='flex flex-row items-center justify-start space-x-4'>
          <p className='font-semibold text-md'>Card Legend</p>
          <CollapsibleTrigger asChild>
            <Button variant='ghost' size='sm'>
              <CaretSortIcon className='w-4 h-4' />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className='space-y-2'>
          <Separator className='mt-2 mb-3' />
          <div
            className={`grid grid-cols-${n} grid-rows-2 place-items-center gap-y-1`}
          >
            {Object.entries(items).map(([key]) => cards[key])}

            {Object.entries(items).map(([_, value]) => value)}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default CardColorLegend;
