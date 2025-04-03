import React from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';


export default function SelectedImageModal({setSelectedPost,  selectedImage }) {



  
  return (

    <div className='w-[700px] p-[10px] gap-[20px] flex items-center justify-center rounded-lg h-[500px] bg-black'>

      <div className='w-[50%] h-full'>

        <img  src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/post/${selectedImage.filename}`} className="w-full h-[90%] object-cover" alt="" />
        <div className='flex mt-[20px] text-white items-center gap-[20px]'>
         {  <button className='flex cursor-pointer items-center gap-[3px]'><FavoriteBorderIcon sx={{ fontSize: 16 }} />{selectedImage.hidelikecount !== 1 ?  selectedImage.likes : <></>}</button>}
          <button className='flex cursor-pointer items-center gap-[3px]'><ShareIcon sx={{ fontSize: 16 }} />{selectedImage.shares}</button>
         {selectedImage.allowcomments ?  <button className='flex cursor-pointer items-center gap-[3px]'><CommentOutlinedIcon sx={{ fontSize: 16 }} />440</button> : <></>}
          <button><SendOutlinedIcon sx={{ fontSize: 16 }} /></button>
        </div>
      </div>

      <div className='flex flex-col  text-white w-[50%] h-full gap-[20px]'>

        <div className='w-full flex border-b border-[#FF6500] items-center h-[30px] justify-between'>
          <button className='cursor-pointer'><MoreVertOutlinedIcon sx={{ fontSize: 16 }} /></button>
          <button className='cursor-pointer' onClick={() => setSelectedPost({})}><CloseOutlinedIcon sx={{ fontSize: 16 }} /></button>
        </div>
        <div className='h-[calc(100%-20px)]  overflow-y-auto flex flex-col gap-[20px]'>

        {selectedImage.description.trim() !== "" ?   <p className=''>{selectedImage.description.slice(0, 200)} <span className='text-[#FF6500]' onClick={() => {}}>more</span> </p> : <></>}

         {selectedImage.hidecomments ?  <div className='flex text-[12px]  text-gray-300 flex-col gap-[20px]'>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
            <p>Comment 1</p>
          </div> : <></>}

        </div>


      </div>

    </div>

  )
}
