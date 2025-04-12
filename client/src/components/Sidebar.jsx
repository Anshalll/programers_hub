import React, { useEffect, useState } from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { NavLink } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import PanoramaIcon from '@mui/icons-material/Panorama';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { useProfiledata } from '../hooks/useProfiledata'
import SearchComponent from './SearchComponent';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';


export default function Sidebar() {

  const [isSearchedOpen , setisSearchedOpen] = useState(false)
  const { data } = useProfiledata()
  const [Username, setUsername] = useState("")
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setUsername(data.username)
    }
  }, [data, Username])

  return (
    <aside className='flex items-center bg-black  p-[10px] h-[100vh]'>
    {!isSearchedOpen &&   <div className='h-[80%] flex flex-col gap-[20px]'>
        <p className='text-white'>Social media</p>
        <NavLink to={"/"}
          className={({ isActive }) =>
            `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
          }
        >
          <HomeOutlinedIcon sx={{ fontSize: 22 }} /> Home
        </NavLink>
        <button onClick={() => setisSearchedOpen(true)} className='text-white flex items-center gap-[20px]'><SearchOutlinedIcon />Search</button>
     
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

        <NavLink to={"/community"} className={({ isActive }) =>
          `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
        }><ForumOutlinedIcon sx={{ fontSize: 22 }} />Community</NavLink>

        <NavLink to={"/createpost"} className={({ isActive }) =>
          `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
        }><PanoramaIcon sx={{ fontSize: 22 }} />Post</NavLink>

      <NavLink to={"/rankings/community"} className={({ isActive }) =>
          `${isActive ? "text-[#FF6500]" : "text-white"} flex items-center gap-[20px]`
        }><EmojiEventsOutlinedIcon sx={{ fontSize: 22 }} />Rankings</NavLink>

      

      </div>}
      {isSearchedOpen ?   <SearchComponent  setIsOpenSearch={setisSearchedOpen}/> : <></>}

    </aside>
  )
}
