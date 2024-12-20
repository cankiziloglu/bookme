import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/db/db';
import { clerkClient } from '@clerk/nextjs/server';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

export default async function SuccessPage({
  params: { clerkUserId, eventId },
  searchParams: { startTime },
}: {
  params: { clerkUserId: string; eventId: string };
  searchParams: { startTime: string };
}) {
  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId: userId, isActive, id }, { eq, and }) =>
      and(eq(isActive, true), eq(userId, clerkUserId), eq(id, eventId)),
  });

  if (event == null) return notFound();

  const calendarUser = await (await clerkClient()).users.getUser(clerkUserId);
  const startTimeDate = new Date(startTime);

  return (
    <Card className='max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>
          Successfully Booked {event.name} with {calendarUser.fullName}
        </CardTitle>
        <CardDescription>{format(startTimeDate, 'PPPp')}</CardDescription>
      </CardHeader>
      <CardContent>
        You should receive an email confirmation shortly. You can safely close
        this page now.
      </CardContent>
    </Card>
  );
}
