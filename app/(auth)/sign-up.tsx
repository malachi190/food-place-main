import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [form, setForm] = useState({ name: '', email: '', password: '' })

    const onSubmit = async () => {
        const { name, email, password } = form

        if (!name || !email || !password) return Alert.alert('Error', "Please make sure all fields are filled.")

        setIsSubmitting(true)

        try {
            await createUser({ name, email, password })
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
                placeholder='Enter your full name'
                value={form.name}
                onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))}
                label='Fullname'
                style={"mb-10"}
            />
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
                title='Sign Up'
                textStyle='text-xl'
                isLoading={isSubmitting}
                onPress={onSubmit}
            />

            <View className='flex justify-center flex-row items-center gap-1.5 mt-3'>
                <Text className='base-regular text-gray-100'>
                    Already have an account?
                </Text>
                <Link href={"/(auth)/sign-in"} className='base-bold text-primary'>Log In</Link>
            </View>
        </View>
    )
}

export default SignUp