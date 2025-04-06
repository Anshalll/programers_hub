import React, { useEffect } from 'react'
import {useFetchDataQuery} from '../redux/apis/slice'
import toast, { Toaster } from 'react-hot-toast';

export default function Comments({  SelectedImage , setComments , Comments }){
  const {isLoading, error , data} = useFetchDataQuery(`/getcomments/${SelectedImage.uniqueid}/`)
 

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
  } , [SelectedImage , isLoading , data , error , setComments])

  return (
    <div className='flex text-white flex-col gap-[10px] w-full overflow-y-auto h-full'>
      {Comments.map((value , index) =>{

       return <p key={index}>{value.message}</p>
      })}
      <Toaster/>

    </div>
  )
}
