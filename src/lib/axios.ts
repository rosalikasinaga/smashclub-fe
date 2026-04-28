import axios from "axios"
import { useAuthStore } from "../features/auth/auth.store"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
})

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = useAuthStore.getState().refreshToken
                if (!refreshToken) throw new Error("No refresh token")

                // Call refresh token API directly to avoid interceptor loop
                const response = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {
                    refreshToken
                })

                if (response.data.success) {
                    const { accessToken, refreshToken: newRefreshToken } = response.data.data
                    useAuthStore.getState().setToken(accessToken, newRefreshToken)

                    // Update header and retry
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                    return api(originalRequest)
                }
            } catch (refreshError) {
                // If refresh fails, logout user
                useAuthStore.getState().logout()
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)
