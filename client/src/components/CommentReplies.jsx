import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { usePostSliceData } from '../hooks/usePostSliceData'
import CommentUserCard from './CommentUserCard';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useSendDataMutation } from '../redux/apis/slice'
import {useProfiledata} from '../hooks/useProfiledata'
import { setReplies } from '../redux/post/slice';

export default function CommentReplies({isAdmin ,  value, HandleReply }) {


  const ErrorAction = () => toast.error('An error occured!', {
    duration: 2000,
    position: 'top-center'
  });

  const [Datasend] = useSendDataMutation()
  const { replies } = usePostSliceData()
  const dispatch = useDispatch()
  const {data: userdata} = useProfiledata()
  
  const HandleReplyLike = async (replyid, action) => {

    const response = await Datasend({ url: "/likereply", method: "POST", data: { replyid, action } })


    if (response.error) {
      ErrorAction()
    }
    if (response.data) {

      const prdata = JSON.parse(JSON.stringify(replies))
      let findings = prdata.find((e) => e.uniqueid === replyid)
      if (action === "like") {
        findings.likes += 1
        findings.hasliked = userdata.id

      }


      if (action === "unlike") {
        findings.likes -= 1
        findings.hasliked = null

      }

      dispatch(setReplies(prdata))


    }

  }

  return (

    <>


      <div className=' w-full flex flex-col px-[40px] gap-[20px]'>
        {replies.map((replyval, index) => (
          replyval.cid === value.uniqueid && <div key={index} className='w-full  border-l-2'>
            <div className='w-full h-full flex-col flex gap-[10px]  px-[20px]'>
         
              <CommentUserCard isAdmin={isAdmin} type={"reply"} value={replyval} index={index} />
              <div className='flex w-full items-center px-[40px] gap-[10px]'>

                <button onClick={() => HandleReplyLike(replyval.uniqueid , replyval.hasliked ? "unlike" : "like")} className='text-[11px]  flex items-center gap-[3px]'><span>{replyval.hasliked ? <FavoriteIcon sx={{ fontSize: 14 }} className='text-[crimson]' /> : <FavoriteBorderOutlinedIcon sx={{ fontSize: 14 }} />}</span>{replyval.likes}</button>


                <button onClick={() => HandleReply(value.username, value.uniqueid)} className='text-gray-200 text-[11px]'>Reply</button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </>
  )
}
