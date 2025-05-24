import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Theme } from '@/Theme/ThemeContext'
import { MessageCircleHeart, Search, Bell, Menu } from 'lucide-react-native';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SafeAreaProvider style={{ backgroundColor: Theme.blackcomp }}>
            <SafeAreaView>
                <View className='flex flex-row items-center justify-between px-[15px]' style={{ height: 70, backgroundColor: Theme.darkcomp }} >
                    <View className='flex flex-row items-center gap-[10px]'>

                       
                        <TouchableOpacity>
                            <Menu size={24} color={"white"} />
                        </TouchableOpacity>
                         <Text className='text-white text-lg'>Social media</Text>
                    </View>
                    <View className='flex flex-row items-center gap-[20px]'>
                        <TouchableOpacity>
                            <Search size={24} color={"white"} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Bell size={24} color={"white"} />
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <MessageCircleHeart size={24} color={"white"} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView className='p-[10px]'>

                    {children}
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>

    )
}