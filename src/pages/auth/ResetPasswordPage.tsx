import { useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { authService } from "../../features/auth/auth.service"
import { cn } from "../../lib/utils"

const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [generalError, setGeneralError] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema)
    })

    // 1. Validate Token on Mount
    const { isLoading: isValidating, data: validationResult } = useQuery({
        queryKey: ["validate-token", token],
        queryFn: () => authService.validateResetToken(token!),
        enabled: !!token,
        retry: false,
    })

    const resetMutation = useMutation({
        mutationFn: (password: string) => authService.resetPassword(token!, password),
        onSuccess: (response) => {
            if (response.status === "success" || response.success || response.status === 200) {
                setIsSuccess(true)
            } else {
                setGeneralError(response.message || "Gagal mengatur ulang kata sandi.")
            }
        },
        onError: (err: any) => {
            setGeneralError(err?.response?.data?.message || err.message || "Terjadi kesalahan pada server.")
        }
    })

    const onSubmit = (data: ResetPasswordForm) => {
        setGeneralError(null)
        resetMutation.mutate(data.password)
    }

    if (!token) {
        return (
            <AuthWrapper>
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
                    <h2 className="text-2xl font-bold text-white mb-4">Token Tidak Ditemukan</h2>
                    <p className="text-gray-400 mb-8">Tautan tidak valid atau sudah kedaluwarsa.</p>
                    <Link to="/forgot-password" className="text-primary font-bold hover:underline">
                        Minta Tautan Baru
                    </Link>
                </div>
            </AuthWrapper>
        )
    }

    if (isValidating) {
        return (
            <AuthWrapper>
                <div className="flex flex-col items-center py-10">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-gray-400">Memverifikasi tautan...</p>
                </div>
            </AuthWrapper>
        )
    }

    // Token check - if API returns success: false or unexpected format
    const isTokenValid = validationResult && (validationResult.success === true || validationResult.status === 200);
    const tokenMessage = validationResult?.message || "Token reset tidak valid atau sudah kedaluwarsa.";

    if (!isTokenValid) {
        return (
            <AuthWrapper>
                <div className="text-center border border-red-500/20 bg-red-500/5 p-8 rounded-[32px]">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Gagal Memverifikasi</h2>
                    <p className="text-red-400/80 mb-8 px-4">{tokenMessage}</p>
                    <Link
                        to="/forgot-password"
                        className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-all border border-white/5 font-medium"
                    >
                        Minta Tautan Baru
                    </Link>
                </div>
            </AuthWrapper>
        )
    }

    if (isSuccess) {
        return (
            <AuthWrapper>
                <div className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 mx-auto border border-primary/20">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Berhasil!</h2>
                    <p className="text-gray-400 mb-10 max-w-xs mx-auto">
                        Kata sandi Anda telah berhasil diubah. Silakan masuk menggunakan kata sandi baru Anda.
                    </p>
                    <Link
                        to="/login"
                        className="w-full block bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.15)]"
                    >
                        Masuk Sekarang
                    </Link>
                </div>
            </AuthWrapper>
        )
    }

    return (
        <AuthWrapper>
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Atur Ulang Kata Sandi</h2>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                    Silakan buat kata sandi baru yang kuat untuk keamanan akun Anda.
                </p>
            </div>

            {generalError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {generalError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Kata Sandi Baru</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Minimal 8 karakter"
                            className={cn(
                                "w-full bg-[#16282a] border border-gray-700/50 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                errors.password && "border-red-500/50"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-2 ml-1">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Konfirmasi Kata Sandi</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            {...register("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Ulangi kata sandi"
                            className={cn(
                                "w-full bg-[#16282a] border border-gray-700/50 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                errors.confirmPassword && "border-red-500/50"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-2 ml-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={resetMutation.isPending}
                    className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.15)] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {resetMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    Simpan Kata Sandi
                </button>
            </form>
        </AuthWrapper>
    )
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#051111] flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-lg bg-[#0a1a1a] p-8 md:p-12 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

                <div className="flex items-center justify-center gap-2 mb-10">
                    <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="w-3 h-3 bg-primary rounded-full" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white uppercase">SmashClub</span>
                </div>

                {children}

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-[9px] text-gray-600 font-bold tracking-[0.2em] uppercase">
                        © 2024 SMASHCLUB APP. SEMUA HAK DILINDUNGI.
                    </p>
                </div>
            </div>
        </div>
    )
}
