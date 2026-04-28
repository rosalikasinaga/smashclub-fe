import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Info, CheckCircle2, Loader2, AlertCircle, Check, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../features/auth/auth.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../features/auth/auth.service';

export default function ChangeEmailPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [isSuccess, setIsSuccess] = useState(false);
    // const [countdown, setCountdown] = useState(10);

    const queryClient = useQueryClient();
    const [newEmail, setNewEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: (data: { email: string, fullName: string }) => authService.updateProfile(data),
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ['profile'] });
                setIsSuccess(true);
            } else {
                setError(res.message || "Gagal mengubah email.");
            }
        },
        onError: (err: any) => {
            setError(err.message || "Terjadi kesalahan pada server.");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!user?.email) {
            setError("Email tidak ditemukan. Silakan hubungi admin.");
            return;
        }

        mutation.mutate({
            email: newEmail,
            fullName: user.full_name
        });
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-white">
                <div className="w-full max-w-md bg-[#0a1618] border border-white/5 rounded-[40px] p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
                    {/* Subtle glow effect */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full" />

                    <div className="relative mb-8">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl animate-pulse" />
                            <Check className="w-12 h-12 text-primary relative z-10 stroke-[3px]" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">
                        Email Berhasil<br />Diperbarui
                    </h1>

                    <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-[280px]">
                        Permintaan perubahan email berhasil dikirim.
                    </p>

                    <button
                        onClick={() => navigate('/settings')}
                        className="w-full bg-primary text-background font-bold py-4 rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,214,181,0.2)] flex items-center justify-center gap-2"
                    >
                        Kembali ke Pengaturan Akun
                    </button>

                    <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-gray-600 tracking-[0.2em] uppercase">
                        <ShieldCheck className="w-3 h-3" />
                        SmashClub Security
                    </div>
                </div>

                <div className="mt-12 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    © 2024 SmashClub Indonesia. Seluruh hak cipta dilindungi.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white font-sans pb-20">
            {/* Header / Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2 text-primary hover:brightness-110 transition-all font-bold text-sm mb-12"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Pengaturan Akun
                </button>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#0a1618] border border-white/5 rounded-[40px] p-10 md:p-12 shadow-2xl">
                    <h1 className="text-4xl font-black mb-4 tracking-tight">Ubah Alamat Email</h1>
                    <p className="text-gray-500 text-sm mb-8">
                        Pastikan email baru Anda aktif untuk menerima verifikasi keamanan.
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl text-sm flex items-center gap-3 mb-8">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Current Email */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 ml-1">Email Saat Ini</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">
                                    <span className="text-xl">@</span>
                                </span>
                                <input
                                    type="text"
                                    readOnly
                                    value={user?.email || 'user.atlet@smashclub.com'}
                                    className="w-full bg-black/20 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-gray-500 cursor-not-allowed focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* New Email */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 ml-1">Alamat Email Baru</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Mail className="w-5 h-5" />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Masukkan alamat email baru"
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-700"
                                />
                            </div>
                        </div>


                        {/* Info Box */}
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex gap-4">
                            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                Anda akan menerima tautan konfirmasi di alamat email baru. Perubahan tidak akan berlaku sampai Anda melakukan verifikasi.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full bg-primary text-background font-black py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(0,214,181,0.15)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    Ubah Email <CheckCircle2 className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center text-sm text-gray-600 font-medium">
                    Butuh bantuan? Hubungi <button className="text-primary hover:underline font-bold">Pusat Bantuan SmashClub</button>
                </div>
            </div>
        </div>
    );
}
