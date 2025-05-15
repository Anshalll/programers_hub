import React, { useState } from 'react'
import { useSendDataMutation } from '../redux/apis/slice'
import { usePostSliceData } from '../hooks/usePostSliceData';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useProfiledata } from '../hooks/useProfiledata';
import { useDispatch } from 'react-redux';
import { setComments, setReplies } from '../redux/post/slice';
import toast from 'react-hot-toast';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


export default function CommentUserCard({ isAdmin, type, value, index }) {

  const { data: userdata } = useProfiledata()
  const [isOpenCommentop, setisOpenCommentop] = useState({ isOpen: false, id: null })
  const dispatch = useDispatch()
  const [Datasend] = useSendDataMutation()
  const {comments , replies} = usePostSliceData()

    const ErrorAction = () => toast.error('An error occured!', {
    duration: 2000,
    position: 'top-center'
  });


  const HandleCommOpts = (id) => {


    setisOpenCommentop({ isOpen: true, id })
  }

   const DeletedReply = () => toast.success("Reply deleted!", {
    duration: 1500,
    position: 'top-center'
  });



  const PinComment = async (commentid, action, postid) => {
    const response = await Datasend({ url: "/pincomment", method: "POST", data: { commentid, action, postid } })
    if (response.data) {

      let coms = JSON.parse(JSON.stringify(comments))
      let findings = coms.find((e) => e.uniqueid === commentid)
      if (action === "pin") {
        findings.pinned = true
      }
      if (action === "unpin") {
        findings.pinned = false
      }
      dispatch(setComments(coms))
      setisOpenCommentop({ isOpen: false, id: null })
    }
    else {
      ErrorAction()
    }
  }

  const CommentDeleted = () => toast.success("Comment deleted!", {
    duration: 1500,
    position: 'top-center'
  });


  const HandleCommentDelete = async (commentid, userid) => {

    const response = await Datasend({ url: "/comments", method: "DELETE", data: { commentid, userid, postid: value.belongsto } })

    if (response.data) {

      dispatch(setComments(comments.filter((e) => e.uniqueid !== commentid)))
      CommentDeleted()
    }
    else {
      ErrorAction()
    }



  }


  
  const HandleReplyDelete = async (replyid , replypid) => {
    const response  = await Datasend({ url: "/deletereply" , method: "DELETE" , data: {replyid , replypid} })
    if (response.data) {
        const reply_data = JSON.parse(JSON.stringify(replies))
        const  filter_reply = reply_data.filter((e) => e.uniqueid !== replyid)
        dispatch(setReplies(filter_reply))
        DeletedReply()

      }
    if (response.error) {
        ErrorAction()

    }

  }



  return (
    <div className='flex gap-[10px] w-full '>
      <img className='w-[30px] h-[30px] rounded-full object-cover' src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${value.dp}`} alt="" />
      <div className='bg-black flex flex-col gap-[10px] w-full rounded-lg shadow-white/20 p-[10px] shadow-sm'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-[10px]'>
            {type === "reply" && <p className='text-white replyuser'>{value.mentioneduser}</p>}
            <p className='font-bold text-cyan-500'>{value.username}</p>
            {type === "comment" &&  value.pinned == 1 && <i className='text-[11px] text-gray-300'>Pinned</i>}
          </div>
          <div className='flex items-center gap-[3px] relative'>


            <span className='text-[10px]'>{value.postedon}</span>
            {type === "comment" && (isAdmin || value.uid === userdata.id) ? <button onClick={() => HandleCommOpts(value.uniqueid)} className=''><MoreVertIcon className='text-cyan-500' sx={{ fontSize: 16 }} /></button> : <></>}


            {type === "reply" && (isAdmin || value.whoReplied === userdata.username) ? <button onClick={() => HandleCommOpts(value.uniqueid)} className=''><MoreVertIcon className='text-cyan-500' sx={{ fontSize: 16 }} /></button> : <></>}

            {isOpenCommentop.isOpen && value.uniqueid === isOpenCommentop.id ? (
              <div className='absolute w-[60px] flex flex-col gap-[10px] p-[7px] bg-gray-800 rounded-md right-[20px] text-[9px] text-white'>
                {(isAdmin && type === "comment") && (
                  value.pinned == 0 ? <button onClick={() => PinComment(value.uniqueid, "pin", type === "reply" ? value.pid : value.belongsto)} className='flex items-center gap-[3px]'>
                    <PushPinIcon sx={{ fontSize: 10 }} /> Pin
                  </button> : <button onClick={() => PinComment(value.uniqueid, "unpin", type === "reply" ? value.pid : value.belongsto )} className='flex items-center gap-[3px]'>
                    <PushPinIcon sx={{ fontSize: 10 }} /> Unpin
                  </button>

                )}
                {type === "comment" && (isAdmin || value.uid === userdata.id) && (
                  <button onClick={() => HandleCommentDelete(value.uniqueid, userdata.id)} className='flex text-[crimson] items-center gap-[3px]'>
                    <DeleteOutlineIcon sx={{ fontSize: 10 }} /> Delete
                  </button>
                )}

                      {type === "reply" && (isAdmin || value.whoReplied === userdata.username) && (
                  <button onClick={() => HandleReplyDelete(value.uniqueid, value.pid)} className='flex text-[crimson] items-center gap-[3px]'>
                    <DeleteOutlineIcon sx={{ fontSize: 10 }} /> Delete
                  </button>
                )}

              </div>
            ) : null}


          </div>
        </div>
        <p className='text-gray-200'>{value.message}</p>

      </div>

    </div>
  )
}
