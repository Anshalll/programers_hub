import { useSendDataMutation } from '../redux/apis/slice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast';
import { useState } from 'react';
import { usePostSliceData } from '../hooks/usePostSliceData'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import Inputcomment from './Inputcomment';
import { setComments } from '../redux/post/slice';
export default function Comments({ postid, styling }) {

  const [Datasend] = useSendDataMutation()
  const dispatch = useDispatch()
  const [Comment_text, setComment_text] = useState("")
  const { comments , replies} = usePostSliceData()
  const [isOpenReply, setisOpenReply] = useState(false)


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
      dispatch(setComments([ response.data.comment[0] , ...comments  ]))
      setComment_text("")
    }

  }

  return (

    <div className={styling}>
      
      <div className='Scroller flex flex-col h-[85%]  gap-[20px] overflow-y-auto'>

        {comments.length > 0 ? comments.map((value, index) => (
          <div key={index}>

            <div className='flex flex-col gap-[10px] w-full'>
              <div className='flex gap-[10px] w-full '>
                <img className='w-[30px] h-[30px] rounded-full object-cover' src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${value.dp}`} alt="" />
                <div className='bg-black flex flex-col gap-[10px] w-full rounded-lg shadow-white/20 p-[10px] shadow-sm'>
                  <div className='flex items-center justify-between w-full'>

                    <p className='font-bold text-cyan-500'>{value.username}</p>
                    <div className='flex items-center gap-[3px]'>
                      <span className='text-[12px]'>{value.postedon}</span>
                      <button className=''><MoreVertIcon className='text-cyan-500' sx={{ fontSize: 16 }} /></button>
                    </div>
                  </div>
                  <p className='text-gray-200'>{value.message}</p>

                </div>

              </div>
              <div className='flex px-[40px] w-full gap-[20px] items-center'>
                <p className='text-[11px] flex items-center gap-[3px]'><span>{value.likedby  ? <FavoriteIcon sx={{ fontSize: 14 }} className='text-[crimson]' /> : <FavoriteBorderOutlinedIcon sx={{ fontSize: 14 }} />}</span>{value.likes}</p>

              { replies.length === 0 ? <p className='text-gray-200 text-[11px]'>No replies</p> :  <button onClick={() => setisOpenReply(!isOpenReply)} className='text-gray-200 text-[11px]'><span>{isOpenReply ? <KeyboardArrowUpOutlinedIcon sx={{ fontSize: 16 }} /> : <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 16 }} />}</span>View replies</button>}

                <button className='text-gray-200 text-[11px]'>Reply</button>
              </div>

            </div>
          </div>

        )) : <></>}

      </div>
      <div className='w-full h-[15%] flex items-center justify-center'>

      <Inputcomment placeholder={"Comment something..."} ActionFunction={HandlePostComment} Text={Comment_text} setText={setComment_text} />
      </div>

    </div>
  )
}
