import React, { useEffect } from 'react'
import { useProfiledata } from '../hooks/useProfiledata'
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
export default function Profile() {

  const { data } = useProfiledata()

  const admin = true


  return (
    <div className='flex flex-col bg-white h-screen max-w-[1800px] overflow-y-auto p-[20px]'>

      <div className='w-full  relative h-[400px]'>

      <div className='w-full h-[300px]'>
        <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29kaW5nJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D" alt="" className='object-cover h-full w-full rounded-lg' />
      </div>
      <div className='w-max  h-max  absolute bottom-[10px]'>
          <img className='w-[300px] h-[300px] object-cover rounded-full' src="https://miro.medium.com/v2/resize:fit:1400/1*RRCdaxwb-ZB3GWCK8nz-bg.png" alt="" />
      </div>
      </div>

      <div className='flex w-full px-[20px] flex-col h-[40%]'>


        <div className='flex mt-[40px] items-center justify-between w-full'>

          <div className='flex flex-col gap-[20px]'>
            {data.udata.username && <p>{data.udata.username}</p>}
            {data.udata.name && <p>{data.udata.name}</p>}
            {data.profile && data.profile.bio && <p>{data.profile.bio}</p>}
            {data.profile && data.profile.role && <p>{data.profile.role}</p>}
            {data.profile && JSON.parse(data.profile.socialmedialinks).length > 0 ? <p>{data.profile.socialmedialinks}</p> : <></>}
            {data.profile.location && <p className='flex items-center gap-[20px]'><LocationOnOutlinedIcon/>{data.profile.location}</p>}
            {data.profile.joinedon && <p className='flex items-center gap-[20px]'><DateRangeOutlinedIcon/>{data.profile.joinedon}</p>}
          </div>
          <div className='flex flex-col gap-[20px]'>
          <div className='flex items-center gap-[20px]'>
            {data.profile && <p className='text-center'>{data.profile.followers} <br /> <span>Followers</span> </p>}
            {data.profile && <p className='text-center'>{data.profile.following} <br /> <span>Following</span></p>}
          
          </div>
          {admin? <button className='bg-green-500 rounded-lg  p-[7px]'>Edit</button> : <button className='bg-green-500 rounded-lg  p-[7px]'>Follow</button> }
          </div>
        


        </div>

  

      </div>



    </div>
  )
}
