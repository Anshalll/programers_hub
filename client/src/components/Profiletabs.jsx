import { useState } from "react";
import {useProfiledata} from '../hooks/useProfiledata'

const Profiletabs = ({setSelectedPost , userCommunities }) => {
  const [activeTab, setActiveTab] = useState("posts");

  const { post } = useProfiledata()
  
  const HandleSelectedPost = (image) => {
    setSelectedPost(image)
  }
  
  return (
    <div className="w-full  mt-[11rem] mx-auto p-4">
      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          className={`flex-1 p-2 text-center ${
            activeTab === "posts" ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`flex-1 p-2 text-center ${
            activeTab === "communities" ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("communities")}
        >
          Communities
        </button>
      </div>

      {/* Content Section */}
      <div className="mt-4 w-full ">
        {activeTab === "posts" ? (
          <div className="w-full flex items-center justify-center">
            {post.length > 0 ? (
            
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2  gap-[20px] w-fulljustify-items-center ">

              {post.map((post, index) => (
                
                <button onClick={() => HandleSelectedPost(post)} key={index} className="w-[250px] cursor-pointer h-[300px]">
                    <img src={`${import.meta.env.VITE_SERVERURL}/api/sendstatic/post/${post.filename}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            ) : (
              <p className="text-gray-500">No posts available.</p>
            )}
          </div>
        ) : (
          <div>
            {userCommunities.length > 0 ? (
              userCommunities.map((community, index) => (
                <div key={index} className="p-4 border rounded-lg mb-2 shadow-sm">
                  <h3 className="font-semibold">{community.name}</h3>
                  <p className="text-gray-600">{community.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No communities joined.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiletabs;
