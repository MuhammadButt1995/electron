/* eslint-disable react/require-default-props */

import { HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

type DialogButtonProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
};

const DialogButton = ({ children, icon }: DialogButtonProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className='w-6 h-6 rounded-full ' variant='ghost' size='icon'>
        <div>{icon || <HelpCircle className='w-5 h-5' />}</div>
      </Button>
    </DialogTrigger>
    <DialogContent className='max-w-[425px]'>{children}</DialogContent>
  </Dialog>
);

export default DialogButton;
