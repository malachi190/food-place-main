import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { signIn } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [form, setForm] = useState({ email: '', password: '' })

    const onSubmit = async () => {
        const { email, password } = form
        if (!email || !password) return Alert.alert('Error', "Please enter valid email & password")

        setIsSubmitting(true)

        try {
            await signIn({ email, password })
            router.replace('/')
        } catch (error: any) {
            Alert.alert('Error', error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <View className='flex-1 mt-10 px-5'>
            <CustomInput
                placeholder='Enter your email address'
                value={form.email}
                onChangeText={(value) => setForm((prev) => ({ ...prev, email: value }))}
                label='Email'
                keyboardType='email-address'
                style={"mb-10"}
            />
            <CustomInput
                placeholder='Enter your password'
                value={form.password}
                onChangeText={(value) => setForm((prev) => ({ ...prev, password: value }))}
                label='Password'
                secureTextEntry={true}
                style={"mb-10"}
            />
            <CustomButton
                title='Login'
                textStyle='text-xl'
                isLoading={isSubmitting}
                onPress={onSubmit}
            />

            <View className='flex justify-center flex-row items-center gap-1.5 mt-3'>
                <Text className='base-regular text-gray-100'>
                    Don't have an account?
                </Text>
                <Link href={"/(auth)/sign-up"} className='base-bold text-primary'>Sign Up</Link>
            </View>
        </View>
    )
}

export default SignIn