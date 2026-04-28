import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { encrypt, decrypt } from "../../lib/encryption"

type AuthState = {
    token: string | null
    refreshToken: string | null
    user: any
    isProfileOpen: boolean
    login: (token: string, refreshToken: string, user: any) => void
    logout: () => void
    setToken: (token: string, refreshToken?: string) => void
    toggleProfile: (open?: boolean) => void
    updateUser: (user: any) => void
}

const encryptedStorage = {
    getItem: (name: string): string | null => {
        const storedValue = localStorage.getItem(name);
        if (!storedValue) return null;

        try {
            const decrypted = decrypt(storedValue);
            // Verify it's valid JSON
            JSON.parse(decrypted);
            return decrypted;
        } catch (error) {
            // If decryption or parsing failed, check if it's already valid JSON (unencrypted)
            try {
                JSON.parse(storedValue);
                return storedValue; // Return as is, it will be encrypted on next setItem
            } catch (e) {
                return null;
            }
        }
    },
    setItem: (name: string, value: string): void => {
        const encryptedValue = encrypt(value);
        localStorage.setItem(name, encryptedValue);
    },
    removeItem: (name: string): void => {
        localStorage.removeItem(name);
    }
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            refreshToken: null,
            user: null,
            isProfileOpen: false,
            login: (token, refreshToken, user) => set({ token, refreshToken, user }),
            logout: () => {
                set({ token: null, refreshToken: null, user: null, isProfileOpen: false });
                localStorage.removeItem('auth-storage');
                localStorage.removeItem('wallet-storage');
            },
            setToken: (token, refreshToken) => set((state) => ({
                token,
                refreshToken: refreshToken || state.refreshToken
            })),
            toggleProfile: (open) => set((state) => ({
                isProfileOpen: open !== undefined ? open : !state.isProfileOpen
            })),
            updateUser: (user) => set((state) => ({
                user: { ...state.user, ...user }
            })),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => encryptedStorage),
        }
    )
)
