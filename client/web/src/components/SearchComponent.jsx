import React from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import UserSearch from '../components/UserSearchbar'
export default function SearchComponent({ setIsOpenSearch }) {



    return (
        <div className='flex flex-col gap-[20px] w-full h-[80%]'>
            <div className='flex flex-col gap-[20px] w-full h-full'>

                <div className='flex h-[30px]  items-cnter w-full gap-[10px] '>

                    <button onClick={() => setIsOpenSearch(false)} className='w-[30px] rounded-full hover:text-[#FF6500] hover:border-2 hover:border-[#FF6500] items-center justify-center  text-white flex h-full bg-gray-900 '>
                        <ArrowBackIosNewOutlinedIcon sx={{ fontSize: 12 }} />
                    </button>
                    <p className='text-white flex items-center justify-center'>Social media</p>
                </div>

                <div className=' h-[30px] w-full'>

                    <UserSearch />
                </div>
            </div>

            <div className='flex flex-col gap-[20px]'>

            </div>


        </div>
    )
}
