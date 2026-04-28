import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import CartDrawer from "../../pages/shop/CartDrawer"
import ProfileDrawer from "../../pages/auth/ProfileDrawer"
import BuyNowModal from "../../pages/shop/BuyNowModal"
import AddToCartModal from "../../pages/shop/AddToCartModal"
import { useAuthStore } from "../../features/auth/auth.store"
import { useQuery } from "@tanstack/react-query"
import { authService } from "../../features/auth/auth.service"
import { useWalletStore } from "../../features/wallet/wallet.store"

export default function MainLayout() {
    const { token, updateUser, logout } = useAuthStore();
    const { fetchBalance } = useWalletStore();

    // Sync session on app initialization
    const { data: sessionData, isError, error } = useQuery({
        queryKey: ["session"],
        queryFn: authService.checkSession,
        enabled: !!token,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (token) {
            fetchBalance()
        }
    }, [token, fetchBalance])

    useEffect(() => {
        if (sessionData?.success && sessionData.data) {
            updateUser(sessionData.data)
        } else if (isError) {
            const err = error as any
            if (err.response?.status === 401) {
                logout()
            }
        }
    }, [sessionData, isError, error, updateUser, logout])

    return (
        <div className="min-h-screen flex flex-col bg-background text-white selection:bg-primary selection:text-background font-sans">
            <Navbar />
            <CartDrawer />
            <ProfileDrawer />
            <BuyNowModal />
            <AddToCartModal />
            <main className="flex-1 w-full">

                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
