import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import AppLayout from '@/layout/AppLayout'
import { UsersRound, User } from 'lucide-react-native';

export default function Index() {

  const [ActiveTab, setActiveTab] = useState<number>(0)

  const UserChat = [
    {
      "username": "Tony Stark",
      "dp": "https://m.media-amazon.com/images/I/71JpPdKSEAL._AC_UY1100_.jpg",
      "lastMessage": "Hello, how are you?",
      "timestamp": "2023-10-01 12:01 pm"

    },
    {
      "username": "Tony Stark",
      "dp": "https://m.media-amazon.com/images/I/71JpPdKSEAL._AC_UY1100_.jpg",
      "lastMessage": "Hello, how are you?",
      "timestamp": "2023-10-01 12:01 pm"

    },
    {
      "username": "Tony Stark",
      "dp": "https://m.media-amazon.com/images/I/71JpPdKSEAL._AC_UY1100_.jpg",
      "lastMessage": "Hello, how are you?",
      "timestamp": "2023-10-01 12:01 pm"

    }
  ]
  return (

    <AppLayout>
      <View className='flex flex-row items-center h-[40px] justify-center '>

        <TouchableOpacity className={`w-[50%] border-r-2 border-r-gray-800 h-full flex items-center justify-center border-b-2 ${ActiveTab === 0 ? "border-b-cyan-500" : "border-b-gray-800"}`} onPress={() => setActiveTab(0)}>
          <User size={20} color={"white"} />
        </TouchableOpacity>

        <TouchableOpacity className={`w-[50%]   h-full flex items-center justify-center border-b-2 ${ActiveTab === 1 ? "border-b-cyan-500" : "border-b-gray-800"}`} onPress={() => setActiveTab(1)}>
          <UsersRound size={20} color={"white"} />

        </TouchableOpacity>

      </View>
      <View className='flex flex-col gap-[10px] p-[3px]'>

        {
          UserChat.map((user, key) => (
            <View key={key} className='w-full flex items-center justify-center '>
              <View className='w-full p-[9px] h-[70px] rounded-lg flex flex-row gap-[20px]  shadow-white-2xl ' style={{ backgroundColor: "#141414" }}>
                <View className='flex  flex-row items-center gap-[20px]'>
                  <Image source={{ uri: user.dp }} height={40} width={40} className='rounded-full object-cover' />
                  <View className='flex flex-col gap-[5px]'>
                    <Text className='text-white'>
                      {user.username}
                    </Text>
                    <Text className='text-gray-300 text-[11px]'>
                      {user.lastMessage}
                    </Text>
                  </View>
                </View>
                <Text className='text-gray-400 w-[24%]  text-[11px] text-nowrap ml-auto'>
                  {user.timestamp}
                </Text>
              </View>
            </View>
          ))
        }
      </View>

    </AppLayout>

  )
}