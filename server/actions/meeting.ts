'use server';

import { db } from '@/db/db';
import { meetingFormSchema } from '@/lib/form-schemas';
import { getValidTimesFromSchedule } from '@/lib/getValidTimesFromSchedule';
import 'use-server';
import { z } from 'zod';
import { createCalendarEvent } from '../googleCalendar';
import { redirect } from 'next/navigation';
import { fromZonedTime } from 'date-fns-tz';

export async function createMeeting({
  unsafeData,
  eventId,
  clerkUserId,
}: {
  unsafeData: z.infer<typeof meetingFormSchema>;
  eventId: string;
  clerkUserId: string;
}): Promise<{ error: boolean | undefined }> {
  const { success, data } = meetingFormSchema.safeParse(unsafeData);

  if (!success || data == null) {
    return { error: true };
  }

  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId: userId, isActive, id }, { eq, and }) =>
      and(eq(isActive, true), eq(userId, clerkUserId), eq(id, eventId)),
  });

  if (event == null) return { error: true };

  const startInTimezone = fromZonedTime(data.startTime, data.timezone);

  const validTimes = await getValidTimesFromSchedule([startInTimezone], event);
  if (validTimes.length === 0) return { error: true };

  await createCalendarEvent({
    ...data,
    startTime: startInTimezone,
    clerkUserId: clerkUserId,
    durationInMinutes: event.durationInMinutes,
    eventName: event.name,
  });

  redirect(
    `/book/${clerkUserId}/${eventId}/success?startTime=${data.startTime.toISOString()}`
  );

  return { error: true };
}
