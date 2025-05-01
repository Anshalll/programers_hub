import React, { useState } from 'react'
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Input from './Inputcomment'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';

export default function ChatMessages({ user }) {
    const [NewMessage, setNewMessage] = useState("")

    let Messages = [
        { seen: false, message: "Hi", time: "02:03 am", type: "sender" },
        { seen: true, message: "Hello!", time: "02:04 am", type: "receiver" },
        { seen: true, message: "How are you?", time: "02:05 am", type: "sender" },
        { seen: true, message: "I'm good, you?", time: "02:06 am", type: "receiver" },
        { seen: false, message: "Doing well!", time: "02:07 am", type: "sender" },
        { seen: false, message: "What's up?", time: "02:08 am", type: "receiver" },
        { seen: true, message: "Working on a project.", time: "02:09 am", type: "sender" },
        { seen: true, message: "Cool, what is it?", time: "02:10 am", type: "receiver" },
        { seen: false, message: "An e-commerce site.", time: "02:11 am", type: "sender" },
        { seen: false, message: "That's nice!", time: "02:12 am", type: "receiver" },
        { seen: true, message: "Thanks!", time: "02:13 am", type: "sender" },
        { seen: true, message: "Need help?", time: "02:14 am", type: "receiver" },
        { seen: false, message: "Maybe frontend.", time: "02:15 am", type: "sender" },
        { seen: false, message: "React?", time: "02:16 am", type: "receiver" },
        { seen: true, message: "Yes, with Tailwind.", time: "02:17 am", type: "sender" },
        { seen: true, message: "Nice combo.", time: "02:18 am", type: "receiver" },
        { seen: false, message: "Do you use it too?", time: "02:19 am", type: "sender" },
        { seen: false, message: "All the time!", time: "02:20 am", type: "receiver" },
        { seen: true, message: "Makes styling easy.", time: "02:21 am", type: "sender" },
        { seen: true, message: "Definitely!", time: "02:22 am", type: "receiver" },
        { seen: false, message: "Want to review my code?", time: "02:23 am", type: "sender" },
        { seen: false, message: "Sure, send it.", time: "02:24 am", type: "receiver" },
        { seen: true, message: "Here’s the link.", time: "02:25 am", type: "sender" },
        { seen: true, message: "Looks good!", time: "02:26 am", type: "receiver" },
        { seen: false, message: "Thanks!", time: "02:27 am", type: "sender" },
        { seen: false, message: "Free tomorrow?", time: "02:28 am", type: "receiver" },
        { seen: true, message: "Yes, mostly.", time: "02:29 am", type: "sender" },
        { seen: true, message: "Let’s call.", time: "02:30 am", type: "receiver" },
        { seen: false, message: "Sounds good!", time: "02:31 am", type: "sender" },
        { seen: false, message: "Catch you later.", time: "02:32 am", type: "receiver" },
        { seen: true, message: "Bye!", time: "02:33 am", type: "sender" },
        { seen: true, message: "Back again!", time: "03:00 am", type: "sender" },
        { seen: false, message: "Welcome back.", time: "03:01 am", type: "receiver" },
        { seen: true, message: "Fixed the bug.", time: "03:02 am", type: "sender" },
        { seen: true, message: "Great job!", time: "03:03 am", type: "receiver" },
        { seen: false, message: "Thanks!", time: "03:04 am", type: "sender" },
        { seen: false, message: "Deploying now.", time: "03:05 am", type: "receiver" },
        { seen: true, message: "Let me know once done.", time: "03:06 am", type: "sender" },
        { seen: true, message: "Sure thing.", time: "03:07 am", type: "receiver" },
        { seen: false, message: "It’s live!", time: "03:08 am", type: "receiver" },
        { seen: false, message: "Awesome!", time: "03:09 am", type: "sender" },
        { seen: true, message: "Check it out.", time: "03:10 am", type: "receiver" },
        { seen: true, message: "I love it!", time: "03:11 am", type: "sender" },
        { seen: false, message: "Thanks!", time: "03:12 am", type: "receiver" },
        { seen: false, message: "Talk later?", time: "03:13 am", type: "sender" },
        { seen: true, message: "Sure!", time: "03:14 am", type: "receiver" },
        { seen: true, message: "Bye again!", time: "03:15 am", type: "sender" },
        { seen: false, message: "Bye!", time: "03:16 am", type: "receiver" }
    ];

    const SendMessage = () => {

    }

    return (
        <div className='w-full h-full flex-col  '>
            <div className='h-[80px]  px-[20px] flex items-center darkcomp'>
                <div className='flex  items-center gap-[10px]'>
                    <img className='h-[40px] w-[40px] flex rounded-full object-cover' src={user.profilePic} alt="" />
                    <div className='flex flex-col gap-[5px]'>

                        <p className='text-white'>{user.username}</p>
                        <p className='text-white'>{user.isOneline ? <span className='text-[chartreuse]'>Online</span> : <span className='text-[crimson]'>Offline</span>}</p>
                    </div>
                </div>


            </div>


            <div className='Scroller h-[calc(100%-160px)] px-[20px] flex flex-col overflow-y-auto gap-[20px]  w-full'>
                {Messages.map((item, key) => (
                    <div key={key}>

                        <div className={`flex ${item.type === "sender" ? "justify-end" : "justify-start"} w-full`} key={key}>
                            {item.type === "receiver" && <div className='max-w-[70%] bg-gradient-to-r darkcomp rounded-tl-2xl rounded-tr-md rounded-bl-2xl shadow-lg shadow-cyan-900/60 p-4'>
                                <p className='text-white'>{item.message}</p>


                                <p className='text-xs mt-2 text-gray-400'>{item.time}</p>


                            </div>}
                            {item.type === "sender" && <div className='max-w-[70%] bg-gradient-to-r darkcomp rounded-tl-2xl rounded-tr-md rounded-bl-2xl shadow-lg shadow-cyan-900/60 p-4'>
                                <p className='leading-relaxed text-white'>{item.message}</p>
                                <div className='flex mt-2 gap-[20px] items-center justify-between'>
                                    <p className='text-xs text-cyan-100/70'>{item.time}</p>

                                    <span className={`${item.seen ? "text-[chartreuse]" : "text-[crimson]"}`}><DoneAllIcon sx={{ fontSize: 14 }} /></span>
                                </div>
                            </div>}
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex text-white justify-center items-center w-full h-[80px] darkcomp'>
                <div className='flex w-[10%] h-full gap-[20px] justify-center items-center'>
                    <button className='hover:text-cyan-300'><AttachFileIcon /></button>
                    <button className='hover:text-cyan-300'><InsertPhotoOutlinedIcon /></button>
                </div>
                <div className='w-[80%] h-[100%] flex items-center'>

                    <Input setText={setNewMessage} Text={NewMessage} ActionFunction={SendMessage} type='input' placeholder={"Send message.."} />
                </div>

            </div>
        </div>
    )
}
