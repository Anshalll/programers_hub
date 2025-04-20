import React, { useEffect } from 'react'

export default function CreatePostUploaded({ActiveImage ,  setActiveImage , images }) {


    useEffect(() => {

        if (images.length > 0) {

            setActiveImage(0)

        }   

    } , [images , setActiveImage])

  return (
    <div className='Scroller bg-black w-full h-full flex gap-[10px] overflow-x-auto'>
        {images.map((value, index) => (
            <div key={index}>
                    <button onClick={() => setActiveImage(index)} className='w-[50px] rounded-lg h-[50px]'>

                    <img className={`${ActiveImage === index ? "border-2 border-[#FF6500]" : ""} w-full h-full rounded-lg object-cover`} src={value} alt="" />
                    </button>
            
            </div>
        ))}
    </div>
  )
}
