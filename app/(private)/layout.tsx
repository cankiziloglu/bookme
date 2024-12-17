import NavLink from '@/components/navlink';
import { UserButton } from '@clerk/nextjs';
import { CalendarRange } from 'lucide-react';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className='flex py-2 border-b bg-card'>
        <nav className='font-medium flex items-center gap-6 text-sm container'>
          <div className='flex items-center gap-2 font-semibold mr-auto'>
            <CalendarRange className='size-8' />
            <span className='sr-only md:not-sr-only'>BookMe</span>
          </div>
          <NavLink href='/events'>Events</NavLink>
          <NavLink href='/schedule'>Schedule</NavLink>
          <div className='ml-auto size-10'>
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: 'size-full' } }}
            />
          </div>
        </nav>
      </header>
      <main className='container mx-auto my-6'>{children}</main>
    </>
  );
}
