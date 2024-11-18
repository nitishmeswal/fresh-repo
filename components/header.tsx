import React from 'react'
import logo from '../public/logo.svg'
import Image from 'next/image'
const Header = () => {
  return (
    <div className='flex flex-1 justify-evenly items-center flex-row bg-gray-800 px-8'>
        <div id='logo' className='justify-center '>
            <Image src={logo} alt='logo' height={22} width={22} />
        </div>
      
    </div>
  )
}

export default Header
