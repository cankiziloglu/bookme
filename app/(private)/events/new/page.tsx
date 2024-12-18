import EventForm from '@/components/event-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function NewEventPage() {
  return (
    <Card className='max-w-md w-full flex flex-col mx-auto mt-12'>
      <CardHeader>
        <CardTitle>New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <EventForm />
      </CardContent>
    </Card>
  );
}
