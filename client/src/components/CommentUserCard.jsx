import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
export default function CommentUserCard({type,   value }) {
  return (
    <div className='flex gap-[10px] w-full '>
                <img className='w-[30px] h-[30px] rounded-full object-cover' src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${value.dp}`} alt="" />
                <div className='bg-black flex flex-col gap-[10px] w-full rounded-lg shadow-white/20 p-[10px] shadow-sm'>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-[10px]'>

                  {type === "reply" &&   <p className='text-white replyuser'>{value.mentioneduser}</p>}
                    <p className='font-bold text-cyan-500'>{value.username}</p>
                    </div>
                    <div className='flex items-center gap-[3px]'>
                      <span className='text-[10px]'>{value.postedon}</span>
                      <button className=''><MoreVertIcon className='text-cyan-500' sx={{ fontSize: 16 }} /></button>
                    </div>
                  </div>
                  <p className='text-gray-200'>{value.message}</p>

                </div>

              </div>
  )
}
