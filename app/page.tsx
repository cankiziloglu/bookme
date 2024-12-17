import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className='text-center container my-4 mx-auto'>
      <h1 className='text-4xl font-bold mb-4'>Hello World</h1>
      <div className="flex gap-2 justify-center">
        <Button>Sign In</Button>
        <Button>Sign Up</Button>
      </div>
    </div>
  );
};

export default HomePage;
