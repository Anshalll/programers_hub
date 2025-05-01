import React from 'react'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';

export default function ChatHeader({ username, isOnline, profilePic }) {
    return (
        <div className='h-[80px]  px-[20px] flex items-center justify-between darkcomp'>
            <div className='flex  items-center gap-[10px]'>
                <img className='h-[40px] w-[40px] flex rounded-full object-cover' src={profilePic} alt="" />
                <div className='flex flex-col gap-[5px]'>

                    <p className='text-white'>{username}</p>
                    <p className='text-white'>{isOnline ? <span className='text-[chartreuse]'>Online</span> : <span className='text-[crimson]'>Offline</span>}</p>
                </div>


            </div>

            <div className='flex items-center text-white gap-[20px]'>
                <button className='hover:text-cyan-300'><VideocamOutlinedIcon /></button>
                <button className='hover:text-cyan-300'><CallOutlinedIcon /></button>

            </div>
        </div>

    )
}
