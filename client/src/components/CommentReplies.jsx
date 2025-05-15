import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { usePostSliceData } from '../hooks/usePostSliceData'
import CommentUserCard from './CommentUserCard';


export default function CommentReplies({  value , HandleReply}) {


  const { replies } = usePostSliceData()

  return (

    <>


      <div className=' w-full flex flex-col px-[40px] gap-[20px]'>
        {replies.map((replyval, index) => (
          replyval.cid === value.uniqueid && <div key={index} className='w-full  border-l-2'>
            <div className='w-full h-full flex-col flex gap-[10px]  px-[20px]'>

              <CommentUserCard type={"reply"} value={replyval} />
              <div className='flex w-full items-center px-[40px] gap-[10px]'>

                <p className='text-[11px]  flex items-center gap-[3px]'><span>{replyval.likedby ? <FavoriteIcon sx={{ fontSize: 14 }} className='text-[crimson]' /> : <FavoriteBorderOutlinedIcon sx={{ fontSize: 14 }} />}</span>{replyval.likes}</p>


                <button onClick={() => HandleReply(value.username, value.uniqueid)} className='text-gray-200 text-[11px]'>Reply</button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </>
  )
}
