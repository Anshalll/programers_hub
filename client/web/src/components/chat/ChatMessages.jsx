import React, { useEffect, useState } from 'react'
import Input from '../Inputcomment.jsx'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import ChatHeader from './ChatHeader.jsx';
import { SocketInit } from "../../socket/SocketConnection.js";
import { useProfiledata } from '../../hooks/useProfiledata.jsx';

export default function ChatMessages({ user }) {

    const socket = SocketInit()
    const { data } = useProfiledata()

    useEffect(() => {
        if (socket.connected) {
            socket.emit("joinchat", {
                usera: { name: data.username, isJoined: true },
                userb: { name: user.username, isJoined: false }
            }, (e) => {
                console.log(e);
            });

        }
    }, [socket, data, user])

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
        { seen: false, message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis iure praesentium veritatis perspiciatis eius ullam aperiam natus necessitatibus ducimus vitae similique consequatur inventore ea fugiat, nesciunt nulla error velit accusantium. Quisquam ratione iusto inventore reprehenderit ducimus excepturi quasi delectus facilis tenetur beatae? Architecto error libero, vitae aspernatur sunt quam id aliquid recusandae necessitatibus incidunt iure, explicabo iusto! Impedit explicabo molestiae odio modi in alias eius aliquam aspernatur, aliquid amet assumenda ut necessitatibus expedita reiciendis, laudantium sapiente dolorem maiores numquam recusandae nesciunt sequi iste eveniet! Debitis, consectetur? Ipsam rerum, id modi nesciunt debitis perspiciatis officiis eos odio numquam provident recusandae laborum!", time: "03:16 am", type: "receiver" }
    ];



    const SendMessage = () => {

    }

    return (
        <div className='w-full h-full flex-col  '>

            <ChatHeader profilePic={user.profilePic} username={user.username} isOnline={user.isOnline} />
            <div className='Scroller h-[calc(100%-160px)] px-[20px] flex flex-col overflow-y-auto gap-[20px]  w-full'>
                {Messages.map((item, key) => (
                    <div key={key}>

                        <div className={`flex ${item.type === "sender" ? "justify-end" : "justify-start"} w-full`} key={key}>
                            {item.type === "receiver" && <div className={`max-w-[70%]  darkcomp rounded-tl-md rounded-tr-2xl rounded-br-2xl shadow-lg shadow-cyan-900/30 p-4`}>
                                <p className='text-white'>{item.message}</p>

                            </div>}
                            {item.type === "sender" &&

                                <div className='flex flex-col max-w-[70%] h-max items-end gap-[10px] '>


                                    <div className='w-full  darkcomp shadow-lg rounded-tl-2xl rounded-tr-md rounded-bl-2xl  shadow-cyan-900/30 p-4'>
                                        <p className='leading-relaxed text-white'>{item.message}</p>




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
