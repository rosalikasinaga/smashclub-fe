import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"
import { Mail, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { cn } from "../../lib/utils"

import { useMutation } from "@tanstack/react-query"
import { authService } from "../../features/auth/auth.service"

const forgotPasswordSchema = z.object({
    email: z.string().email("Email tidak valid"),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema)
    })

    const mutation = useMutation({
        mutationFn: (email: string) => authService.forgotPassword(email),
        onSuccess: (response) => {
            if (response.success) {
                setIsSubmitted(true)
            } else {
                setError(response.message || response.error || "Gagal mengirim permintaan. Silakan coba lagi.")
            }
        },
        onError: (err: any) => {
            setError(err.message || "Terjadi kesalahan pada server. Silakan coba lagi nanti.")
        }
    })

    const onSubmit = (data: ForgotPasswordForm) => {
        setError(null)
        mutation.mutate(data.email)
    }

    return (
        <div className="min-h-screen bg-[#051111] flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-lg bg-[#0a1a1a] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl text-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

                <div className="mb-10 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                            <div className="w-3 h-3 bg-primary rounded-full" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white uppercase">SmashClub</span>
                    </div>

                    {!isSubmitted ? (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-4">Lupa Kata Sandi</h2>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-10 max-w-sm">
                                Masukkan email terdaftar Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
                            </p>

                            {error && (
                                <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                                <div className="text-left">
                                    <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            {...register("email")}
                                            type="email"
                                            placeholder="nama@email.com"
                                            disabled={mutation.isPending}
                                            className={cn(
                                                "w-full bg-[#16282a] border border-gray-700/50 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm md:text-base disabled:opacity-50",
                                                errors.email && "border-red-500/50 focus:ring-red-500/30"
                                            )}
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-2 ml-1">{errors.email.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.15)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                            Mengirim...
                                        </>
                                    ) : (
                                        "Kirim Tautan Reset"
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="py-8">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-primary/20">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Email Terkirim!</h2>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                                Tautan pengaturan ulang kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.
                            </p>
                        </div>
                    )}

                    <div className="mt-10">
                        <Link to="/login" className="text-sm text-primary font-bold hover:underline transition-all">
                            Kembali ke Halaman Masuk
                        </Link>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                    <p className="text-[9px] text-gray-600 font-bold tracking-[0.2em] uppercase">
                        © 2024 SMASHCLUB APP. SEMUA HAK DILINDUNGI.
                    </p>
                </div>
            </div>
        </div>
    )
}
