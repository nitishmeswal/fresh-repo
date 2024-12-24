"use client";

import ComingSoonImg from "@/public/under construction.webp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const ComingSoon = () => {
  const route = useRouter()
  return (
    <div className="flex justify-center items-center">
      <div className="  space-y-4 flex flex-col items-center max-w-lg p-4 text-center text-stone-600 text-md">
        <Image
          alt="Coming soon illustration"
          width="0"
          height="0"
          className=" w-[300px] h-[260px] "
          src={ComingSoonImg}
        />
        <h2 className="text-stone-800 text-3xl font-SemiBold font-serif dark:text-gray-50">
          Under construction!
        </h2>
        <div className={`text-stone-600 text-md space-y-4 font-medium dark:text-gray-200`}>
          <p>We're Currently in launching our Beta Version!</p>
          <p>
            Join us on our journey to revolutionize the AI industry with cutting-edge GPU renting and AI-based services. 
            Our platform is designed to empower enterprises with the computational 
            power they need to innovate and excel.
            Stay tuned for exciting updates and be a part of the future of AI technology!
          </p>
          <p>
            If there is anything you would like to share with us, feel free to reach out!
          </p>
        </div>
        <Button className=" dark:text-gray-300 dark:hover:text-gray-100 dark:bg-gray-850 dark:hover:bg-blue-600 px-8 py-6  font-medium text-lg rounded-xl" onClick={() => {
          route.push("/")
        }} > Go back to Home</Button>


      </div>
    </div>
  );
};

export default ComingSoon;