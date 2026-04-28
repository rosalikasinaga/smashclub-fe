export interface RegisterRequest {
    fullName: string
    email: string
    password: string
}

export interface RegisterResponse {
    success: boolean
    message?: string
    data?: {
        id: string
    }
    error?: string
    details?: Record<string, string>
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    success: boolean
    message?: string
    data?: {
        userId: string
        fullName?: string
        email: string
        accessToken?: string
        refreshToken?: string
        expiresIn?: number
        requiresOtp?: boolean
        otpExpiresIn?: number
    }
    error?: string
}

export interface VerifyOTPResponse {
    success: boolean
    message?: string
    data?: {
        access_token: string
        refresh_token: string
        token_type: string
        expires_in: number
        user_id: string
        email: string
        full_name: string
    }
    error?: string
}

export interface LogoutResponse {
    success: boolean
    message?: string
    data?: string
    status?: number
    timestamp?: string
    error?: string
}

export interface ProfileResponse {
    status: string
    message?: string
    success: boolean
    data?: {
        id: number
        name: string
        fullName?: string
        email: string
        role: string
        createdAt: string
        pendingEmail?: string
        avatar?: string
    }
}

export interface UpdateProfileRequest {
    fullName: string
    email?: string
}

export interface UpdateProfileResponse {
    status: string
    message: string
    success: boolean
    data?: {
        id: number
        fullName: string
        email: string
        role: string
        avatar?: string
    }
}

export interface ChangePasswordRequest {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

export interface ChangePasswordResponse {
    status: string
    message: string
    success: boolean
}

export interface WalletLog {
    id: number
    previousBalance: number
    currentBalance: number
    usageValue: number
    usageType: boolean
    refID: string
    createdAt: string
}

export interface WalletBalanceResponse {
    data?: {
        walletLog: WalletLog[]
        userBalance: number
    }
    success: boolean
    message: string
    status: number
    timestamp: string
}

export interface UploadProfilePictureRequest {
    profilePicture: File
}

export interface UploadProfilePictureResponse {
    data: {
        profilePicture: string
        message: string
        userId: string
    }
    success: boolean
    message: string
    status: number
    timestamp: string
}
