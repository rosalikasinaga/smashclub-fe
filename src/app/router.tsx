import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "../components/layout/MainLayout"
import Home from "../pages/Home"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import VerifyAccount from "../pages/auth/VerifyAccount"
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage"
import BookingPage from "../pages/booking/BookingPage"
import BookingSchedulePage from "../pages/booking/BookingSchedulePage"
import CheckoutPage from "../pages/booking/CheckoutPage"
import BookingCancelPage from "../pages/booking/BookingCancelPage"
import StorePage from "../pages/shop/StorePage"
import ProductDetailPage from "../pages/shop/ProductDetailPage"
import ShopCheckoutPage from "../pages/shop/ShopCheckoutPage"
import ShopOrderDetailPage from "../pages/shop/ShopOrderDetailPage"
import ShopOrderHistoryPage from "../pages/shop/ShopOrderHistoryPage"
import ShopOrderCancelPage from "../pages/shop/ShopOrderCancelPage"
import BookingHistoryPage from "../pages/booking/BookingHistoryPage"
import BookingRefundPage from "../pages/booking/BookingRefundPage"
import BookingRefundDetailPage from "../pages/booking/BookingCancelRefundDetailPage"
import ShopOrderRefundPage from "../pages/shop/ShopOrderRefundPage"
import ShopRefundDetailPage from "../pages/shop/ShopRefundDetailPage"
import EditProfilePage from "../pages/auth/EditPicturePage"
import SettingsPage from "../pages/auth/SettingsPage"
import ChangePasswordPage from "../pages/auth/ChangePasswordPage"
import ChangeEmailPage from "../pages/auth/ChangeEmailPage"
import ResetPasswordPage from "../pages/auth/ResetPasswordPage"
import ResendActivationPage from "../pages/auth/ResendActivationPage"
import BookingHistoryDetailPage from "../pages/booking/BookingHistoryDetailPage"
import CommunityPage from "../pages/CommunityPage"
import NotFoundPage from "../pages/NotFoundPage"
import TransactionListPage from "../pages/transaction/TransactionListPage"
import TopUpPage from "../pages/transaction/TopUpPage"
import TopUpHistoryPage from "../pages/transaction/TopUpHistoryPage"
import TopUpHistoryDetailPage from "../pages/transaction/TopUpHistoryDetailPage"

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFoundPage />,
        children: [
            { path: "/", element: <Home /> },
            { path: "profile", element: <EditProfilePage /> },
            { path: "settings", element: <SettingsPage /> },
            { path: "settings/change-password", element: <ChangePasswordPage /> },
            { path: "settings/change-email", element: <ChangeEmailPage /> },
            { path: "booking", element: <BookingPage /> },
            { path: "booking/schedule/:courtId", element: <BookingSchedulePage /> },
            { path: "booking/checkout/:courtId", element: <CheckoutPage /> },
            { path: "booking/success", element: <BookingHistoryDetailPage /> }, // Mock success to detail
            { path: "booking/:id", element: <BookingHistoryDetailPage /> },
            { path: "booking/:id/cancel", element: <BookingCancelPage /> },
            { path: "booking/:id/refund", element: <BookingRefundPage /> },
            { path: "booking/:id/refund-details", element: <BookingRefundDetailPage /> },
            { path: "booking-history", element: <BookingHistoryPage /> },
            { path: "transactions", element: <TransactionListPage /> },
            { path: "orders/:id", element: <BookingHistoryDetailPage /> },
            // Shop
            { path: "shop", element: <StorePage /> },
            { path: "shop/:productId", element: <ProductDetailPage /> },
            { path: "shop/checkout", element: <ShopCheckoutPage /> },
            { path: "shop/order/:id", element: <ShopOrderDetailPage /> },
            { path: "shop/order/:id/cancel", element: <ShopOrderCancelPage /> },
            { path: "shop/order/:id/refund", element: <ShopOrderRefundPage /> },
            { path: "shop/order/:id/refund-details", element: <ShopRefundDetailPage /> },
            { path: "shop/orders", element: <ShopOrderHistoryPage /> },
            { path: "community", element: <CommunityPage /> },
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/verify",
        element: <VerifyAccount />
    },
    {
        path: "/forgot-password",
        element: <ForgotPasswordPage />
    },
    {
        path: "/resend-verification",
        element: <ResendActivationPage />
    },
    {
        path: "/reset-password",
        element: <ResetPasswordPage />
    },
    {
        path: "/top-up",
        element: <TopUpPage />
    },
    {
        path: "/top-up/history",
        element: <TopUpHistoryPage />
    },
    {
        path: "/top-up/history/:id",
        element: <TopUpHistoryDetailPage />
    },
])



export default function AppRouter() {
    return <RouterProvider router={router} />
}
