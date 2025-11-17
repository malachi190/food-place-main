import { images } from '@/constants'
import useAuthStore from '@/store/auth.store'
import { TabBarIconProps } from '@/type'
import cn from 'clsx'
import { Redirect, Tabs } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'

const TabIcon = ({ focused, icon, title }: TabBarIconProps) => {
    return <View className='tab-icon'>
        <Image source={icon} resizeMode='contain' className='size-8' tintColor={focused ? '#FE8C00' : '#5D5F6D'} />
        <Text className={cn('text-sm font-bold', focused ? 'text-primary' : 'text-gray-200')}>
            {title}
        </Text>
    </View>
}

const RootLayout = () => {
    const { isAuthenticated } = useAuthStore()

    if (!isAuthenticated) return <Redirect href={"/(auth)/sign-in"} />

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    marginHorizontal: 20,
                    height: 75,
                    position: 'absolute',
                    bottom: 40,
                    backgroundColor: "white",
                    shadowColor: "#1a1a1a",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5
                }
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} title='Home' icon={images.home} />
                }}
            />
            <Tabs.Screen
                name='search'
                options={{
                    title: 'Search',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} title='Search' icon={images.search} />
                }}
            />
            <Tabs.Screen
                name='cart'
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} title='Cart' icon={images.bag} />
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} title='Profile' icon={images.person} />
                }}
            />
        </Tabs>)
}

export default RootLayout