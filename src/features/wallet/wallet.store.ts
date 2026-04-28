import { create } from "zustand"
import { walletService } from "./wallet.service"
import { persist, createJSONStorage } from "zustand/middleware"
import { encrypt, decrypt } from "../../lib/encryption"
import type { WalletLog } from "./wallet.types"

interface WalletState {
    balance: number
    logs: WalletLog[]
    isLoading: boolean
    fetchBalance: () => Promise<void>
    setBalance: (amount: number) => void
}

const encryptedStorage = {
    getItem: (name: string): string | null => {
        const storedValue = localStorage.getItem(name);
        if (!storedValue) return null;
        try {
            return decrypt(storedValue);
        } catch (error) {
            return null;
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

export const useWalletStore = create<WalletState>()(
    persist(
        (set) => ({
            balance: 0,
            logs: [],
            isLoading: false,
            fetchBalance: async () => {
                set({ isLoading: true });
                try {
                    const response = await walletService.getWalletBalance();
                    if (response.success && response.data) {
                        set({
                            balance: response.data.userBalance || 0,
                            logs: Array.isArray(response.data.walletLog) ? response.data.walletLog : []
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch wallet balance:", error);
                } finally {
                    set({ isLoading: false });
                }
            },
            setBalance: (amount) => set({ balance: amount }),
        }),
        {
            name: "wallet-storage",
            storage: createJSONStorage(() => encryptedStorage),
        }
    )
)
