'use client';

import { Button } from '@/components/ui/button';
import error from '@/public/404-error_1082022.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h3 className="text-3xl mt-8 text-gray-600">Page Not Found</h3>
      <p className="text-[14px] text-gray-600 px-4 mt-2 mb-4 text-center">
        Sorry, we can&apos;t seem to find this page. The page may not exist or an error has occurred.
      </p>
      <Image src={error} alt="error" height={150} className="mb-6" />
      <Button className="bg-gray-200" variant="secondary" onClick={handleClick}>
        Back To Dashboard
      </Button>
    </main>
  );
}
