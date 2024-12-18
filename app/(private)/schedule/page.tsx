import ScheduleForm from '@/components/schedule-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { db } from '@/db/db';
import { auth } from '@clerk/nextjs/server';

export default async function SchedulePage() {

  const { userId, redirectToSignIn } = await auth()
  if (userId == null) return redirectToSignIn()
  
  const schedule = await db.query.ScheduleTable.findFirst({
    where: (({ clerkUserId }, { eq }) => eq(clerkUserId, userId)),
    with: {
      availabilities: true,
    }
  })
  
  return (
    <Card className='max-w-md w-full flex flex-col mx-auto mt-12'>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <ScheduleForm schedule={ schedule } />
      </CardContent>
    </Card>
  );
}
