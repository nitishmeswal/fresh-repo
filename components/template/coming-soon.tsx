"use client";

import ComingSoonImg from "../../../assets/.svg";
import Image from "next/image";
import { Button } from "../Button";
import { useRouter } from "next/navigation";

const ComingSoon = () => {
  const route = useRouter()
  return (
    <div className="flex justify-center items-center">
      <div className="space-y-4 flex flex-col items-center max-w-lg p-4 text-center text-stone-600 text-md">
        <Image
          alt="Coming soon illustration"
          width="0"
          height="0"
          className="w-40 md:w-52 mb-6"
          src={ComingSoonImg}
        />
        <h2 className="text-stone-800 text-2xl font-medium">
          Under construction!
        </h2>
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
        <Button label="Back to Dashboard" onClick={() => {
          route.push("/")
        }} />

      </div>
    </div>
  );
};

export default ComingSoon;