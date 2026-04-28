import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Wallet,
    Filter,
    Home
} from 'lucide-react';
import { useWalletStore } from '../../features/wallet/wallet.store';
import { cn } from '../../lib/utils';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import type { WalletLog } from '../../features/wallet/wallet.types';

export default function TopUpHistoryPage() {
    const navigate = useNavigate();
    const { balance, logs, fetchBalance, isLoading } = useWalletStore();

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount).replace('Rp', 'Rp ');
    };

    const getStatusInfo = (type: boolean) => {
        return type
            ? { label: 'MASUK', color: 'text-[#00d6b5] bg-[#00d6b5]/10 border-[#00d6b5]/20' }
            : { label: 'KELUAR', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
    };

    return (
        <div className="min-h-screen bg-background text-white font-sans pb-20">
            {/* Header */}
            <header className="border-b border-gray-800 bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-background font-black text-xl tracking-tighter">S</span>
                        </div>
                        <h1 className="text-lg font-bold">Riwayat Top-up SmashPay</h1>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-bold text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Summary Cards */}
                <div className="mb-10">
                    {/* Active Balance */}
                    <div className="bg-primary rounded-2xl p-8 shadow-xl shadow-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:scale-110 transition-transform">
                            <Wallet className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-background/80">Total Saldo Aktif</p>
                        {isLoading ? (
                            <div className="h-10 w-48 bg-background/20 animate-pulse rounded-lg" />
                        ) : (
                            <h2 className="text-4xl font-black text-[#051111]">
                                {formatCurrency(balance)}
                            </h2>
                        )}
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="bg-[#0b1718] border border-gray-800/50 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
                        <h3 className="text-xl font-bold">Daftar Transaksi</h3>
                        <button className="flex items-center gap-2 bg-[#16282a] border border-gray-800 px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">
                            <Filter className="w-4 h-4 text-primary" /> Filter
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-800/50">
                                    <th className="px-8 py-6">Tanggal</th>
                                    <th className="px-8 py-6">Metode</th>
                                    <th className="px-8 py-6">Nominal</th>
                                    <th className="px-8 py-6 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/30">
                                {isLoading ? (
                                    // Loading Skeletons
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-8 py-6">
                                                <div className="h-4 w-32 bg-white/5 rounded" />
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="h-4 w-40 bg-white/5 rounded" />
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="h-6 w-24 bg-white/5 rounded" />
                                            </td>
                                            <td className="px-8 py-6 text-right flex justify-end">
                                                <div className="h-5 w-16 bg-white/5 rounded-full" />
                                            </td>
                                        </tr>
                                    ))
                                ) : (!logs || logs.length === 0) ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-6">
                                                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600 border border-white/5 relative group">
                                                    <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <Wallet className="w-10 h-10 opacity-20 relative z-10" />
                                                </div>
                                                <div className="max-w-xs mx-auto">
                                                    <p className="text-lg font-bold text-white mb-2">Belum Ada Transaksi</p>
                                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                                        Sepertinya Anda belum melakukan transaksi top-up atau pembayaran menggunakan SmashPay.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => navigate('/top-up')}
                                                    className="mt-2 bg-primary/10 text-primary border border-primary/20 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-background transition-all active:scale-95"
                                                >
                                                    Isi Saldo Sekarang
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    logs?.map((item: WalletLog) => {
                                        const status = getStatusInfo(item.usageType);
                                        return (
                                            <tr
                                                key={item.id}
                                                onClick={() => item.refID && navigate(`/top-up/history/${item.refID}`)}
                                                className="group hover:bg-white/5 transition-colors cursor-pointer"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="text-sm font-bold text-gray-300">
                                                        {dayjs(item.createdAt).format('D MMM YYYY, HH:mm')}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-sm font-medium text-gray-400">
                                                        {item.usageType ? 'Top-up SmashPay' : 'Pembayaran Booking'}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={cn(
                                                        "text-lg font-black tracking-tight",
                                                        item.usageType ? "text-primary" : "text-red-400"
                                                    )}>
                                                        {item.usageType ? '+' : '-'}{formatCurrency(item.usageValue)}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className={cn(
                                                        "text-[9px] font-black px-3 py-1.5 rounded-full border uppercase tracking-[0.1em]",
                                                        status.color
                                                    )}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-gray-800 hover:border-primary/30 hover:bg-primary/5 text-gray-400 hover:text-primary font-black tracking-widest uppercase text-xs transition-all active:scale-95"
                    >
                        <Home className="w-4 h-4" />
                        Kembali ke Beranda
                    </button>
                </div>
            </main>

            <footer className="mt-20 py-10 text-center border-t border-gray-800/30">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-4">
                    © 2023 SmashClub App. Semua transaksi terenkripsi dan aman.
                </p>
                <div className="flex justify-center gap-6">
                    <button className="text-[9px] font-black text-primary uppercase tracking-[0.2em] hover:underline underline-offset-4 transition-all">Syarat & Ketentuan</button>
                    <button className="text-[9px] font-black text-primary uppercase tracking-[0.2em] hover:underline underline-offset-4 transition-all">Bantuan</button>
                </div>
            </footer>
        </div>
    );
}
