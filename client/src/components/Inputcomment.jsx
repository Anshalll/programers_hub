import React, { useState } from 'react'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';
import CloseIcon from '@mui/icons-material/Close';


export default function Inputcomment({Position="bottom-[250px]" , row=2, ActionFunction, Text, setText, placeholder, ShowBtn = true, type = "input" , rounded="full"}) {


    const [isEmoji, setisEmoji] = useState(false)

    const HandleEmoji = (e) => {

        setText((prev) => prev + e.emoji)
    }

    const Action = () => {
        ActionFunction()
        setisEmoji(false)
    }

    return (
        <div className={`flex ${type === "textarea" ? " flex-col-reverse" : "flex-row"} relative w-full ${type === "textarea" ? "justify-center" : "items-center"} border-2 border-gray-300 p-[7px] rounded-${rounded}`}>
            {!isEmoji ? <button className='w-max' onClick={() => setisEmoji(true)}><InsertEmoticonIcon sx={{ fontSize: 16 }} /></button> : <button className='w-max' onClick={() => setisEmoji(false)}><CloseIcon sx={{ fontSize: 16 }} /></button>}

            {type === "input" ? <input onFocus={() => setisEmoji(false)} value={Text} onChange={(e) => setText(e.target.value)} type="text" className='rounded-lg px-[20px] bg-transparent focus:outline-none w-full' placeholder={placeholder} /> : <textarea className='outline-none' rows={row} placeholder={placeholder} value={Text} onChange={(e) => setText(e.target.value)}></textarea>}

            {isEmoji ? <div className={`absolute w-[200px] ${Position} h-[200px]`}>

                <EmojiPicker onEmojiClick={HandleEmoji} width={400} height={400} />
            </div> : <></>}

            {ShowBtn && <button onClick={() => Action()}><SendIcon sx={{ fontSize: 16 }} /></button>}
        </div>
    )
}
