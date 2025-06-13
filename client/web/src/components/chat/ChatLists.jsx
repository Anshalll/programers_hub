import React, { useEffect } from 'react'
import { useFetchDataQuery, useSendDataMutation } from '../../redux/apis/slice'
import { setuseractivechat } from '../../redux/userdata/slice'
import { useDispatch } from 'react-redux'
import { useActiveChat } from '../../hooks/useActiveChat'

export default function ChatLists({ setChatUser }) {

    const { data, isLoading, error } = useFetchDataQuery("/getuserchat")
    const [Send_data] = useSendDataMutation()

    const dispatch = useDispatch()
    const { activechat } = useActiveChat()
    useEffect(() => {
        if (!isLoading && data && !error) {

            dispatch(setuseractivechat(data.data))
        }

    }, [isLoading, error, data, dispatch])


    useEffect(() => {
        if (activechat) {
            let active_chat_data = activechat.filter((e) => e.type === "activechat")
            if (active_chat_data.length > 0) {
                async function getactiveuserdata() {
                    const data = await Send_data({ method: "POST", url: "/getuserstatus", data: { udata: active_chat_data[0] } })
                    console.log(data)
                }
                getactiveuserdata()
            }
        }
    }, [activechat, Send_data])

    return (
        <div className="Scroller flex flex-col h-[calc(100vh-60px)] p-[10px] gap-[20px] overflow-y-auto">
            {activechat.map((item, index) => (
                <div className='flex flex-col w-full gap-[20px]' key={index} >

                    {item.type === "recommended" && item?.data.map((user, id) => (
                        <button onClick={() => setChatUser({ type: "chat", data: user })} key={id} className='flex items-center border-b-2 p-[7px] border-gray-800 w-full gap-[10px]'>
                            <img className='w-[30px] h-[30px] rounded-full' src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/dp/${user.dp}`} alt="" />
                            <p className='text-white'>{user.username}</p>
                        </button>
                    ))}


                    {item.type === "activechat" && item?.data?.length > 0 ? (item.data.map((vals, key) => (
                        <div key={key} className='text-white'>
                            <p>Recommended</p>
                            <p>{vals}</p>
                        </div>
                    ))) : <></>}

                </div>

            ))}
        </div>
    )
}
