import React from 'react'
import Followers from './Followers'
import Followings from './Followings'

export default function FollowUnfollowModel({type,   setTypeModelFollow }) {
  return (
    type  === "followers" ? <Followers setTypeModelFollow={setTypeModelFollow}/> : <Followings setTypeModelFollow={setTypeModelFollow}/>
  ) 
}
