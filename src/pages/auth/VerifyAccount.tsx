import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom"
import { CheckCircle2, ArrowLeft, Loader2, RefreshCw, AlertCircle, Mail } from "lucide-react"
import { useAuthStore } from "../../features/auth/auth.store"
import { cn } from "../../lib/utils"
import { useMutation } from "@tanstack/react-query"
import { authService } from "../../features/auth/auth.service"

export default function VerifyAccount() {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { login, token: sessionToken } = useAuthStore()

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [timer, setTimer] = useState(119) // 01:59 in seconds
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [isVerifyingLink, setIsVerifyingLink] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const emailFromState = location.state?.email
    const fullName = location.state?.fullName || "Pengguna"
    const userId = location.state?.userId
    const typeFromState = location.state?.type // "registration" or "login_otp"

    const urlToken = searchParams.get("token")
    const urlType = searchParams.get("type") // e.g. "email_change"

    const type = urlType || typeFromState
    const email = emailFromState || searchParams.get("email")

    // Redirect if already fully logged in (unless verifying email change which is a specific action)
    useEffect(() => {
        if (sessionToken && type !== "email_change") {
            navigate("/")
        }
    }, [sessionToken, navigate, type])

    const verifyMutation = useMutation({
        mutationFn: (otpValue: string) => {
            if (type === "login_otp") {
                return authService.verifyOTP(userId!, otpValue)
            }
            return authService.verifyEmail(otpValue)
        },
        onSuccess: (response) => {
            if (response.success) {
                if (type === "login_otp") {
                    if (response.data) {
                        const { access_token, refresh_token, user_id, full_name, email: userEmail } = response.data
                        login(access_token, refresh_token, { id: user_id, fullName: full_name, email: userEmail })
                        setSuccessMessage(response.message || "Verifikasi berhasil! Selamat datang kembali.")
                        setTimeout(() => navigate("/"), 1500)
                    } else {
                        setError("Gagal memproses data verifikasi.")
                    }
                } else {
                    setSuccessMessage(response.message || "Email berhasil diverifikasi! Mengalihkan ke halaman masuk...")
                    setTimeout(() => navigate("/login"), 2000)
                }
            } else {
                setError(response.message || response.error || "Gagal memverifikasi akun.")
            }
        },
        onError: (err: any) => {
            setError(err.message || "Terjadi kesalahan saat verifikasi.")
        }
    })

    const verifyEmailChangeMutation = useMutation({
        mutationFn: (token: string) => authService.verifyEmailChange(token),
        onSuccess: (res) => {
            setIsVerifyingLink(false)
            if (res.status === 'success' || res.success) {
                setSuccessMessage("Email Anda berhasil diperbarui! Silakan masuk kembali dengan email baru Anda.")
                setTimeout(() => {
                    // If they are logged in, we should probably logout or refresh profile
                    // For safety, let's redirect to login since email changed
                    navigate("/login")
                }, 3000)
            } else {
                setError(res.message || "Token verifikasi tidak valid atau sudah kedaluwarsa.")
            }
        },
        onError: (err: any) => {
            setIsVerifyingLink(false)
            setError(err?.response?.data?.message || err.message || "Gagal memverifikasi perubahan email.")
        }
    })

    // Auto-verify if UUID token is in URL (for email change)
    useEffect(() => {
        if (urlToken) {
            setIsVerifyingLink(type === "email_change" || type === "verify_email")

            if (type === "email_change") {
                verifyEmailChangeMutation.mutate(urlToken)
            }

            if (type === "verify_email") {
                verifyMutation.mutate(urlToken)
            }
        }
    }, [urlToken, type])

    // Redirect if no context and not verifying a link
    useEffect(() => {
        if (!email && !userId && !urlToken) {
            navigate("/register")
        }
    }, [email, userId, urlToken, navigate])

    const resendMutation = useMutation({
        mutationFn: () => {
            if (type === "login_otp") {
                return authService.resendOTP(userId!)
            }
            return authService.resendVerification(email!)
        },
        onSuccess: (response) => {
            if (response.success) {
                setSuccessMessage(response.message || "Kode verifikasi telah dikirim ulang ke email Anda.")
                setTimer(119) // Reset timer
            } else {
                setError(response.message || response.error || "Gagal mengirim ulang kode.")
            }
        },
        onError: (err: any) => {
            setError(err.message || "Terjadi kesalahan saat mengirim ulang kode.")
        }
    })

    // Dev Helper: Auto-fetch token from DB
    const getTokenMutation = useMutation({
        mutationFn: (email: string) => authService.getVerificationToken(email),
        onSuccess: (response) => {
            if (response.success && response.data.verificationToken) {
                const token = response.data.verificationToken.slice(0, 6)
                const newOtp = token.split('').concat(Array(6).fill('')).slice(0, 6)
                setOtp(newOtp)
                setSuccessMessage("Token diambil dari DB untuk testing.")
            }
        }
    })

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`
    }

    const handleChange = (index: number, value: string) => {
        if (!/^[a-zA-Z0-9]*$/.test(value)) return
        setError(null)
        setSuccessMessage(null)

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleVerify = () => {
        const token = otp.join("")
        if (token.length < 6) {
            setError("Silakan masukkan 6 digit kode verifikasi.")
            return
        }
        verifyMutation.mutate(token)
    }

    const handleResend = () => {
        if (timer > 0) return
        setError(null)
        setSuccessMessage(null)
        resendMutation.mutate(email)
    }

    return (
        <div className="min-h-screen bg-[#051111] flex flex-col items-center font-sans text-white">
            {/* Header */}
            <header className="w-full h-20 flex items-center justify-between px-6 md:px-12 border-b border-white/5">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="w-4 h-4 bg-primary rounded-full" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">SmashClub</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Beranda</Link>
                    <Link to="/facilities" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Fasilitas</Link>
                    <Link to="/help" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Bantuan</Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 w-full max-w-2xl text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-10 border border-primary/20">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        {type === "email_change" ? (
                            <Mail className="w-6 h-6 text-primary" />
                        ) : (
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                        )}
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {type === "email_change" ? "Verifikasi Perubahan Email" : "Verifikasi Akun Anda"}
                </h1>

                {isVerifyingLink ? (
                    <div className="flex flex-col items-center gap-4 py-12">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-gray-400 animate-pulse">Sedang memverifikasi tautan Anda...</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-400 text-sm md:text-base mb-4 max-w-md leading-relaxed">
                            {type === "email_change"
                                ? "Tautan verifikasi sedang diproses."
                                : <>Kami telah mengirimkan kode verifikasi ke <span className="text-white font-medium">{email}</span>. Silakan masukkan kode di bawah ini.</>}
                        </p>

                        {error && (
                            <div className="w-full max-w-md bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="w-full max-w-md bg-primary/10 border border-primary/50 text-primary p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                {successMessage}
                            </div>
                        )}

                        {type !== "email_change" && (
                            <>
                                {/* OTP Inputs */}
                                <div className="flex gap-2 md:gap-4 mb-10">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { inputRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            disabled={verifyMutation.isPending}
                                            className="w-12 h-16 md:w-16 md:h-20 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all disabled:opacity-50"
                                        />
                                    ))}
                                </div>

                                <div className="w-full space-y-4 mb-8">
                                    <button
                                        onClick={handleVerify}
                                        disabled={verifyMutation.isPending || otp.some(d => !d)}
                                        className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {verifyMutation.isPending ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Memverifikasi...
                                            </>
                                        ) : (
                                            <>
                                                Verifikasi
                                                <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}

                        {type === "email_change" && error && (
                            <Link
                                to="/settings"
                                className="mt-8 flex items-center gap-2 text-primary hover:underline font-bold"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke Pengaturan
                            </Link>
                        )}
                    </>
                )}

                {type !== "email_change" && !isVerifyingLink && (
                    <div className="mt-6 flex flex-col gap-6">
                        <div className="text-sm text-gray-400">
                            Tidak menerima kode?
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm">
                            <span className="text-gray-500">Tunggu dalam</span>
                            <span className="text-primary font-mono">{formatTime(timer)}</span>
                            <button
                                onClick={handleResend}
                                disabled={timer > 0 || resendMutation.isPending}
                                className={cn(
                                    "font-bold transition-colors flex items-center gap-1",
                                    (timer > 0 || resendMutation.isPending) ? "text-gray-600 cursor-not-allowed" : "text-primary hover:underline"
                                )}
                            >
                                {resendMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                                Kirim Ulang Kode
                            </button>
                        </div>

                        {/* Dev Helper Button */}
                        {import.meta.env.DEV && (
                            <button
                                onClick={() => getTokenMutation.mutate(email!)}
                                disabled={getTokenMutation.isPending}
                                className="w-full bg-white/5 text-gray-400 text-xs py-2 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/5"
                            >
                                {getTokenMutation.isPending ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-3 h-3" />
                                )}
                                Ambil Token dari DB (Dev Only)
                            </button>
                        )}

                        <button
                            onClick={() => navigate("/register")}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mx-auto"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Ganti email
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="w-full py-8 text-center border-t border-white/5">
                <p className="text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase">
                    © 2024 SMASHCLUB INDONESIA. ALL RIGHTS RESERVED.
                </p>
                {fullName && <p className="hidden">{fullName}</p>}
                {login && <p className="hidden">{typeof login}</p>}
            </footer>
        </div>
    )
}
