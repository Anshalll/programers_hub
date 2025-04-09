import React, { useState } from 'react'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';
import CloseIcon from '@mui/icons-material/Close';


export default function Inputcomment({ HandlePostComment, Text, setText, placeholder }) {


    const [isEmoji, setisEmoji] = useState(false)

    const HandleEmoji = (e) => {

        setText((prev) => prev + e.emoji)
    }

    const Action = () => {
        HandlePostComment()
        setisEmoji(false)
    }

    return (
        <div className='flex relative w-full items-center border-2 border-gra-300 p-[7px] rounded-full'>
            {!isEmoji ? <button onClick={() => setisEmoji(true)}><InsertEmoticonIcon sx={{ fontSize: 16 }} /></button> : <button onClick={() => setisEmoji(false)}><CloseIcon sx={{ fontSize: 16 }} /></button>}

            <input onFocus={() => setisEmoji(false)} value={Text} onChange={(e) => setText(e.target.value)} type="text" className='rounded-lg px-[20px] bg-transparent focus:outline-none w-full' placeholder={placeholder} />
            {isEmoji ? <div className='absolute w-[200px] bottom-[250px] h-[200px]'>

                <EmojiPicker onEmojiClick={HandleEmoji} width={400} height={400} />
            </div> : <></>}

            <button onClick={() => Action()}><SendIcon sx={{ fontSize: 16 }} /></button>
        </div>
    )
}
