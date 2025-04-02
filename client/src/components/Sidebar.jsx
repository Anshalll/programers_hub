import React, { useEffect, useState } from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { NavLink } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import PanoramaIcon from '@mui/icons-material/Panorama';

import { useProfiledata } from '../hooks/useProfiledata'
export default function Sidebar() {

  const { data } = useProfiledata()
  const [Username, setUsername] = useState("")
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setUsername(data.username)
    }
  }, [data, Username])

  return (
    <aside className='flex items-center bg-black  p-[20px] h-[100vh]'>
      <div className='h-[80%] flex flex-col gap-[20px]'>

        <NavLink to={"/"}
          className={({ isActive }) =>
            `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
          }
        >
          <HomeOutlinedIcon sx={{ fontSize: 22 }} /> Home
        </NavLink>

        <NavLink to={"/messages"}
          className={({ isActive }) =>
            `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
          }
        >
          <EmailOutlinedIcon sx={{ fontSize: 22 }} /> Messages
        </NavLink>
        <NavLink to={`/profile?user=${Username}`} className={({ isActive }) =>
          `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
        }><Person2OutlinedIcon sx={{ fontSize: 22 }} />Profile</NavLink>

        <NavLink to={"/communities"} className={({ isActive }) =>
          `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
        }><ForumOutlinedIcon sx={{ fontSize: 22 }} />Community</NavLink>



        <NavLink to={"/createpost"} className={({ isActive }) =>
          `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
        }><PanoramaIcon sx={{ fontSize: 22 }} />Post</NavLink>

      </div>


    </aside>
  )
}
