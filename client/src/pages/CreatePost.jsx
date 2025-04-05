import React ,   {useState} from 'react'
import Layout from '../Layout'
import { useSendImagedataMutation } from '../redux/apis/slice'

export default function CreatePost() {


  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [hideLikes, setHideLikes] = useState(false);
  const [disableComments, setDisableComments] = useState(false);
  const [ShareTocommunity , setShareTocommunity] = useState(false)
  const [Imagetosend , setImagetosend] = useState(null)
  const [PostData] = useSendImagedataMutation()
  const [Error, setError] = useState("")
  const [Message, setMessage] = useState("")
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setImagetosend(file)
    } 
  };


  const handlePostData = async () => {
    if (Imagetosend !== null) {
      let formdata = new FormData()
      formdata.append("post" , Imagetosend)
      formdata.append("description" , description)
      formdata.append("hide_like_count" , hideLikes)
      formdata.append("hide_comment" , disableComments)
      formdata.append("sharetocommunity" , ShareTocommunity)
      const response = await PostData({  url: '/uploadpost' , method: "POST" , data: formdata })
      if (response.error?.data.error) {
        setError(response.error?.data.error)
        setTimeout(() => {
          setError("")
        } , 3000)
      }
      else{
        setImagetosend(null)
        setImage("")
        setHideLikes(false)
        setDisableComments(false)
        setDescription("")
        setShareTocommunity(false)
        setMessage("Post uploaded!")
        setTimeout(() => {
          setMessage("")
        } , 3000)
      }

    }
    else{
      setError("Please select a post to upload!")
      setTimeout(() => {
        setError("")
      } , 3000)
    }
  }


  return (
    <Layout>

    <div className='flex items-center w-full h-full  justify-center'>


    <div className="w-[70%] flex flex-col gap-[20px]  p-4 h-[80%]  rounded-lg shadow-lg bg-black text-white">
      <div className='w-full flex  items-center justify-between'>

      <h2 className="  text-[#FF6500]">Create a Post</h2>
      
      </div>
      {Error &&  <p className='bg-[crimson] rounded-md text-white px-[10px]'>{Error}</p> }
      {Message &&  <p className='bg-green-500 rounded-md text-white px-[10px]'>{Message}</p> }
      <div className="flex gap-4 h-full w-full">
        {/* Image Upload Section */}
        <div className="w-1/2  h-[90%] rounded-lg flex items-center justify-center p-2 bg-gray-900">
          {image ? (
            <div className='w-[90%] h-[90%] relative'>

            <img src={image} alt="Uploaded" className="w-full h-full object-contain rounded-lg" />
            </div>
          ) : (
              <div className='relative items-center justify-center flex flex-col w-full h-full'>

              <span className="text-gray-300">+ Upload Image</span>
              <input type="file" className="opacity-0 cursor-pointer w-full h-full absolute" onChange={handleImageUpload} />
              </div>
            
          )}
        </div>

        {/* Post Details Section */}
        <div className="w-2/3">
          <textarea
            className="w-full bg-gray-900 p-2  rounded-lg resize-none"
            rows="7"
            placeholder="Write a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <div className="flex flex-col items-center w-full gap-4 mt-3">
            <label className="flex items-center w-full gap-1 cursor-pointer">
              
              <input
                type="checkbox"
                className=""
                checked={hideLikes}
                onChange={() => setHideLikes(!hideLikes)}
              />
              Hide Like Counts
            </label>
            <label className="flex items-center w-full gap-1 cursor-pointer">
             
              <input
                type="checkbox"
                className=""
                checked={disableComments}
                onChange={() => setDisableComments(!disableComments)}
              />
              Disable Comments
            </label>

            <label className="flex items-center w-full gap-1 cursor-pointer">
             
              <input
                type="checkbox"
                className=""
                checked={ShareTocommunity}
                onChange={() => setShareTocommunity(!ShareTocommunity)}
              />
             Share to community
            </label>

          </div>
          <div className='flex items-center gap-[20px]'>
            
          <button onClick={() => handlePostData()} className="mt-4 bg-[#FF6500] text-white px-[30px] py-[5px] rounded-lg ">
            Post
          </button>

          <button className='mt-4 text-[#FF6500] px-[20px] py-[5px] hover:rounded-lg hover:border hover:border-[#FF6500]'>Save as draft</button>

          </div>

        </div>
      </div>
    </div>
    </div>


    </Layout>
  )
}
