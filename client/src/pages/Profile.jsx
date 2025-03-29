import React, { useState } from 'react'
import { useProfiledata } from '../hooks/useProfiledata'
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Layout from '../Layout'
import Updatecomp from '../components/Updatecomp';

export default function Profile() {

  const { data } = useProfiledata()

  const admin = true
  const [UpdateState, setUpdateState] = useState(false)
    const [Bg, setBg] = useState(`${import.meta.env.VITE_SERVERURL}/api/sendstatic/bg/${data.profile.bg}`)
    const [Dp, setDp] = useState(`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${data.profile.dp}`)
  

  return (
    <Layout>

      {!UpdateState ? <div className='flex flex-col bg-white h-screen max-w-[1800px] overflow-y-auto p-[20px]'>

        <div className='w-full  relative h-[300px]'>

          <div className='w-full h-[200px]'>
            <img src={Bg} alt="" className='object-cover h-full w-full rounded-lg' />

          </div>
          <div className='w-max  h-max  absolute top-[30%]'>
            <img className='w-[200px] h-[200px] object-cover rounded-full' src={Dp} alt="" />
          </div>

          <button onClick={() => setUpdateState(true)} className='absolute cursor-pointer hover:bg-green-600 right-[10px] bottom-[7rem] px-[30px] rounded-lg text-white bg-green-500'>Edit</button>
        </div>

        <div className='flex w-full mt-[20px] px-[20px] flex-col h-[20%]'>


          <div className='flex  items-center justify-between w-full'>

            <div className='flex flex-col gap-[20px]'>
              {data.udata.username && <p>{data.udata.username}</p>}
              {data.udata.name && <p>{data.udata.name}</p>}
              {data.profile && data.profile.bio && <p>{data.profile.bio}</p>}
              {data.profile && data.profile.role && <p>{data.profile.role}</p>}
              {data.profile.socialmidealinks?.length > 0 ? 
              
              data.profile.socialmedialinks.map((link , index) => <a href={link} key={index}>{link}</a>)
              
              : null}
              {data.profile.location && <p className='flex items-center gap-[10px]'><LocationOnOutlinedIcon />{data.profile.location}</p>}
              {data.profile.joinedon && <p className='flex items-center gap-[20px]'><DateRangeOutlinedIcon />{data.profile.joinedon}</p>}
            </div>
            <div className='flex flex-col gap-[20px]'>
              <div className='flex items-center gap-[20px]'>
                {data.profile && <p className='text-center'>{data.profile.followers} <br /> <span>Followers</span> </p>}
                {data.profile && <p className='text-center'>{data.profile.following} <br /> <span>Following</span></p>}

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
