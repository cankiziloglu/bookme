import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const HomePage = async () => {

  const { userId } = await auth()
  if (userId) redirect('/events')

  return (
    <div className='text-center container my-4 mx-auto'>
      <h1 className='text-4xl font-bold mb-4'>Hello World</h1>
      <div className="flex gap-2 justify-center">
        <Button asChild><SignInButton /></Button>
        <Button asChild><SignUpButton /></Button>
        <UserButton />
      </div>
    </div>
  );
};

export default HomePage;
