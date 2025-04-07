import React, { useEffect } from 'react'
import { useFetchDataQuery , useSendDataMutation} from '../redux/apis/slice'
import toast, { Toaster } from 'react-hot-toast';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useProfiledata} from '../hooks/useProfiledata'
import { pink } from '@mui/material/colors';
import Loading from '../components/Loading'
import FavoriteIcon from '@mui/icons-material/Favorite';
import {setpostcomments} from '../redux/userdata/slice'
import { useDispatch } from 'react-redux';
export default function Comments({ SelectedImage }) {

  
  const { isLoading, error, data , refetch } = useFetchDataQuery(`/getcomments/${SelectedImage.uniqueid}/`)
  const [Send_data] = useSendDataMutation()
  const {data : userdata , comments: Comments} = useProfiledata()
  const dispatch = useDispatch()

  const ErrorFetchingComments = () => toast.error("An error occured!", {
    duration: 1500,
    position: 'top-center'
  });


  const ErrorWhileLiking = () => toast.error("An error occured!", {
    duration: 1500,
    position: 'top-center'
  });


  useEffect(() => {
    if (SelectedImage.allowcomments === 1) {
      if (error) {
        ErrorFetchingComments()
      }

      if (!isLoading) {
       refetch()
       dispatch(setpostcomments(data.comments))
      }

    }
  }, [SelectedImage, isLoading, data, error , dispatch , refetch])

  const HandleCommentLike = async (type , id , action) =>{

      const response = await Send_data({ url: "/likecomment" , method: "POST" , data: {type, id , action} })
      if (response.error) {
        ErrorWhileLiking()
      }
      if(response.data){
        let coms = JSON.parse(JSON.stringify(Comments))
        let findings = coms.find((e) => e.uniqueid === id)
        if(action === "like"){

          findings.likes = findings.likes + 1
          findings.likedby = userdata.id
          
        }
        if(action === "unlike"){
          findings.likes  = findings.likes - 1
          findings.likedby = null
        }
        
        dispatch(setpostcomments(coms))
       
      
      }

  }

  return (
    <div className='Scroller flex text-white flex-col gap-[10px] w-full overflow-y-auto h-full'>
      {Comments.length > 0 ?  (isLoading ? <div className='w-full flex items-center justify-center'>
        <Loading/>
      </div> :  Comments.map((value, index) => (

        <div key={index} className='flex  w-full'>
          <div className='flex gap-[20px] w-full'>
            <img className='w-[25px] h-[25px]  object-cover rounded-full' src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${value.dp}`} alt="" />
            <div className='flex flex-col gap-[3px] w-full'>
              <a className='text-[9px] text-gray-300' href="">{value.username}</a>
              <p className='text-[10px]'>{value.message}</p>
              <div className='w-full flex items-center gap-[10px]'>
                <button  className='text-[9px] text-gray-300 font-light'>Reply</button>
                <p className='text-[9px] text-[#FF6500] font-light'>{value.postedon}</p>
              </div>
            </div>
            <div className='flex flex-col items-center gap-[3px]'>
              <button className='text-[#FF6500]'><MoreVertIcon sx={{ fontSize: 11 }}/></button>
            {value.likedby !== userdata.id ?   <button onClick={() => HandleCommentLike("comment" , value.uniqueid ,"like")}><FavoriteBorderOutlinedIcon sx={{ fontSize: 11 }} /></button> : <button onClick={() => HandleCommentLike("comment" , value.uniqueid , "unlike")}><FavoriteIcon sx={{ fontSize: 11 , color: pink[500] }} /></button>}
              {value.likes > 0 && <p className='text-white text-[9px]'>{value.likes}</p>}


            </div>

          </div>
        </div>)
      )) : (<div className='w-full flex h-full items-center justify-center'>
         <h1 className='font-bold text-lg'>No comments</h1>
      </div>) }

      <Toaster />

    </div>
  )
}
