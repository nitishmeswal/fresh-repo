import Header from "@/components/header";
import Image from "next/image";
import logo from "../public/logo.svg";
import search from "../public/search.svg";
import bell from "../public/bell.svg";
import loginImage from "../public/login-image.png";
export default function Home() {
  return (
    <div className='flex flex-1 items-center bg-gray-800 px-8  h-[12vh]'>
      <div className="flex flex-row justify-evenly w-full items-center">

        <div id='logo' className=' flex justify-center mr-8 items-center'>
            <Image src={logo} alt='logo' height={48} width={48} className="w-48"/>
        </div>
        <div className="w-[70%] flex flex-row items-center bg-black rounded-full mr-10 px-4 py-2">
            <Image src={search} alt='search' height={6} width={5} className="w-5"/>
            <input type="text" className=" w-[80%] bg-black text-white ml-6 " placeholder="Search..."/>
        </div>
        <div className="flex rounded-full p-3 bg-white mr-8">
          <Image src={bell} alt='bell' height={5} width={5} className="w-5"/>
        </div>
        <div className=" flex items-center rounded-full bg-white">
          <Image src={""} alt='bell' height={12} width={12} className="w-12"/>
        </div>
      </div>
    </div>
  );
}
