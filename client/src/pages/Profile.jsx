import React, { useEffect } from 'react'
import { useProfiledata } from '../hooks/useProfiledata'


export default function Profile() {

  const {data} = useProfiledata()
  useEffect(() => {
    if (data) {
        console.log(data)
    }
  } , [data])
  return (
    <div className='flex flex-col bg-white h-screen max-w-[1800px] overflow-y-auto p-[20px]'>


    <div className='flex w-full  relative h-[40%]'>

      <div className='w-full rounded-lg h-full'>
      <img src="https://mngauto.lv/wp-content/uploads/2024/09/WhatsApp-Image-2024-09-12-at-10.51.20-scaled.jpeg" alt="" className='w-full h-full object-cover ' />

      </div>  

      <div className='absolute left-[20px] w-[250px] h-[250px] top-[60%]  bg-white rounded-full'>
        <img src="https://i.redd.it/qpp6w2w17uvb1.jpg" alt="" className='w-full rounded-full h-full object-cover ' />

        <div className='flex flex-col gap-[20px]'>
          <p>{data.udata.username}</p>
          <p>{data.udata.name}</p>
        </div>
      </div>


    </div>

          
    </div>  
  )
}
