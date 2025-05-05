import React from 'react';

interface Post {
  uniqueid: string;
  likes: number;
  hasliked: string | null;
  pid: string | null;
}

interface Data {
  id: number; 
}

const HandlePostLike = async (
  action: string,
  Datasend: Function,
  selectedImage: Post | null,
  data: Data | null,
  setSelectedPost: React.Dispatch<React.SetStateAction<Post>>
) => {
  if (!selectedImage) return; 
  if (!data) return; 

  const response = await Datasend({
    url: '/likepost',
    method: 'POST',
    data: { postid: selectedImage.uniqueid, action },
  });

  if (response.data) {
    let post = JSON.parse(JSON.stringify(selectedImage)); 
    if (action === 'like') {
      post.likes += 1;
      post.hasliked = data.id; 
      post.pid = selectedImage.uniqueid;
    }
    if (action === 'unlike') {
      post.likes -= 1;
      post.hasliked = null;
      post.pid = null;
    }
 
    setSelectedPost(post); // Update the state
  }
};

export default HandlePostLike;