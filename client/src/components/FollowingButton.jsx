import React from 'react'

export default function FollowingButton({ HandleUnfollowInModel , value }) {
  return (
    <button onClick={() => HandleUnfollowInModel(value )} className='bg-indigo-500 w-[80px] py-[5px] rounded-lg'>Following</button>
  )
}
