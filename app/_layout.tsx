import useAuthStore from "@/auth.store";
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";

export default function RootLayout() {
  const { isLoading, fetchAuthUser } = useAuthStore()

  const [fontsLoaded, error] = useFonts({
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Light': require('../assets/fonts/Quicksand-Light.ttf'),
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Semibold': require('../assets/fonts/Quicksand-SemiBold.ttf')
  })

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded, error])

  useEffect(() => {
    fetchAuthUser()
  }, [])

  if (!fontsLoaded || isLoading) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
