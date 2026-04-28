import { ArrowLeft, User, Mail, Lock, ChevronRight, Check, Loader2, AlertCircle, XCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/auth.store';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../features/auth/auth.service';

export default function SettingsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { user, updateUser } = useAuthStore();

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.fullName || '');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(location.state?.message || null);

    // Clear state message once read
    useEffect(() => {
        if (location.state?.message) {
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Sync state with user data
    useEffect(() => {
        if (user) {
            setNewName(user.fullName || '');
        }
    }, [user]);

    // Load profile data on mount
    const { data: profileResponse, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: authService.getProfile,
        select: (res) => res.data
    });

    // Update store when profile changes
    useEffect(() => {
        if (profileResponse) {
            console.log(profileResponse)
            updateUser({
                ...profileResponse,
            });
        }
    }, [profileResponse, updateUser]);

    const updateNameMutation = useMutation({
        mutationFn: (name: string) => authService.updateProfile({ fullName: name }),
        onSuccess: (res) => {
            if (res.success && res.data) {
                updateUser(res.data);
                setIsEditingName(false);
                setError(null);
                queryClient.invalidateQueries({ queryKey: ['profile'] });
            } else {
                setError(res.message || "Gagal memperbarui nama.");
            }
        },
        onError: (err: any) => {
            setError(err.message || "Terjadi kesalahan server.");
        }
    });

    const handleSaveName = () => {
        if (!newName.trim()) {
            setError("Nama tidak boleh kosong.");
            return;
        }
        updateNameMutation.mutate(newName);
    };

    const maskEmail = (email: string) => {
        if (!email) return 'k***@smashclub.com';
        const [local, domain] = email.split('@');
        if (local.length <= 2) return `${local[0]}***@${domain}`;
        return `${local[0]}***${local[local.length - 1]}@${domain}`;
    };

    if (isLoadingProfile) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Memuat Pengaturan...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white font-sans pb-20">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="relative flex items-center justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium">Kembali</span>
                    </button>
                    <h1 className="text-3xl font-extrabold tracking-tight">Pengaturan Akun</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl text-sm flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto">
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {successMessage && !error && (
                    <div className="bg-primary/10 border border-primary/50 text-primary p-4 rounded-2xl text-sm flex items-center gap-3">
                        <Check className="w-5 h-5 shrink-0" />
                        <p>{successMessage}</p>
                        <button onClick={() => setSuccessMessage(null)} className="ml-auto">
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Section: Profil Identitas */}
                <div>
                    <h2 className="text-[#00d6b5] text-xs font-bold tracking-[0.2em] uppercase mb-6">Profil Identitas</h2>
                    <div className="bg-[#0a1618] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
                        {/* Name Item */}
                        <div className="p-1 px-6 pt-6">
                            <div
                                onClick={() => !isEditingName && !updateNameMutation.isPending && setIsEditingName(true)}
                                className={cn(
                                    "flex items-center gap-6 p-6 rounded-2xl transition-all",
                                    isEditingName ? "bg-white/5" : "hover:bg-white/5 cursor-pointer group"
                                )}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#112426] flex items-center justify-center text-[#00d6b5]">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white mb-1">Ubah Nama Lengkap</h3>
                                    <p className="text-gray-500 text-sm">Ganti nama yang ditampilkan di profil publik Anda</p>
                                </div>
                                {isEditingName ? (
                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <input
                                            autoFocus
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                                            disabled={updateNameMutation.isPending}
                                            className="bg-[#112426] border border-white/10 rounded-xl px-4 py-2 text-white font-medium focus:outline-none focus:border-primary/50 disabled:opacity-50"
                                            placeholder="Nama Lengkap"
                                        />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleSaveName(); }}
                                            disabled={updateNameMutation.isPending}
                                            className="p-2 bg-primary text-background rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {updateNameMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-400 font-medium">{user?.fullName || user?.name}</span>
                                        <ChevronRight className="w-5 h-5 text-gray-600 transition-transform group-hover:translate-x-1" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="h-px bg-white/5 mx-12" />

                        {/* Email Item */}
                        <div className="p-1 px-6 pb-6">
                            <div
                                onClick={() => navigate('/settings/change-email')}
                                className="flex items-center gap-6 p-6 rounded-2xl hover:bg-white/5 cursor-pointer group transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#112426] flex items-center justify-center text-[#00d6b5]">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-white">Ubah Email</h3>
                                        {profileResponse?.pendingEmail && (
                                            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                                                Menunggu Verifikasi
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-sm">Gunakan email aktif untuk verifikasi dan notifikasi</p>

                                    {profileResponse?.pendingEmail && (
                                        <div className="mt-2 p-2 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                                            <p className="text-[10px] text-gray-400">Menunggu verifikasi ke email baru</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-400 font-medium">{maskEmail(user?.email)}</span>
                                    <ChevronRight className="w-5 h-5 text-gray-600 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Keamanan & Privasi */}
                <div>
                    <h2 className="text-[#00d6b5] text-xs font-bold tracking-[0.2em] uppercase mb-6">Keamanan & Privasi</h2>
                    <div className="bg-[#0a1618] border border-white/5 rounded-[32px] p-1 px-6 shadow-2xl">
                        <div
                            className="flex items-center gap-6 p-6 rounded-2xl hover:bg-white/5 cursor-pointer group transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[#112426] flex items-center justify-center text-[#00d6b5]">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white mb-1">Ganti Kata Sandi</h3>
                                <p className="text-gray-500 text-sm">Terakhir diperbarui 2 bulan yang lalu</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => navigate('/settings/change-password')}
                                    className="bg-primary/10 text-primary border border-primary/20 px-6 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all"
                                >
                                    Perbarui
                                </button>
                                <ChevronRight className="w-5 h-5 text-gray-600 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Credits */}
                <div className="pt-12 text-center text-gray-600 space-y-4">
                    <p className="text-sm">© 2024 SmashClub Community. All Rights Reserved.</p>
                    <div className="flex items-center justify-center gap-6 text-xs font-bold text-primary/40 uppercase tracking-widest">
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
