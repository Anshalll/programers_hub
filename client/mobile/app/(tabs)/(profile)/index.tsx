import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AppLayout from '@/layout/AppLayout'
import { Theme } from '@/Theme/ThemeContext'
import { ImagePlay, Users } from 'lucide-react-native'

export default function Index() {

  const [SelectedMediaType, setSelectedMediaType] = useState<number>(0)

  const Posts = [

  ]

  const Profile = {
    username: "Tonystark212",
    name: "Tony stark",
    dp: "https://m.media-amazon.com/images/I/71JpPdKSEAL._AC_UY1100_.jpg",
    bio: "Iron man and CEO of Stark Industries",
    followers: "1k",
    bg: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    following: 500,
    posts: 50,
    group: 20,
    createdAt: "2023-10-01 12:01 pm",
    location: "New York, USA",
    website: "https://starkindustries.com",
  }

  const UserPosts = [
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
    "https://cdn.prod.website-files.com/5b4a3b3971d099f78f362505/6552d819f23f3d69c6657e83_683.webp",
  ]

  return (
    <AppLayout>

      <View className='relative w-full rounded-lg h-[200px]'>
        <Image source={{ uri: Profile.bg }} className='h-[150px] w-full object-cover rounded-lg' />
        <View className='absolute w-[100px] h-[100px]'>
          <Image source={{ uri: Profile.dp }} className='w-full h-full rounded-full bottom-[-70px]' />
        </View>

      </View>
      <View className='w-full flex gap-[20px]  flex-col'>
        <View className='w-full flex flex-col gap-[5px]'>
          <Text className='text-gray-400'>{Profile.name}</Text>
          <Text className='text-white'>@{Profile.username}</Text>
          <Text className='text-white text-[13px]'>{Profile.bio}</Text>
        </View>
        <View className='w-full  rounded-lg flex flex-row items-center justify-between   p-[20px]  gap-[10px]' style={{ backgroundColor: Theme.darkcomp }}>
          <View className='flex flex-col items-center justify-center' >
            <Text className='text-white text-[13px]'>{Profile.followers} </Text>
            <Text className='text-white text-[13px]'>Followers</Text>
          </View>
          <View className='flex flex-col items-center justify-center' >
            <Text className='text-white text-[13px]'>{Profile.following} </Text>
            <Text className='text-white text-[13px]'>Following</Text>
          </View>
          <View className='flex flex-col items-center justify-center' >
            <Text className='text-white text-[13px]'>{Profile.posts} </Text>
            <Text className='text-white text-[13px]'>Post</Text>
          </View>

          <View className='flex flex-col items-center justify-center' >
            <Text className='text-white text-[13px]'>{Profile.group} </Text>
            <Text className='text-white text-[13px]'>Groups</Text>
          </View>
        </View>
      </View>

      <View className='w-full justify-center flex-row items-center flex  p-[20px]'>

        <View className={`w-[50%] ${SelectedMediaType === 0 ? "border-b-2 border-cyan-500" : "border-b-2 border-gray-300"} flex items-center justify-center p-[5px]`}>
          <TouchableOpacity onPress={() => setSelectedMediaType(0)}>
            <ImagePlay size={22} color={SelectedMediaType === 0 ? "cyan" : "white"} />
          </TouchableOpacity>
        </View>

        <View className={`w-[50%] ${SelectedMediaType === 1 ? "border-b-2 border-cyan-500" : "border-b-2 border-gray-300"} flex items-center justify-center p-[5px]`}>
          <TouchableOpacity onPress={() => setSelectedMediaType(1)}>
            <Users size={22} color={SelectedMediaType === 1 ? "cyan" : "white"} />
          </TouchableOpacity>
        </View>

      </View>

      <View className='flex flex-row w-full gap-2 items-center justify-center'>
        <View className='flex-row flex flex-wrap w-[90%] gap-2 items-center'>

          {UserPosts.length > 0 ? (UserPosts.map((value, index) => (
            <TouchableOpacity key={index}>
              <Image source={{ uri: value }} width={110} className='object-cover' height={110} />
            </TouchableOpacity>
          ))) : (<Text>

          </Text>)}
        </View>
      </View>

    </AppLayout>
  )
}