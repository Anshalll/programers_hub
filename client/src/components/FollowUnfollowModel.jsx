import React from 'react'
import Followers from './Followers'
import Followings from './Followings'

export default function FollowUnfollowModel({username,  type,   setTypeModelFollow }) {
  return (
    type  === "followers" ? <Followers username={username} setTypeModelFollow={setTypeModelFollow}/> : <Followings username={username} setTypeModelFollow={setTypeModelFollow}/>
  ) 
}
