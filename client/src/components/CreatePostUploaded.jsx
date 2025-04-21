import React, { useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close';

export default function CreatePostUploaded({RemovePost ,  ActiveImage, setActiveImage, images }) {


    useEffect(() => {

        if (images.length > 0) {

            setActiveImage(0)

        }

    }, [images, setActiveImage])


    return (
        <div className='Scroller bg-black w-full h-full flex gap-[10px] overflow-x-auto'>
            {images.map((value, index) => (
                <div key={index} className='relative Uploadedimgs'>
                    <button className='rmuploaded text-white hidden  bg-[crimson] w-[20px] h-[20px]  absolute  ' onClick={() => RemovePost(index)}>
                          <CloseIcon sx={{ fontSize: 12 }}/>
                      </button>
                    <button onClick={() => setActiveImage(index)} className='w-[50px] rounded-lg h-[50px]'>
                    
                        <img className={`${ActiveImage === index ? "border-2 border-[#FF6500]" : ""} w-full h-full rounded-lg object-cover`} src={value} alt="" />

                    </button>

                </div>
            ))}

            
        </div>
    )
}
