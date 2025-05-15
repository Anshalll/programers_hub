import { useSendDataMutation } from '../redux/apis/slice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast';
import { useState } from 'react';
import { usePostSliceData } from '../hooks/usePostSliceData'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import Inputcomment from './Inputcomment';
import { setComments } from '../redux/post/slice';
import Reply from './Reply';
import CommentUserCard from './CommentUserCard';
import CommentReplies from './CommentReplies';
import {useProfiledata} from '../hooks/useProfiledata'

export default function Comments({ postid, styling }) {

  const [Datasend] = useSendDataMutation()
  const dispatch = useDispatch()
  const [Comment_text, setComment_text] = useState("")
  const { comments, replies } = usePostSliceData()
  const [isOpenReply, setisOpenReply] = useState(false)
  const [ReplyUser, setReplyUser] = useState("")
  const [ReplyState, setReplyState] = useState({ isOpen: false, id: null, cid: null })
  const {data: userdata} = useProfiledata()

  const ErrorAction = () => toast.error('An error occured!', {
    duration: 2000,
    position: 'top-center'
  });


  const CommentDeleted = () => toast.success("Comment deleted!", {
    duration: 1500,
    position: 'top-center'
  });




  const HandleCommentDelete = async (commentid, userid) => {

    const response = await Datasend({ url: "/comments", method: "DELETE", data: { commentid, userid, postid: postid } })
    if (response.data) {

      dispatch(setComments(comments.filter((e) => e.uniqueid !== commentid)))
      CommentDeleted()
    }
    else {
      ErrorAction()
    }



  }



  const HandlePostComment = async () => {
    const response = await Datasend({ url: "/comments", method: "POST", data: { comment: Comment_text, postid: postid } })

    if (response.error) {
      ErrorAction()
    }
    if (response.data) {
      dispatch(setComments([response.data.comment[0], ...comments]))
      setComment_text("")
    }

  }

  const HandleReply = (username, cid) => {
    setReplyState({ isOpen: true, cid: cid, id: postid })
    setReplyUser(username)
  }

  const CloseReply = () => {
    setReplyState({ isOpen: false, cid: null, id: null })
    setReplyUser("")
  }


  
  const HandleCommentLike = async (id, action) => {

    const response = await Datasend({ url: "/likecomment", method: "POST", data: { id, action } })
    if (response.error) {
      ErrorAction()
    }
    if (response.data) {
      let coms = JSON.parse(JSON.stringify(comments))
      let findings = coms.find((e) => e.uniqueid === id)
      if (action === "like") {

        findings.likes = findings.likes + 1
        findings.likedby = userdata.id

      }
      if (action === "unlike") {
        findings.likes = findings.likes - 1
        findings.likedby = null
      }

      dispatch(setComments(coms))


    }

  }


  return (

    <div className={styling}>

      <div className='Scroller flex flex-col h-[85%]  gap-[20px] overflow-y-auto'>

        {comments.length > 0 ? comments.map((value, index) => (
          <div key={index}>

            <div className='flex flex-col gap-[10px] w-full'>
              <CommentUserCard type={"comment"} value={value} />
              <div className='flex px-[40px] w-full gap-[20px] items-center'>
                <button onClick={() => HandleCommentLike(value.uniqueid , value.likedby ? "unlike" : "like")} className='text-[11px] flex items-center gap-[3px]'><span>{value.likedby ? <FavoriteIcon sx={{ fontSize: 14 }} className='text-[crimson]' /> : <FavoriteBorderOutlinedIcon sx={{ fontSize: 14 }} />}</span>{value.likes}</button>

                {replies.length === 0 ? <p className='text-gray-200 text-[11px]'>No replies</p> : <button onClick={() => setisOpenReply(!isOpenReply)} className='text-gray-200 text-[11px]'><span>{isOpenReply ? <KeyboardArrowUpOutlinedIcon sx={{ fontSize: 16 }} /> : <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 16 }} />}</span>View replies {replies.filter((e) => e.cid === value.uniqueid).length}</button>}

                <button onClick={() => HandleReply(value.username, value.uniqueid)} className='text-gray-200 text-[11px]'>Reply</button>
              </div>
              {(replies.length > 0 && isOpenReply) ? <CommentReplies HandleReply={HandleReply} value={value} /> : <></>}

            </div>
          </div>

        )) : <></>}

      </div>
      <div className='w-full h-[15%] flex items-center justify-center'>

        {ReplyState.isOpen ? <Reply ReplyState={ReplyState} setReplyUsername={setReplyUser} CloseReply={CloseReply} setReplyState={setReplyState} ReplyUsername={ReplyUser} /> : <Inputcomment placeholder={"Comment something..."} ActionFunction={HandlePostComment} Text={Comment_text} setText={setComment_text} />}

      </div>

    </div>
  )
}
