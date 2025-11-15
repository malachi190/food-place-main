import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Slot } from 'expo-router'

const RootLayout = () => {
    const isAuthenticated = false;

    if (!isAuthenticated) return <Redirect href={"/(auth)/sign-in"} />

    return <Slot />
}

export default RootLayout