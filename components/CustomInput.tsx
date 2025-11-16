import { CustomInputProps } from '@/type'
import cn from 'clsx'
import React, { useState } from 'react'
import { Text, TextInput, View } from 'react-native'


const CustomInput = ({placeholder, value, onChangeText, label, secureTextEntry, keyboardType, style}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState<boolean>(false)
    return (
        <View className='w-full'>
            <Text className='label'>{label}</Text>

            <TextInput
                autoCapitalize='none'
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                placeholderTextColor={"#888"}
                className={cn("input", isFocused ? 'border-primary' : 'border-gray-300', style)}
            />  
        </View>
    )
}

export default CustomInput