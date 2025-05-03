import React from 'react'

export default function Moments() {
    const UserMoments = [
        {
            "id": 1,
            "username": "Clark kent",
            "profilePic": "https://www.looper.com/img/gallery/things-you-get-wrong-about-clark-kent/intro-1612453541.jpg",
            "isOnline": true,
            "time": "2h",
            "momentscount": 5,

        },
        {
            "id": 1,
            "username": "Clark kent",
            "profilePic": "https://www.looper.com/img/gallery/things-you-get-wrong-about-clark-kent/intro-1612453541.jpg",
            "isOnline": true,
            "time": "2h",
            "momentscount": 5,

        },
        {
            "id": 1,
            "username": "Clark kent",
            "profilePic": "https://www.looper.com/img/gallery/things-you-get-wrong-about-clark-kent/intro-1612453541.jpg",
            "isOnline": true,
            "time": "2h",
            "momentscount": 5,


        },
        {
            "id": 1,
            "username": "Clark kent",
            "profilePic": "https://www.looper.com/img/gallery/things-you-get-wrong-about-clark-kent/intro-1612453541.jpg",
            "isOnline": true,
            "time": "2h",
            "momentscount": 5,

        },
        {
            "id": 1,
            "username": "Clark kent",
            "profilePic": "https://www.looper.com/img/gallery/things-you-get-wrong-about-clark-kent/intro-1612453541.jpg",
            "isOnline": true,
            "time": "2h",
            "momentscount": 5,

        },
        {
            "id": 1,
            "username": "Clark kent",
            "profilePic": "https://www.looper.com/img/gallery/things-you-get-wrong-about-clark-kent/intro-1612453541.jpg",
            "isOnline": true,
            "time": "2h",
            "momentscount": 5,

        },
        {
            "id": 1,
            "username": "Clark kent",
            "profilePic": "https://www.looper.com/img/gallery/things-you-get-wrong-about-clark-kent/intro-1612453541.jpg",
            "isOnline": true,
            "time": "2h",
            "momentscount": 5,

        },
        {
            "id": 1,
            "username": "Clark kent",
            "profilePic": "https://www.looper.com/img/gallery/things-you-get-wrong-about-clark-kent/intro-1612453541.jpg",
            "isOnline": true,
            "time": "2h",
            "momentscount": 5,

        },

    ]

    return (
        <div className='flex flex-col h-full px-[20px] w-full gap-[20px]'>
            <p className='text-lg bg-gradient-to-r from-cyan-300 font-bold to-cyan-500 text-transparent bg-clip-text  h-[40px]'>Moments</p>
            <div className='Scroller flex flex-col gap-[20px] h-full  overflow-y-auto'>
                {UserMoments.map((moment, index) => (
                    <div key={index} className='p-[20px] border-b-2 border-gray-900 gap-[20px] w-full rounded-lg dlackcomp flex flex-col '>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-[20px]'>
                                <div className='bg-gradient-to-r from-cyan-600 to-cyan-500 p-[2px] rounded-full h-[50px] w-[50px] relative'>

                                    <img src={moment.profilePic} className='w-full h-full rounded-full object-cover' alt="" />
                                    {moment.isOnline && <div className='absolute bg-green-500 w-[15px] h-[15px] rounded-full right-0 bottom-0 border-2 border-black'></div>}
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-sm'>{moment.username}</p>
                                    <p className='text-xs text-gray-500'>{moment.time} ago</p>
                                </div>
                            </div>
                            <span className='bg-cyan-400/70 items-center justify-center  text-white rounded-lg flex w-[20px] h-[20px]'>{moment.momentscount} </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
