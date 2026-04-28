import { X, User, LogOut, Calendar, ShoppingCart, Settings, ChevronRight, Wallet } from 'lucide-react';
import { useAuthStore } from '../../features/auth/auth.store';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../features/auth/auth.service';
import { useWalletStore } from '../../features/wallet/wallet.store';

export default function ProfileDrawer() {
    const { user, isProfileOpen, toggleProfile, logout, refreshToken } = useAuthStore();
    const { balance } = useWalletStore();
    const navigate = useNavigate();
    const location = useLocation();

    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(refreshToken || ""),
        onSettled: () => {
            logout();
            toggleProfile(false);
            navigate('/');
        }
    });

    if (!isProfileOpen) return null;

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const menuItems = [
        {
            icon: <Calendar className="w-5 h-5" />,
            label: 'Riwayat Booking',
            onClick: () => {
                toggleProfile(false);
                navigate('/booking-history');
            },
            active: location.pathname === '/booking-history',
        },
        {
            icon: <Wallet className="w-5 h-5" />,
            label: 'Riwayat Transaksi',
            onClick: () => {
                toggleProfile(false);
                navigate('/transactions');
            },
            active: location.pathname === '/transactions',
        },
        {
            icon: <ShoppingCart className="w-5 h-5" />,
            label: 'Pesanan Saya (E-Commerce)',
            onClick: () => {
                toggleProfile(false);
                navigate('/shop/orders');
            },
            active: location.pathname.startsWith('/shop/order'),
        },
        {
            icon: <Settings className="w-5 h-5" />,
            label: 'Pengaturan Akun',
            onClick: () => {
                toggleProfile(false);
                navigate('/settings');
            },
            active: location.pathname === '/settings',
        },
    ];

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden font-sans">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => toggleProfile(false)}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md flex flex-col bg-[#051111] shadow-2xl border-l border-gray-800">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-6">
                        <h2 className="text-2xl font-bold text-white">Informasi Pengguna</h2>
                        <button
                            onClick={() => toggleProfile(false)}
                            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* User Profile Info */}
                        <div className="px-6 py-8 flex items-center gap-4">
                            <button
                                onClick={() => {
                                    toggleProfile(false);
                                    navigate('/profile');
                                }}
                                className="relative group flex-shrink-0"
                            >
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 bg-gray-800 flex items-center justify-center relative">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.fullName || 'User'} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                    ) : (
                                        <User className="w-10 h-10 text-gray-600" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Settings className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 p-1.5 bg-primary rounded-full shadow-lg border-2 border-[#051111] opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 duration-300">
                                    <User className="w-3 h-3 text-black" />
                                </div>
                            </button>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{user?.fullName || 'Pengguna SmashClub'}</h3>
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-500 text-[10px] font-medium tracking-wider">
                                        ID: {user?.id || 'SC-000000'}
                                    </span>
                                    {user?.email && (
                                        <span className="text-gray-400 text-xs font-medium">
                                            {user.email}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* E-Wallet Card */}
                        <div className="px-6 pb-6">
                            <div className="bg-[#112426] border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <span className="text-gray-400 text-sm font-medium">Smash Pay</span>
                                    </div>
                                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md">
                                        E-Wallet
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-white tracking-tight">
                                        {formatCurrency(balance || 0)}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-widest">
                                        Saldo dari Pengembalian Dana
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-primary/10">
                                    <button
                                        onClick={() => {
                                            toggleProfile(false);
                                            navigate('/top-up');
                                        }}
                                        className="text-[10px] font-black uppercase tracking-widest bg-primary text-[#051111] px-4 py-2 rounded-lg hover:bg-primary/90 transition-all active:scale-95"
                                    >
                                        Isi Saldo
                                    </button>
                                    <button
                                        onClick={() => {
                                            toggleProfile(false);
                                            navigate('/top-up/history');
                                        }}
                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
                                    >
                                        Lihat Riwayat
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="px-4 py-4 space-y-2">
                            <div className="h-px bg-gray-800/50 mx-2 mb-6" />
                            {menuItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={item.onClick}
                                    className={cn(
                                        "w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all group",
                                        item.active
                                            ? "bg-primary/10 border border-primary/20 text-primary shadow-[0_0_20px_rgba(34,197,94,0.05)]"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <div className={cn(
                                        "p-1.5 rounded-lg transition-colors",
                                        item.active ? "bg-primary/20" : "bg-transparent group-hover:bg-gray-800"
                                    )}>
                                        {item.icon}
                                    </div>
                                    <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                                    {item.active && <ChevronRight className="w-4 h-4 opacity-50" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer / Logout */}
                    <div className="p-6 border-t border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-6 py-4 text-red-500 font-bold hover:bg-red-500/10 transition-all active:scale-[0.98]"
                        >
                            <LogOut className="w-5 h-5" />
                            Keluar
                        </button>
                        <div className="mt-6 text-center">
                            <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">
                                SmashClub v2.4.0 • Made for Champions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
