import React, { useEffect } from 'react'
import { useFetchDataQuery } from '../redux/apis/slice'
import toast, { Toaster } from 'react-hot-toast';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Comments({ SelectedImage, setComments, Comments }) {
  const { isLoading, error, data } = useFetchDataQuery(`/getcomments/${SelectedImage.uniqueid}/`)


  const ErrorFetchingComments = () => toast.error("An error occured!", {
    duration: 1500,
    position: 'top-center'
  });

  useEffect(() => {
    if (SelectedImage.allowcomments === 1) {
      if (error) {
        ErrorFetchingComments()
      }

      if (!isLoading) {
        setComments(data.comments)
      }

    }
  }, [SelectedImage, isLoading, data, error, setComments])

  return (
    <div className='Scroller flex text-white flex-col gap-[10px] w-full overflow-y-auto h-full'>
      {Comments.map((value, index) => (

        <div key={index} className='flex  w-full'>
          <div className='flex gap-[20px] w-full'>
            <img className='w-[25px] h-[25px]  object-cover rounded-full' src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${value.dp}`} alt="" />
            <div className='flex flex-col gap-[3px] w-full'>
              <a className='text-[9px] text-gray-300' href="">{value.username}</a>
              <p className='text-[10px]'>{value.message}</p>
              <div className='w-full flex items-center gap-[10px]'>
                <button className='text-[9px] text-gray-300 font-light'>Reply</button>
                <p className='text-[9px] text-[#FF6500] font-light'>{value.postedon}</p>
              </div>
            </div>
            <div className='flex flex-col items-center gap-[3px]'>
              <button className=''><MoreVertIcon sx={{ fontSize: 11 }}/></button>
              <button><FavoriteBorderOutlinedIcon sx={{ fontSize: 11 }} /></button>
              {value.like > 0 && <p className='text-white text-[11px]'>{value.likes}</p>}



            </div>

          </div>
        </div>
      ))}
      <Toaster />

    </div>
  )
}
