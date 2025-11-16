import { CreateUserPrams, SignInParams } from "@/type"
import { Account, Avatars, Client, ID, Query, TablesDB } from "react-native-appwrite"

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: 'com.malachi.foodapp',
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    userTableId: 'user'
}

export const client = new Client()

client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId).setPlatform(appwriteConfig.platform)

export const account = new Account(client)

export const tableDB = new TablesDB(client)

const avatars = new Avatars(client)

export const createUser = async ({ name, email, password }: CreateUserPrams) => {
    try {
        // await account.deleteSessions();
        const newAcc = await account.create({ userId: ID.unique(), email, password, name })

        if (!newAcc) throw new Error("failed to create account")

        await account.createEmailPasswordSession({ email, password })

        const avatarUrl = avatars.getInitialsURL()

        return await tableDB.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            rowId: newAcc.$id,
            data: {
                name,
                email,
                accountId: newAcc.$id,
                avatar: avatarUrl,
            },
            permissions: [
                `read("user:${newAcc.$id}")`,
                `update("user:${newAcc.$id}")`,
                `delete("user:${newAcc.$id}")`
            ]
        })
    } catch (error) {
        throw new Error(error as string)
    }
}


export const signIn = async ({ email, password }: SignInParams) => {
    try {
        return await account.createEmailPasswordSession({ email, password })
    } catch (error) {
        throw new Error(error as string)
    }
}


export const getAuthUser = async () => {
    try {
        const currentAccount = await account.get()

        if (!currentAccount) throw Error;

        const currentUser = await tableDB.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            queries: [Query.equal('accountId', currentAccount.$id)]
        })

        if (!currentUser) throw Error;

        return currentUser.rows[0]
    } catch (error) {
        throw new Error(error as string)
    }
}