import React, { useEffect, useState } from 'react'
import Input from '../Inputcomment.jsx'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import ChatHeader from './ChatHeader.jsx';
import { useSocket } from "../../socket/SocketConnection.js";
import { useProfiledata } from '../../hooks/useProfiledata.jsx';
import ChatHome from './ChatHome.jsx';

export default function ChatMessages({ selectedChat }) {


    const { data } = useProfiledata()
    const [Messages, setMessages] = useState([])
    const [Users, setUsers] = useState({})
    const socket = useSocket()
    const [Seenlast, setSeenlast] = useState(false)

    const [NewMessage, setNewMessage] = useState("")
    useEffect(() => {
        if (selectedChat.data && data.username) {
            setUsers({ usera: data.username, userb: selectedChat.data.username })
        }
    }, [selectedChat.data, data.username])

useEffect(() => {
    if (Object.keys(Users).length > 0 && socket.connected) {

        socket.emit("getchatdata", {
            "usera": { "name": Users.usera },
            "userb": { "name": Users.userb }
        }, (e) => {
            console.log("Chat data response:", e);
        });

    }
}, [Users, socket]);

useEffect(() => {
  const handler = (msg) => {
    
    setMessages((e) => [...e, msg])
    socket.emit("markseen" , {
        "username" : selectedChat.data.username
    })
  };

  const markseen = (e) => {
    console.log(e)
    setSeenlast(true)
  }

  socket.on("receive_message", handler);
  socket.on("seen_status" , markseen)

  return () => {
    socket.off("receive_message", handler);
  };
}, [socket, data.username , Messages , selectedChat]);


    const SendMessage = () => {
        if (NewMessage.trim() !== "") {
            socket.emit("sendmessage", {
                message: NewMessage,
                touser: selectedChat.data.username

            })
            setSeenlast(false)
            setMessages((e) => [...e , {"from" : data.username, "message": NewMessage, "type": "sender"}])
        }
    }   

    return (
        <div className='w-full h-full flex-col  '>
            {selectedChat.type ? <>
                <ChatHeader type={selectedChat.data.type} profilePic={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${selectedChat.data.dp}`} username={selectedChat.data.username} isOnline={false} />
                <div className='Scroller h-[calc(100%-160px)] px-[20px] flex flex-col overflow-y-auto gap-[20px]  w-full'>

                    {Messages.length === 0 ? <div className='w-full h-full flex items-center justify-center'>
                        <p className='text-lg text-white font-bold'>Start a conversation</p>
                    </div> : <></>}

                    
                    
                    {Messages.map((item, key) => (
                        <div key={key}>

                            <div className={`flex ${item.type === "sender" ? "justify-end" : "justify-start"} w-full`} key={key}>
                                

                                    <div className='flex flex-col max-w-[70%] h-max items-end gap-[10px] '>


                                        <div className='w-full  darkcomp shadow-lg rounded-tl-2xl rounded-tr-md rounded-bl-2xl  shadow-cyan-900/30 p-4'>
                                            <p className='leading-relaxed text-white'>{item.message}</p>
                                            { Seenlast &&  <p className='text-white'>Seen</p> }
                                        </div>

                                    </div>
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
            </> : <ChatHome />
            }
        </div>
    )
}
