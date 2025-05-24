import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import AppLayout from '@/layout/AppLayout'
import { Theme } from '@/Theme/ThemeContext'
import { Heart, MessageSquareText, Share2, Bookmark } from 'lucide-react-native';

export default function Home() {

  let PostData = [
    {
      id: 1,
      title: "Post Title 1",
      content: "This is the content of post 1",
      image: "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/8720401/ktokatitmir0.jpg?quality=90&strip=all&crop=20.35,0,59.3,100",
      following: true,
      likes: 10,
      comments: 5,
      createdAt: "2023-10-01 12:01 pm",
      moreimages: ["https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/8720401/ktokatitmir0.jpg?quality=90&strip=all&crop=20.35,0,59.3,100", "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/8720401/ktokatitmir0.jpg?quality=90&strip=all&crop=20.35,0,59.3,100", "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/8720401/ktokatitmir0.jpg?quality=90&strip=all&crop=20.35,0,59.3,100"],
      username: "Tony stark",
      dp: "https://m.media-amazon.com/images/I/71JpPdKSEAL._AC_UY1100_.jpg"
    },
  ]

  return (
    <AppLayout>

      {PostData.map((post, key) => (
        <View key={key} className='w-full flex items-center justify-center '>
          <View className='w-full p-[9px] h-[420px] rounded-lg flex flex-col gap-[20px]  shadow-white-2xl ' style={{ backgroundColor: Theme.darkcomp }}>
            <View className='flex flex-row w-full justify-between items-center'>
              <View className='flex  flex-row items-center gap-[20px]'>
                <Image source={{ uri: post.dp }} height={40} width={40} className='rounded-full object-cover' />
                <View className='flex flex-col gap-[5px]'>

                  <Text className='text-white'>
                    {post.username}
                  </Text>
                  <Text className='text-gray-300 text-[11px]'>
                    {post.createdAt}
                  </Text>

                </View>

              </View>
              <TouchableOpacity className={`${post.following ? "bg-cyan-500" : "border-2 border-cyan-500"} py-[7px] px-[15px] rounded-lg`}>
                {post.following ? <Text className={`text-white`}>
                  Following
                </Text> : ""}
              </TouchableOpacity>
            </View>

            <View className='flex w-full flex-row '>
              <ScrollView className='w-[20%] '>

                {post.moreimages.map((vals, index) => (
                  <View key={index}>
                    <Image source={{ uri: vals }} className='w-[50px] h-[50px] rounded-lg object-cover mb-[10px]' />
                  </View>
                ))}
              </ScrollView>

              <View className='w-[80%] h-full '>
                <Image source={{ uri: post.image }} className='w-full h-[300px] rounded-lg object-contain' />
              </View>


            </View>


            <View className='flex w-full justify-between flex-row items-center'>
              <TouchableOpacity>
                <Heart size={18} color={"white"} />
              </TouchableOpacity>
              <TouchableOpacity>
                <MessageSquareText size={18} color={"white"} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Share2 size={18} color={"white"} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Bookmark size={18} color={"white"} />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      ))}

    </AppLayout>
  )
}