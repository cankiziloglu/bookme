import EventForm from '@/components/event-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db/db';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

export default async function EditEventPage({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  const event = await db.query.EventTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) =>
      and(eq(clerkUserId, userId), eq(id, eventId)),
  });

  if (event == null) return notFound();

  return (
    <Card className='max-w-md w-full flex flex-col mx-auto mt-12'>
      <CardHeader>
        <CardTitle>Update Event</CardTitle>
      </CardHeader>
      <CardContent>
        <EventForm
          event={{ ...event, description: event.description || undefined }}
        />
      </CardContent>
    </Card>
  );
}
