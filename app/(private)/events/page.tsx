import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs/server';
import { CalendarPlus, CalendarRange } from 'lucide-react';
import { db } from '@/db/db';
import Link from 'next/link';
import { EventTable } from '@/db/schema';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatEventDescription } from '@/lib/formatters';
import CopyEventButton from '@/components/copy-event-button';
import { cn } from '@/lib/utils';

const EventsPage = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });

  return (
    <>
      <div className='flex gap-4'>
        <h1>Events</h1>
        <Button asChild>
          <Link href='/events/new'>
            <CalendarPlus className='mr-4 size-6' /> New Event
          </Link>
        </Button>
      </div>
      {events.length > 0 ? (
        <div className='grid gap-4 grid-cols-[repeat(auto-fill, minmax(300px, 1fr))]'>
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center gap-4'>
          <CalendarRange className='size-12 mx-auto' />
          You do not have any events yet. Create your first event to get
          started!
          <Button asChild>
            <Link href='/events/new'>
              <CalendarPlus className='mr-4 size-6' /> New Event
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default EventsPage;

function EventCard({
  id,
  isActive,
  name,
  description,
  durationInMinutes,
  clerkUserId,
}: Omit<typeof EventTable.$inferSelect, 'createdAt' | 'updatedAt'>) {
  return (
    <Card className={cn('flex flex-col', !isActive && 'border-secondary/50')}>
      <CardHeader className={cn(!isActive && 'opacity-50')}>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {formatEventDescription(durationInMinutes)}
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(!isActive && 'opacity-50')}>
        {description}
      </CardContent>
      <CardFooter className='flex justify-end gap-2 mt-auto'>
        {isActive && (
          <CopyEventButton
            variant='outline'
            eventId={id}
            clerkUserId={clerkUserId}
          />
        )}
        <Button asChild>
          <Link href={`/events/${id}/edit`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
