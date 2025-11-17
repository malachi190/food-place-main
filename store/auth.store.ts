import { create } from 'zustand'
import { getAuthUser } from '../lib/appwrite'
import { User } from '../type'

type AuthState = {
    isAuthenticated: boolean
    user: any | null
    isLoading: boolean
    setIsAuthenticated: (value: boolean) => void
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    fetchAuthUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    setUser: (user) => set({ user: user }),
    setLoading: (loading) => set({ isLoading: loading }),
    fetchAuthUser: async () => {
        set({ isLoading: true })

        try {
            const user = await getAuthUser()
            if (user) set({ isAuthenticated: true, user: user as any })
            else set({ isAuthenticated: false, user: null })
        } catch (error) {
            console.log("error fetching user", error);
            set({ isAuthenticated: false, user: null })
        } finally {
            set({ isLoading: false })
        }

    }
}))

export default useAuthStore;