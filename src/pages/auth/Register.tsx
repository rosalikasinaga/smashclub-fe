import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate, Link } from "react-router-dom"
import { Search, ShoppingBag, Users, Eye, EyeOff, Lock, Mail, User as UserIcon, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../features/auth/auth.store"
import { useMutation } from "@tanstack/react-query"
import { authService } from "../../features/auth/auth.service"

const registerSchema = z.object({
    fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    terms: z.boolean().refine((val) => val === true, "Anda harus menyetujui Syarat & Ketentuan"),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
    const navigate = useNavigate()
    const { token } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)
    const [generalError, setGeneralError] = useState<string | null>(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    // Redirect if already logged in
    useEffect(() => {
        if (token) {
            navigate("/")
        }
    }, [token, navigate])


    const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema)
    })

    const mutation = useMutation({
        mutationFn: authService.register,
        onSuccess: (response) => {
            if (response.success) {
                setShowSuccessModal(true)
            } else {
                // Handle business logic errors
                if (response.error === "Validation failed" && response.details) {
                    Object.entries(response.details).forEach(([key, value]) => {
                        setError(key as keyof RegisterForm, {
                            type: "server",
                            message: value
                        })
                    })
                } else if (response.error === "Email already registered") {
                    setError("email", {
                        type: "server",
                        message: response.message || "Email sudah terdaftar"
                    })
                } else {
                    setGeneralError(response.message || response.error || "Pendaftaran gagal. Silakan coba lagi.")
                }
            }
        },
        onError: (error: any) => {
            setGeneralError(error.message || "Terjadi kesalahan pada server. Silakan coba lagi nanti.")
        }
    })

    const onSubmit = (data: RegisterForm) => {
        setGeneralError(null)
        const { terms, ...registerData } = data
        mutation.mutate(registerData)
    }



    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Side - Benefits (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 p-12 flex-col justify-center bg-[#08181b] relative overflow-hidden">
                {/* Background Overlay */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10" />

                <div className="relative z-10 max-w-lg">
                    <div className="text-primary text-xs font-bold tracking-widest uppercase mb-4">Keuntungan Member</div>
                    <h1 className="text-5xl font-bold text-white mb-12 leading-tight">
                        Nikmati <br /> Pengalaman <br /> Tennis Terbaik
                    </h1>

                    <div className="space-y-8">
                        <BenefitItem
                            icon={<Search className="w-6 h-6 text-background" />}
                            title="Akses Lapangan Tennis Eksklusif"
                            desc="Booking lapangan prioritas dan akses ke area khusus member."
                        />
                        <BenefitItem
                            icon={<ShoppingBag className="w-6 h-6 text-background" />}
                            title="Diskon Raket Tennis"
                            desc="Potongan harga khusus for pembelian raket dan perlengkapan lainnya di pro-shop."
                        />
                        <BenefitItem
                            icon={<Users className="w-6 h-6 text-background" />}
                            title="Komunitas & Sparring"
                            desc="Temukan lawan sparring yang sesuai dengan level permainan Anda."
                        />
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-800">
                        <p className="italic text-gray-400 mb-4">
                            "Kualitas lapangan terbaik dan komunitas yang sangat suportif."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-1 bg-primary rounded-full" />
                            <span className="font-bold text-white">Andi Pratama, Member Sejak 2023</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-24 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <h2 className="text-3xl font-bold text-white mb-2">Daftar Member Tennis</h2>
                    <p className="text-gray-400 mb-8">Bergabunglah dengan komunitas tennis kami dan mulai asah kemampuan Anda.</p>

                    {generalError && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            {generalError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <InputGroup error={errors.fullName?.message}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nama Lengkap</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    {...register("fullName")}
                                    type="text"
                                    placeholder="Masukkan nama lengkap Anda"
                                    className={cn(
                                        "w-full bg-[#16282a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                        errors.fullName && "border-red-500 focus:ring-red-500"
                                    )}
                                />
                            </div>
                        </InputGroup>

                        <InputGroup error={errors.email?.message}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    {...register("email")}
                                    type="email"
                                    placeholder="contoh@email.com"
                                    className={cn(
                                        "w-full bg-[#16282a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                        errors.email && "border-red-500 focus:ring-red-500"
                                    )}
                                />
                            </div>
                        </InputGroup>

                        <InputGroup error={errors.password?.message}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Kata Sandi</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimal 8 karakter"
                                    className={cn(
                                        "w-full bg-[#16282a] border border-gray-700 rounded-lg py-3 pl-10 pr-10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                        errors.password && "border-red-500 focus:ring-red-500"
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </InputGroup>

                        <div className="flex items-start gap-3 pt-2">
                            <div className="flex items-center h-5">
                                <input
                                    {...register("terms")}
                                    id="terms"
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-gray-600 bg-[#16282a] text-primary focus:ring-primary/50"
                                />
                            </div>
                            <label htmlFor="terms" className="text-sm text-gray-400 leading-tight">
                                Saya menyetujui <a href="#" className="text-primary hover:underline">Syarat dan Ketentuan</a> serta <a href="#" className="text-primary hover:underline">Kebijakan Privasi</a> TennisClub.
                            </label>
                        </div>
                        {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>}

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full bg-primary text-background font-bold py-3.5 rounded-lg hover:bg-primary/90 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {mutation.isPending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                    Mendaftarkan...
                                </>
                            ) : (
                                <>
                                    Daftar Sekarang
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-400 text-sm mt-8">
                        Sudah punya akun? <Link to="/login" className="text-primary font-bold hover:underline">Masuk ke Akun</Link>
                    </p>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
                    <div className="relative bg-[#16282a] border border-white/10 w-full max-w-md rounded-[2rem] p-10 text-center shadow-2xl overflow-hidden group">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-[60px]" />

                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 relative border border-primary/20">
                            <Mail className="w-10 h-10 text-primary" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-4 border-[#16282a]" />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tighter">
                            Check Your <span className="text-primary">Email!</span>
                        </h3>

                        <div className="space-y-4 mb-10">
                            <p className="text-gray-400 font-medium leading-relaxed">
                                Kami telah mengirimkan link verifikasi ke email Anda. Silakan klik link tersebut untuk mengaktifkan akun.
                            </p>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                                Periksa juga folder Spam jika tidak menemukannya.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-primary text-background font-black py-4 rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(0,214,181,0.2)] active:scale-95 uppercase tracking-widest text-xs"
                        >
                            Ke Halaman Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function BenefitItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0f2a2e] flex items-center justify-center flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-800 to-transparent flex items-center justify-center">
                    <div className="bg-primary p-2 rounded-lg">
                        {icon}
                    </div>
                </div>
            </div>
            <div>
                <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{desc}</p>
            </div>
        </div>
    )
}

function InputGroup({ children, error }: { children: React.ReactNode, error?: string }) {
    return (
        <div>
            {children}
            {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
        </div>
    )
}
