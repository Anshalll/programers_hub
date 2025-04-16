import React, { useState } from 'react'
import Inputcomment from './Inputcomment'
import CloseIcon from '@mui/icons-material/Close';
import { useSendDataMutation } from '../redux/apis/slice'
import toast from 'react-hot-toast';
import { setpostreplies } from '../redux/userdata/slice';
import { useProfiledata } from '../hooks/useProfiledata'
import { useDispatch } from 'react-redux';
export default function Reply({ setReplyState, ReplyUsername, CloseReply, ReplyState, setReplyUsername }) {

  const [ReplyMessage, setReplyMessage] = useState("")
  const [DataSend] = useSendDataMutation()
  const { replies } = useProfiledata()
  const dipatch = useDispatch()


  const errorToast = () => toast.error("An error occured!", {

    duration: 1500,
    position: "top-center"
  }

  )

  const HandleReply = async () => {
    if (ReplyMessage.trim() !== "") {

      const response = await DataSend({ url: "reply", method: "POST", data: { mentioneduser: ReplyUsername, cid: ReplyState.cid, pid: ReplyState.id, message: ReplyMessage } })


      if (response.data) {
        const replydata = JSON.parse(JSON.stringify(replies))
        setReplyMessage("")
        setReplyState({ isOpen: false, id: null })
        setReplyUsername("")
        dipatch(setpostreplies([...replydata , response.data.replies[0]]))
      }

      if (response.error) {
        errorToast()

      }

    }


  }

  return (
    <div className='flex w-full flex-col gap-[10px]'>
      <div className='flex w-full bg-gray-900 rounded-lg items-center justify-between'>
        <p className='text-[12px]'>@{ReplyUsername}</p>
        <button onClick={() => CloseReply()}><CloseIcon sx={{ fontSize: 13 }} /></button>
      </div>
      <Inputcomment placeholder={`Reply to ${ReplyUsername}`} ActionFunction={HandleReply} Text={ReplyMessage} setText={setReplyMessage} />

    </div>

  )
}
