import React, { useEffect, useState } from 'react'
import { useProfiledata } from '../hooks/useProfiledata'
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Layout from '../Layout'
import Updatecomp from '../components/Updatecomp';

export default function Profile() {

  const { data } = useProfiledata()

  const admin = true
  const [UpdateState, setUpdateState] = useState(false)
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.get("user")){
      window.location.href = `${import.meta.env.VITE_CLIENTLOCAL}/profile?user=${data.username}`
    }
    

  } , [data.username])
  

  return (
    <Layout>

      {!UpdateState ? <div className='flex flex-col bg-white h-screen max-w-[1800px] overflow-y-auto p-[20px]'>

        <div className='w-full  relative h-[300px]'>

          <div className='w-full h-[200px]'>
            <img src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/bg/${data.bg}`} alt="" className='object-cover h-full w-full rounded-lg' />

          </div>
          <div className='w-max  h-max  absolute top-[30%]'>
            <img className='w-[200px] h-[200px] object-cover rounded-full' src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${data.dp}`} alt="" />
          </div>

          <button onClick={() => setUpdateState(true)} className='absolute cursor-pointer hover:bg-green-600 right-[10px] bottom-[7rem] px-[30px] rounded-lg text-white bg-green-500'>Edit</button>
        </div>

        <div className='flex w-full mt-[20px] px-[20px] flex-col h-[20%]'>


          <div className='flex  items-center justify-between w-full'>

            <div className='flex flex-col gap-[20px]'>
              {data.username && <p>{data.username}</p>}
              {data.name && <p>{data.name}</p>}
              {data.bio && <p>{data.bio}</p>}
              { data.role && <p>{data.role}</p>}
              {data.socialmidealinks?.length > 0 ? 
              
              data.socialmedialinks.map((link , index) => <a href={link} key={index}>{link}</a>)
              
              : null}
              {data.location && <p className='flex items-center gap-[10px]'><LocationOnOutlinedIcon />{data.location}</p>}
              {data.joinedon && <p className='flex items-center gap-[20px]'><DateRangeOutlinedIcon />{data.joinedon}</p>}
            </div>
            <div className='flex flex-col gap-[20px]'>
              <div className='flex items-center gap-[20px]'>
                {data && <p className='text-center'>{data.followers} <br /> <span>Followers</span> </p>}
                {data && <p className='text-center'>{data.following} <br /> <span>Following</span></p>}

              </div>
              {!admin && <button className='bg-green-500 rounded-lg  p-[7px]'>Follow</button>}
            </div>



          </div>



        </div>



      </div> :

     <Updatecomp data={data} setUpdateState={setUpdateState}/>
    }

        </Layout>

  )
}
