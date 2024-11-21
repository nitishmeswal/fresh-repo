'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black text-green-100 ">
      {/* <h3 className="text-3xl mt-8 text-gray-600">Page Not Found</h3> */}
    
      <div className='py-8 mb-8 '>
      <h1 className='flex flex-1 justify-center items-center text-white text-4xl font-bold'>404</h1> 
      <h1 className='flex flex-1 justify-center items-center text-white text-4xl font-bold mt-2'>NOT FOUND</h1>
      <p className="text-[14px] text-gray-600 px-4 mt-6 mb-4 text-center">
        Sorry, we can&apos;t seem to find this page. The page may not exist or an error has occurred.
      </p>
      </div>
      
      {/* <Image src={error} alt="error" height={150} className="mb-6" /> */}
      <Button className="bg-gray-200" variant="secondary" onClick={handleClick}>
        Back To Dashboard
      </Button>
    </main>
  );
}
