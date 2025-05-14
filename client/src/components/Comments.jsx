import { useSendDataMutation } from '../redux/apis/slice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast';
import { useState } from 'react';
import {usePostSliceData} from '../hooks/usePostSliceData'
export default function Comments({  postid , styling}) {

  const [Datasend] = useSendDataMutation()
  const dispatch = useDispatch()
  const [Comment_text, setComment_text] = useState("")
  const {comments} = usePostSliceData()
  


  const ErrorAction = () => toast.error('An error occured!', {
    duration: 2000,
    position: 'top-center'
  });



  const HandlePostComment = async () => {
    const response = await Datasend({ url: "/comments", method: "POST", data: { comment: Comment_text, postid: postid } })

    if (response.error) {
      ErrorAction()
    }
    if (response.data) {


      setComment_text("")
    }

  }

  return (

    <div className={styling}>
      {comments.length > 0 ? comments.map(( value, index) => (
        <p className='text-white' key={index}>{value.message}</p>
      )) : <></>}
    </div>
  )
}
