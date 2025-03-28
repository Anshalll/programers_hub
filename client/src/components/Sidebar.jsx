import React from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { NavLink } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';


export default function Sidebar() {
  return (
    <aside className='flex items-center bg-black  p-[20px] h-[100vh]'>
      <div className='h-[80%] flex flex-col gap-[20px]'>

        <NavLink  to={"/"}
          className={({ isActive }) =>
            `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
          }
        >
          <HomeOutlinedIcon  sx={{ fontSize: 22 }}/> Home
        </NavLink>

        <NavLink to={"/messages"}
          className={({ isActive }) =>
            `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
          }
        >
          <EmailOutlinedIcon  sx={{ fontSize: 22 }}/> Messages
        </NavLink>
        <NavLink to={"/profile"} className={({ isActive }) =>
          `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
        }><Person2OutlinedIcon sx={{ fontSize: 22 }}/>Profile</NavLink>

        <NavLink to={"/communities"} className={({ isActive }) =>
          `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
        }><ForumOutlinedIcon sx={{ fontSize: 22 }}/>Community</NavLink>


      </div>


    </aside>
  )
}
