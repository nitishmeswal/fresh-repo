

import React from 'react'
import { dashboardDta } from '@/constants/values'
import MapSkel from './map-skeleton'
const MapData = () => {
  return (
    <ul className=''>
      {
        dashboardDta.map((item, index) => (
          <li key={index} className='flex flex-col justify-start items-start bg-transparent z-10 py-4'>
            <MapSkel label={item.name!} value={item.value} />
          </li>
        ))
      }
    </ul>
  )
}

export default MapData
