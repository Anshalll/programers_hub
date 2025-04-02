import React ,   {useState} from 'react'
import Layout from '../Layout'

export default function CreatePost() {


  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [hideLikes, setHideLikes] = useState(false);
  const [disableComments, setDisableComments] = useState(false);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <Layout>

    <div className='flex items-center w-full h-full  justify-center'>


    <div className="w-[90%]  p-4 h-[90%]  rounded-lg shadow-lg bg-black text-white">
      <div className='w-full mb-4 flex  items-center justify-between'>

      <h2 className="  text-[#FF6500]">Create a Post</h2>
      
      </div>
      <div className="flex gap-4 h-full w-full">
        {/* Image Upload Section */}
        <div className="w-1/2  h-[90%] rounded-lg flex items-center justify-center p-2 bg-gray-900">
          {image ? (
            <img src={image} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
          ) : (
              <div className='relative items-center justify-center flex flex-col w-full h-full'>

              <span className="text-gray-300">+ Upload Image</span>
              <input type="file" className="opacity-0 w-full h-full absolute" onChange={handleImageUpload} />
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
          <input
            type="text"
            className="w-full bg-gray-900 p-2 mt-2  rounded-lg"
            placeholder="Add tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
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
                checked={disableComments}
                onChange={() => setDisableComments(!disableComments)}
              />
             Share to community
            </label>

          </div>
          <div className='flex items-center gap-[20px]'>
            
          <button className="mt-4 bg-[#FF6500] text-white px-[30px] py-[5px] rounded-lg ">
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
