import React from 'react'

export default function UnFollowButton({ HandleUnfollowInModel , value }) {
  return (
    <button onClick={() => HandleUnfollowInModel(value )} className='border-2 border-white w-[80px] py-[5px] rounded-lg'>Unfollow</button>
  )
}
