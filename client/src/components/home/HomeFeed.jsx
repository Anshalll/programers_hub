import React from 'react'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import FollowButton from '../FollowButton'
import FollowingButton from '../FollowingButton'
import VerifiedUser from '../../assets/icons/verified.png'

export default function HomeFeed() {
    const UserPosts = [
        {
            "id": 1,
            "username": "Clark kent",
            "userfollowers": "123lk",
            "profilePic": "https://www.looper.com/img/gallery/things-you-get-wrong-about-clark-kent/intro-1612453541.jpg",
            "post_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "hasimage": "https://cdn.britannica.com/98/263098-138-87DCA742/why-are-mountains-so-tall.jpg?w=800&h=450&c=crop",
            "likes": 10,
            "comments": 5,
            "shares": 2,
            "time": "2h",
            "isfollowing": true,
            "tags": ["tag1", "tag2", "tag3"],
        },
        {
            "id": 2,
            "username": "John Doe",
            "userfollowers": "123lk",
            "profilePic": "https://www.looper.com/img/gallery/things-you-get-wrong-about-clark-kent/intro-1612453541.jpg",
            "post_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "hasimage": "https://cdn.britannica.com/98/263098-138-87DCA742/why-are-mountains-so-tall.jpg?w=800&h=450&c=crop",
            "likes": 10,
            "comments": 5,
            "shares": 2,
            "time": "2h",
            "isfollowing": false,
            "isVerified": true,
            "tags": ["tag1", "tag2", "tag3"],
        },
        {
            "id": 3,
            "username": "Manish",
            "userfollowers": "123lk",
            "profilePic": "https://www.looper.com/img/gallery/things-you-get-wrong-about-clark-kent/intro-1612453541.jpg",
            "post_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "hasimage": "https://cdn.britannica.com/98/263098-138-87DCA742/why-are-mountains-so-tall.jpg?w=800&h=450&c=crop",
            "likes": 10,
            "comments": 5,
            "shares": 2,
            "time": "2h",
            "isfollowing": false,
            "isVerified": false,
            "tags": ["tag1", "tag2", "tag3"],
        },
        {
            "id": 4,
            "username": "John Doe",
            "userfollowers": "123lk",
            "profilePic": "https://www.looper.com/img/gallery/things-you-get-wrong-about-clark-kent/intro-1612453541.jpg",
            "post_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "hasimage": "https://cdn.britannica.com/98/263098-138-87DCA742/why-are-mountains-so-tall.jpg?w=800&h=450&c=crop",
            "likes": 10,
            "comments": 5,
            "shares": 2,
            "time": "2h",
            "isfollowing": true,
            "isVerified": false,
            "tags": ["tag1", "tag2", "tag3"],
        }
    ]
  return (
    <>
    
        {UserPosts.map((post, index) => (
            <div key={index} className='p-[20px] gap-[20px] w-[50%] rounded-lg darkcomp flex flex-col '>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-[20px]'>
                        <img src={post.profilePic} className='w-[40px] h-[40px] rounded-full object-cover' alt="" />
                        <div className='flex flex-col gap-[1px]'>
                            <p className='flex items-center gap-[10px]'>{post.username} <span>{post.isVerified? <img src={VerifiedUser} className='w-[20px] h-[20px] object-contain' alt="" />  : <></> }</span> </p>
                            <i className='text-gray-300 text-[12px]'>{post.userfollowers} followers</i>
                            <p className='text-gray-300 text-[12px]'>{post.time} ago</p>
                        </div>
                    </div>

                    {post.isfollowing ? <FollowingButton/> : <FollowButton />}
                </div>
                <div className='w-full'>
                    <p>{post.post_description} {post.tags?.map((vals, index) => (
                        <span key={index} className='text-cyan-500'>#{vals}</span>
                    ))}</p>

                </div>
                <div className='w-full h-[300px] flex '>
                    <img src={post.hasimage} className='rounded-lg object-cover h-full w-full' alt="" />
                </div>

                <div className='flex items-center justify-between w-full'>
                        <button><FavoriteBorderOutlinedIcon sx={{ fontSize: 16 }}/></button>
                        <button><CommentOutlinedIcon sx={{ fontSize: 16 }}/></button>
                        <button><ShareOutlinedIcon sx={{ fontSize: 16 }}/></button>
                        <button><BookmarkBorderOutlinedIcon sx={{ fontSize: 16 }}/></button>
                </div>
            </div>

        ))}
    </>
  )
}
