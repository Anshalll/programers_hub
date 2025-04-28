import React from 'react'

export default function FollowButton({ HandlefollowInModel , value, index }) {
  return (
    <button className='bg-[#FF6500] w-[80px] py-[5px] rounded-lg' onClick={() => HandlefollowInModel(value , index)}>Follow</button>
  )
}
