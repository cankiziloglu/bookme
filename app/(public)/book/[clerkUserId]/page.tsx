import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/db/db';
import { EventTable } from '@/db/schema';
import { formatEventDescription } from '@/lib/formatters';
import { clerkClient } from '@clerk/nextjs/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BookingPage({
  params,
}: {
  params: { clerkUserId: string };
}) {
  const { clerkUserId } = await params;

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userId, isActive }, { eq, and }) =>
      and(eq(userId, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc }) => asc(name),
  });

  if (events.length === 0) return notFound();

  const { fullName } = await (await clerkClient()).users.getUser(clerkUserId);

  return (
    <div className='max-w-5xl mx-auto'>
      <h1 className='text-4xl md:text-5xl font-mono font-semibold mb-4 text-center'>
        {fullName}
      </h1>
      <p className='text-muted-foreground mb-6 max-w-sm mx-auto text-center'>
        Welcome to my scheduling page. Please follow the instructions to book an
        event with me.
      </p>
      <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'>
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}

function EventCard({
  id,
  name,
  description,
  durationInMinutes,
  clerkUserId,
}: Omit<typeof EventTable.$inferSelect, 'createdAt' | 'updatedAt'>) {
  return (
    <Card className='flex flex-col'>
      <CardHeader className='opacity-50'>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {formatEventDescription(durationInMinutes)}
        </CardDescription>
      </CardHeader>
      <CardContent className='opacity-50'>{description}</CardContent>
      <CardFooter className='flex justify-end gap-2 mt-auto'>
        <Button asChild>
          <Link href={`/book/${clerkUserId}/${id}`}>Select</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
