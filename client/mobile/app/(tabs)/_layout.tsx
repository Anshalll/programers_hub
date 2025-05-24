import { Tabs } from "expo-router"
import { Theme } from '../../Theme/ThemeContext'
import { House, SquarePlus, CircleUser, MessageCircle, Clapperboard } from 'lucide-react-native';

const TabLayout = () => {
    return (
        <Tabs screenOptions={{

            headerShown: false,
            tabBarStyle: {
                backgroundColor: Theme.darkcomp,
                height: 70,
               
            }
            ,
            tabBarActiveTintColor: Theme.Secondarycolor,


        }}>
            <Tabs.Screen name="(home)/index" options={{
                tabBarShowLabel: false,
                title: "Home", tabBarIcon: ({ color }) => (
                    <House size={24} color={color} />
                )
            }} />

            <Tabs.Screen name="(chat)/index" options={{
                tabBarShowLabel: false,
                tabBarIcon: ({ color }) => (
                    <MessageCircle size={24} color={color} />
                )
            }} />

            <Tabs.Screen name="(create)/index" options={{
                tabBarShowLabel: false,
                title: "Home", tabBarIcon: ({ color }) => (
                    <SquarePlus size={24} color={color} />
                )
            }} />

            <Tabs.Screen name="(profile)/index" options={{
                tabBarShowLabel: false,
                title: "Home", tabBarIcon: ({ color }) => (
                    <CircleUser size={24} color={color} />
                )
            }} />

            <Tabs.Screen name="(more)/index" options={{
                tabBarShowLabel: false,
                title: "Home", tabBarIcon: ({ color }) => (
                    <Clapperboard size={24} color={color} />
                )
            }} />


        </Tabs>
    )
}
export default TabLayout