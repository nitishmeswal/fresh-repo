import Image from 'next/image';
import React from 'react'
import logo from "../public/logo.svg";
import search from "../public/search.svg";
import bell from "../public/bell.svg";
import loggedIn from "../public/loggedin.svg";
const Header = () => {
  return (
    <div className='flex flex-1 w-full items-center bg-gray-950 px-8  h-[13vh] mb-2'>
      <div className="flex flex-row justify-evenly w-full items-center">

        <div id='logo' className=' flex justify-center mr-16 items-center'>
            <Image src={logo} alt='logo' height={32} className=""/>
        </div>
        <div className="w-full flex  flex-row items-center bg-black rounded-full mx-4 mr-10 px-4 py-2">
            <Image src={search} alt='search' height={6} width={6} className="w-6"/>
            <input type="text" className=" w-[80%] bg-black text-white ml-6 " placeholder="Search..."/>
        </div>
        <div className="flex justify-center items-center mx-4 my-2">

        <div className="flex rounded-full p-3 bg-white mr-8">
          <Image src={bell} alt='bell' height={8} width={8} className="w-7"/>
          
        </div>
        <div className=" flex items-center rounded-full bg-white">
          <Image src={loggedIn} alt='bell' className="w-[68px]"/>
        </div>
      </div>
    </div>
      <div className=" h-3"></div>
    </div>
  );
}

export default Header
