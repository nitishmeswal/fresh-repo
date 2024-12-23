'use client'

import UserSetting from '@/components/settings/user-setting'
import { useSession } from 'next-auth/react'
import React from 'react'
import { useRouter } from 'next/navigation'
const Home = () => {
  const {status} = useSession()
  const router = useRouter()
  if(status === 'loading') return <div>Loading...</div>
  if(status === 'unauthenticated') return router.push('/sign-in')
    
  return (
    <div className=' w-full pt-10 px-12 '>
      
      <UserSetting/>
    </div>
  )
}

export default Home
