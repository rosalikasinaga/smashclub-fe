import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Check, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../features/auth/auth.store';
import { useQuery, useMutation } from '@tanstack/react-query';
import { authService } from '../../features/auth/auth.service';
import type { ChangePasswordRequest } from '../../features/auth/auth.types';

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const { token, logout, refreshToken } = useAuthStore();

    // Check session on mount
    const { isLoading, isError } = useQuery({
        queryKey: ['session'],
        queryFn: authService.checkSession,
        retry: false,
    });

    useEffect(() => {
        if (!token || isError) {
            navigate('/login');
        }
    }, [token, isError, navigate]);

    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(refreshToken || ""),
        onSettled: () => {
            logout();
            navigate('/');
        }
    });

    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        let timer: any;
        if (isSuccess && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (isSuccess && countdown === 0) {
            logoutMutation.mutate();
        }
        return () => clearTimeout(timer);
    }, [isSuccess, countdown, logoutMutation]);

    const mutation = useMutation({
        mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
        onSuccess: (res) => {
            if (res.success) {
                setIsSuccess(true);
                setError(null);
            } else {
                setError(res.message || "Gagal mengubah kata sandi.");
            }
        },
        onError: (err: any) => {
            setError(err?.response?.data?.message || err.message || "Terjadi kesalahan server.");
        }
    });

    const passwordCriteria = useMemo(() => ({
        length: passwords.new.length >= 8,
        case: /[a-z]/.test(passwords.new) && /[A-Z]/.test(passwords.new),
        numberSymbol: /[0-9]/.test(passwords.new) || /[^A-Za-z0-9]/.test(passwords.new)
    }), [passwords.new]);

    const strength = useMemo(() => {
        let score = 0;
        if (passwordCriteria.length) score += 33;
        if (passwordCriteria.case) score += 33;
        if (passwordCriteria.numberSymbol) score += 34;
        return score;
    }, [passwordCriteria]);

    const strengthLabel = useMemo(() => {
        if (strength === 0) return { label: 'Lemah', color: 'text-red-500' };
        if (strength <= 33) return { label: 'Cukup', color: 'text-yellow-500' };
        if (strength <= 66) return { label: 'Kuat', color: 'text-primary' };
        return { label: 'Sangat Kuat', color: 'text-[#00d6b5]' };
    }, [strength]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!passwords.current || !passwords.new || !passwords.confirm) {
            setError("Semua field harus diisi.");
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setError("Konfirmasi kata sandi tidak cocok.");
            return;
        }

        if (strength < 100) {
            setError("Kata sandi baru belum memenuhi kriteria keamanan.");
            return;
        }

        mutation.mutate({
            currentPassword: passwords.current,
            newPassword: passwords.new,
            confirmPassword: passwords.confirm
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Memuat Sesi...</p>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
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
                        Kata Sandi Berhasil<br />Diubah
                    </h1>

                    <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-[280px]">
                        Kata sandi Anda telah berhasil diperbarui. Anda akan keluar otomatis dalam <span className="text-primary font-bold">{countdown} detik</span> untuk alasan keamanan.
                    </p>

                    <button
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        className="w-full bg-primary text-background font-bold py-4 rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,214,181,0.2)] flex items-center justify-center gap-2"
                    >
                        {logoutMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Keluar Sekarang"}
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
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2 text-primary hover:brightness-110 transition-all font-bold text-sm mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Pengaturan Akun
                </button>
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-4xl font-black mb-4 tracking-tight">Ganti Kata Sandi</h1>
                        <p className="text-gray-500 text-sm max-w-lg">
                            Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun SmashClub.
                        </p>
                    </div>
                    <button
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        className="px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm hover:bg-red-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {logoutMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Keluar
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSave} className="bg-[#0a1618] border border-white/5 rounded-[40px] p-10 md:p-12 shadow-2xl space-y-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl text-sm mb-6 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}
                    {/* Current Password */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-400 ml-1">Kata Sandi Saat Ini</label>
                        <div className="relative group">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all"
                                placeholder="Masukkan kata sandi lama"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-400 ml-1">Kata Sandi Baru</label>
                        <div className="relative group">
                            <input
                                type={showNew ? "text" : "password"}
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all"
                                placeholder="Buat kata sandi baru"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {/* Strength Indicator */}
                        <div className="pt-2 px-1">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    Kekuatan Kata Sandi: <span className={strengthLabel.color}>{strengthLabel.label}</span>
                                </span>
                                <span className="text-[10px] font-bold text-gray-500">{strength}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#00d6b5] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                                    style={{ width: `${strength}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-400 ml-1">Konfirmasi Kata Sandi Baru</label>
                        <div className="relative group">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all"
                                placeholder="Ulangi kata sandi baru"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Security Instructions */}
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-4">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Instruksi Keamanan</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center transition-colors", passwordCriteria.length ? "bg-primary text-background" : "bg-white/5 text-gray-600")}>
                                    <Check className="w-3 h-3 stroke-[3px]" />
                                </div>
                                <span className={cn("text-xs font-medium transition-colors", passwordCriteria.length ? "text-white" : "text-gray-500")}>Minimal 8 karakter</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center transition-colors", passwordCriteria.case ? "bg-primary text-background" : "bg-white/5 text-gray-600")}>
                                    <Check className="w-3 h-3 stroke-[3px]" />
                                </div>
                                <span className={cn("text-xs font-medium transition-colors", passwordCriteria.case ? "text-white" : "text-gray-500")}>Kombinasi huruf besar & kecil</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center transition-colors", passwordCriteria.numberSymbol ? "bg-primary text-background" : "bg-white/5 text-gray-600")}>
                                    <Check className="w-3 h-3 stroke-[3px]" />
                                </div>
                                <span className={cn("text-xs font-medium transition-colors", passwordCriteria.numberSymbol ? "text-white" : "text-gray-500")}>Termasuk angka atau simbol</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-primary text-background font-black py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(0,214,181,0.15)] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            "Simpan Kata Sandi Baru"
                        )}
                    </button>

                    {/* Forgot Password Link */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            Lupa kata sandi lama? <button type="button" className="text-primary font-bold hover:underline">Hubungi bantuan</button>
                        </p>
                    </div>
                </form>

                {/* Page Footer */}
                <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                    <p>© 2024 SmashClub Indonesia</p>
                    <div className="flex items-center gap-8">
                        <button className="hover:text-white transition-colors">Syarat & Ketentuan</button>
                        <button className="hover:text-white transition-colors">Privasi</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
