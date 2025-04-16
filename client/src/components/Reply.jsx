import React, { useState } from 'react'
import Inputcomment from './Inputcomment'
import CloseIcon from '@mui/icons-material/Close';
import { useSendDataMutation } from '../redux/apis/slice'
import toast from 'react-hot-toast';

export default function Reply({ ReplyUsername, CloseReply, ReplyState }) {

  const [ReplyMessage, setReplyMessage] = useState("")
  const [DataSend] = useSendDataMutation()
  const errorToast = toast.error("An error occured!", {

    duration: 1500,
    position: "top-center"
  }

  )

  const HandleReply = async () => {
    if (ReplyMessage.trim() !== "") {

      const response = await DataSend({ url: "reply", method: "POST", data: { mentioneduser: ReplyUsername, cid: ReplyState.cid, pid: ReplyState.id, message: ReplyMessage } })


      if (response.data) {
        
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
