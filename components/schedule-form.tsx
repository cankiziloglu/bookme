'use client';

import { DAYS_OF_WEEK_IN_ORDER } from '@/lib/constants';
import { scheduleFormSchema } from '@/lib/form-schemas';
import { formatTimezoneOffset } from '@/lib/formatters';
import { timeToInt } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Fragment, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from './ui/input';
import { saveSchedule } from '@/server/actions/schedule';

type AvailabilityType = {
  startTime: string;
  endTime: string;
  dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number];
};

export default function ScheduleForm({
  schedule,
}: {
  schedule?: {
    timezone: string;
    availabilities: AvailabilityType[];
  };
}) {
  const form = useForm<z.infer<typeof scheduleFormSchema>>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      timezone:
        schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      availabilities: schedule?.availabilities.toSorted((a, b) => {
        return timeToInt(a.startTime) - timeToInt(b.startTime);
      }),
    },
  });

  const [successMessage, setSuccessMessage] = useState<string>();

  const {
    append: addAvailability,
    remove: reomveAvailability,
    fields: availabilityFields,
  } = useFieldArray({ control: form.control, name: 'availabilities' });

  const groupedAvailabilityFields = Object.groupBy(
    availabilityFields.map((field, index) => ({ ...field, index })),
    (availability) => availability.dayOfWeek
  );

  async function onSubmit(values: z.infer<typeof scheduleFormSchema>) {
    const data = await saveSchedule(values);

    if (data?.error) {
      form.setError('root', {
        message: 'There was an error saving the schedule. Please try again.',
      });
    } else {
      setSuccessMessage('Schedule saved!');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-6'
      >
        <FormField
          control={form.control}
          name='timezone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Intl.supportedValuesOf('timeZone').map((timezone) => (
                    <SelectItem key={timezone} value={timezone}>
                      {timezone}
                      {` - (${formatTimezoneOffset(timezone)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-[auto,1fr] gap-y-6 gap-x-4'>
          {DAYS_OF_WEEK_IN_ORDER.map((dayOfWeek) => (
            <Fragment key={dayOfWeek}>
              <div className='capitalize text-sm font-semibold'>
                {dayOfWeek.substring(0, 3)}
              </div>
              <div>
                <Button
                  type='button'
                  className='size-6 p-1'
                  variant='outline'
                  onClick={() => {
                    addAvailability({
                      dayOfWeek,
                      startTime: '09:00',
                      endTime: '17:00',
                    });
                  }}
                >
                  <Plus className='size-full' />
                </Button>
                {groupedAvailabilityFields[dayOfWeek]?.map(
                  (field, labelIndex) => (
                    <div className='flex flex-col gap-1' key={field.id}>
                      <div className='flex gap-2 items-center'>
                        <FormField
                          control={form.control}
                          name={`availabilities.${field.index}.startTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className='w-24'
                                  aria-label={`${dayOfWeek} Start Time ${
                                    labelIndex + 1
                                  }`}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        -
                        <FormField
                          control={form.control}
                          name={`availabilities.${field.index}.endTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className='w-24'
                                  aria-label={`${dayOfWeek} End Time ${
                                    labelIndex + 1
                                  }`}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type='button'
                          className='size-6 p-1'
                          variant='destructiveGhost'
                          onClick={() => {
                            reomveAvailability(field.index);
                          }}
                        >
                          <X />
                        </Button>
                      </div>
                      <FormMessage>
                        {
                          form.formState.errors.availabilities?.at?.(
                            field.index
                          )?.root?.message
                        }
                      </FormMessage>
                      <FormMessage>
                        {
                          form.formState.errors.availabilities?.at?.(
                            field.index
                          )?.startTime?.message
                        }
                      </FormMessage>
                      <FormMessage>
                        {
                          form.formState.errors.availabilities?.at?.(
                            field.index
                          )?.endTime?.message
                        }
                      </FormMessage>
                    </div>
                  )
                )}
              </div>
            </Fragment>
          ))}
        </div>

        {form.formState.errors.root && (
          <div className='text-destructive'>
            {form.formState.errors.root.message}
          </div>
        )}
        {successMessage && (
          <div className='text-green-800'>{successMessage}</div>
        )}
        <div className='flex gap-2 justify-end pt-2'>
          <Button type='submit' disabled={form.formState.isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}