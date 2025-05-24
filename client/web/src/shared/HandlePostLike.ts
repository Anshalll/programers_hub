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
  
) => {
  if (!selectedImage) return; 
  if (!data) return; 

  const response = await Datasend({
    url: '/likepost',
    method: 'POST',
    data: { postid: selectedImage.uniqueid, action },
  });
  let postlike= false
  if (response.data) {
    let post = JSON.parse(JSON.stringify(selectedImage)); 
    if (action === 'like') {
      post.likes += 1;
      postlike = true
     
    }
    if (action === 'unlike') {
      post.likes -= 1;
      postlike = false
    
    }
 
    return {post , postlike }; 

  }
};

export default HandlePostLike;