import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useLocation } from "react-router-dom"
import { Mail, CheckCircle2, ArrowRight, MessageSquare, Headphones } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "../../lib/utils"

import { useMutation } from "@tanstack/react-query"
import { authService } from "../../features/auth/auth.service"

const resendActivationSchema = z.object({
    email: z.string().email("Email tidak valid")
})

type ResendActivationForm = z.infer<typeof resendActivationSchema>

export default function ResendActivationPage() {
    const location = useLocation()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ResendActivationForm>({
        resolver: zodResolver(resendActivationSchema)
    })

    // Pre-fill email if passed from login
    useEffect(() => {
        if (location.state?.email) {
            setValue("email", location.state.email)
        }
    }, [location.state, setValue])

    const mutation = useMutation({
        mutationFn: (email: string) => authService.resendVerification(email),
        onSuccess: (response) => {
            if (response.success) {
                setIsSubmitted(true)
            } else {
                setError(response.message || response.error || "Gagal mengirim ulang email aktivasi. Silakan coba lagi.")
            }
        },
        onError: (err: any) => {
            setError(err.message || "Terjadi kesalahan pada server. Silakan coba lagi nanti.")
        }
    })

    const onSubmit = (data: ResendActivationForm) => {
        setError(null)
        mutation.mutate(data.email)
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans relative">
            {/* Header / Logo */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center rotate-12">
                    <div className="w-4 h-4 rounded-full border-2 border-background" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white italic">SmashClub</span>
            </div>

            <div className="absolute top-8 right-8 flex items-center gap-6">
                <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">Bantuan</button>
                <Link to="/register" className="bg-card text-primary px-5 py-2 rounded-lg text-sm font-bold border border-primary/20 hover:bg-primary/5 transition-all">Daftar</Link>
            </div>

            <div className="w-full max-w-xl bg-card/80 backdrop-blur-sm p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center mt-12">
                {/* Decorative top border gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

                <div className="w-full max-w-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-primary" />
                        </div>
                    </div>

                    {!isSubmitted ? (
                        <>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">Kirim Ulang Email Aktivasi</h2>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8 text-center">
                                Masukkan alamat email yang terdaftar pada akun SmashClub Anda. Kami akan mengirimkan tautan aktivasi baru ke kotak masuk Anda.
                            </p>

                            {error && (
                                <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-2 ml-1">
                                        <span className="text-gray-400 text-sm">@</span>
                                        <label className="text-sm font-bold text-gray-300">Alamat Email</label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            {...register("email")}
                                            type="email"
                                            placeholder="nama@email.com"
                                            disabled={mutation.isPending}
                                            className={cn(
                                                "w-full bg-background border border-gray-800 rounded-xl py-4 px-4 text-white placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm disabled:opacity-50",
                                                errors.email && "border-red-500/50 focus:ring-red-500/30"
                                            )}
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-2 ml-1">{errors.email.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.15)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            Kirim Ulang Email
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="py-8 text-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-primary/20">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Email Aktivasi Terkirim!</h2>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                                Tautan aktivasi baru telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500 mb-4 font-medium italic">Tidak menerima email? Periksa folder spam Anda.</p>
                        <Link to="/login" className="text-primary text-sm font-bold hover:underline transition-all flex items-center gap-2 justify-center">
                            <span className="text-xs">←</span> Sudah aktif? Kembali ke Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 w-full max-w-sm flex flex-col items-center">
                <div className="flex items-center gap-4 w-full mb-8">
                    <div className="h-[1px] bg-gray-800 flex-1" />
                    <span className="text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase">Hubungi Kami</span>
                    <div className="h-[1px] bg-gray-800 flex-1" />
                </div>

                <div className="flex gap-4 mb-12">
                    <button className="w-12 h-12 rounded-full bg-[#16282a] border border-white/5 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/20 transition-all">
                        <Headphones className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-[#16282a] border border-white/5 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/20 transition-all">
                        <MessageSquare className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-[9px] text-gray-700 font-medium tracking-wider text-center">
                    © 2024 SmashClub. Seluruh hak cipta dilindungi undang-undang.
                </p>
            </div>
        </div>
    )
}
