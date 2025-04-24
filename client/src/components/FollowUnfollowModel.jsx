import React from 'react'
import Followers from './Followers'
import Followings from './Followings'

export default function FollowUnfollowModel({  type }) {
  return (
    type  === "followers" ? <Followers/> : <Followings/>
  )
}
