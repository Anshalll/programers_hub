import React, { useEffect, useState } from 'react'
import Input from '../Inputcomment.jsx'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import ChatHeader from './ChatHeader.jsx';
import { SocketInit } from "../../socket/SocketConnection.js";
import { useProfiledata } from '../../hooks/useProfiledata.jsx';
import ChatHome from './ChatHome.jsx';

export default function ChatMessages({ selectedChat }) {

    const socket = SocketInit()
    const { data } = useProfiledata()
    const [Messages, setMessages] = useState({})

    useEffect(() => {
        if (socket.connected && selectedChat.type === "chat") {
            socket.emit("joinchat", {
                usera: { name: data.username, isJoined: true },
                userb: { name: selectedChat.data.username, isJoined: false }
            }, (e) => {
               setMessages(e);
            });

        }
    }, [socket, data, selectedChat])

    const [NewMessage, setNewMessage] = useState("")




    const SendMessage = () => {

    }

    return (
        <div className='w-full h-full flex-col  '>
            {selectedChat.type ?    <>
                <ChatHeader type={selectedChat.data.type} profilePic={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${selectedChat.data.dp}`} username={selectedChat.data.username} isOnline={false} />
                <div className='Scroller h-[calc(100%-160px)] px-[20px] flex flex-col overflow-y-auto gap-[20px]  w-full'>

                    {!Messages.chat ? <div className='w-full h-full flex items-center justify-center'>
                            <p className='text-lg text-white font-bold'>Start a conversation</p>
                    </div> : <></>}
                    {/* {Messages.map((item, key) => (
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
                    ))} */}
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
            </> : <ChatHome/>
            }
        </div>
    )
}
