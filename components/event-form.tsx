'use client';

import { eventFormSchema } from '@/lib/event-form-schema';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Link from 'next/link';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { createEvent, updateEvent } from '@/server/actions/events';

export default function EventForm({event}:{event?: {id: string, name: string, durationInMinutes: number, isActive: boolean, description?: string}}) {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event ?? {
      name: '',
      durationInMinutes: 30,
      isActive: true,
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    const action = event == null ? createEvent : updateEvent.bind(null, event.id)
    const data = await action(values)

    if (data.error) {
      form.setError('root', {
        message: 'There was an error saving the event. Please try again.'
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>The name users will see when booking</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='durationInMinutes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input {...field} type='number'/>
              </FormControl>
              <FormDescription>In Minutes</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className='resize-none h-24'/>
              </FormControl>
              <FormDescription>Optional description of the event</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='isActive'
          render={({ field }) => (
            <FormItem>
              <div className='flex gap-2 items-center'>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
                <FormLabel>Active</FormLabel>
                </div>
              <FormDescription>Inactive events will not be visible for users to book</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <div className='text-destructive'>
            {form.formState.errors.root.message}
          </div>
        )}
        <div className='flex gap-2 justify-end pt-2'>
          <Button asChild type='button' variant='outline'>
            <Link href={'/events'}>Cancel</Link>
          </Button>
          <Button type='submit'>Save</Button>
        </div>
      </form>
    </Form>
  );
}
