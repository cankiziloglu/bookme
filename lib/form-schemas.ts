import { z } from 'zod';
import { DAYS_OF_WEEK_IN_ORDER } from './constants';
import { timeToInt } from './utils';
import { startOfDay } from 'date-fns';

export const eventFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  durationInMinutes: z.coerce
    .number()
    .int()
    .positive('Duration must be greater than 0')
    .max(60 * 12, 'Duration must be less than 12 hours (720 minutes)'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const scheduleFormSchema = z.object({
  timezone: z.string().min(1, 'Required'),
  availabilities: z
    .array(
      z.object({
        dayOfWeek: z.enum(DAYS_OF_WEEK_IN_ORDER),
        startTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            'Time must be in HH:MM format'
          ),
        endTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            'Time must be in HH:MM format'
          ),
      })
    )
    .superRefine((availabilities, ctx) => {
      availabilities.forEach((availability, index) => {
        const overlaps = availabilities.some((a, i) => {
          return (
            i !== index &&
            a.dayOfWeek === availability.dayOfWeek &&
            timeToInt(a.startTime) < timeToInt(availability.endTime) &&
            timeToInt(a.endTime) > timeToInt(availability.startTime)
          );
        });
        if (overlaps) {
          ctx.addIssue({
            code: 'custom',
            message: 'Availability overlaps with another',
            path: [index],
          });
        }
        if (
          timeToInt(availability.startTime) >= timeToInt(availability.endTime)
        ) {
          ctx.addIssue({
            code: 'custom',
            message: 'End time must be after start time',
            path: [index],
          });
        }
      });
    }),
});

export const meetingFormSchema = z.object({
  startTime: z.date().min(new Date()),
  guestEmail: z.string().email().min(1, 'Required'),
  guestName: z.string().min(1, 'Required'),
  guestNotes: z.string().optional(),
  timezone: z.string().min(1, 'Required'),
  date: z.date().min(startOfDay(new Date()), 'Must be in the future'),
});
