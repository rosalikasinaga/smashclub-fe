import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Bell,
    History,
    Wallet,
    Zap,
    ShieldCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useWalletStore } from '../../features/wallet/wallet.store';
import { walletService } from '../../features/wallet/wallet.service';

export default function TopUpPage() {
    const { balance } = useWalletStore();
    const navigate = useNavigate();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(100000);
    const [customAmount, setCustomAmount] = useState<string>('');

    const topUpMutation = useMutation({
        mutationFn: (amount: number) => walletService.topUp({ balance: amount }),
        onSuccess: (response: any) => {
            const data = response.data;
            if (data?.transactionCode) {
                window.open(data.paymentData?.invoiceUrl, "_blank");
                navigate(`/top-up/history/${data.transactionCode}`);
            } else {
                alert('Top Up Berhasil!');
                navigate('/top-up/history');
            }
        },
        onError: (error: any) => {
            console.error('Top up error:', error);
            const errorMessage = error.response?.data?.message || 'Gagal melakukan Top Up. Silakan coba lagi.';
            alert(errorMessage);
        }
    });

    const presetAmounts = [50000, 100000, 200000, 500000];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount).replace('Rp', 'Rp ');
    };

    const handlePresetClick = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setCustomAmount(value);
        setSelectedAmount(null);
    };

    const currentAmount = selectedAmount || Number(customAmount) || 0;
    const serviceFee = 0;
    const totalPayment = currentAmount + serviceFee;

    const handleTopUp = () => {
        if (currentAmount < 10000) return;
        topUpMutation.mutate(currentAmount);
    };

    return (
        <div className="min-h-screen bg-background text-white font-sans pb-20">
            {/* Custom Header for Top Up */}
            <header className="border-b border-gray-800 bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform hover:scale-105">
                                <span className="text-background font-bold text-xl tracking-tighter">S</span>
                            </div>
                            <h1 className="text-lg font-bold">Top Up SmashPay</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors relative group">
                            <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </button>
                        <button
                            onClick={() => navigate('/top-up/history')}
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors group"
                        >
                            <History className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Balance Card - Gradient Implementation */}
                <div className="bg-gradient-to-br from-[#00d6b5] via-[#00c2a4] to-[#00ae93] rounded-3xl p-8 mb-10 shadow-xl shadow-primary/20 relative overflow-hidden group">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/30 transition-all duration-700" />
                    <div className="absolute -bottom-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700 transform group-hover:rotate-12">
                        <Wallet className="w-48 h-48 text-[#051111] stroke-[1]" />
                    </div>

                    <div className="relative z-10 text-[#051111]">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-3 opacity-70">Dompet SmashPay</p>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                            {formatCurrency(balance)}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1.5 bg-[#051111]/10 px-3 py-1.5 rounded-full border border-[#051111]/10">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-wider">Saldo Terlindungi</span>
                            </div>
                            <button
                                onClick={() => navigate('/top-up/history')}
                                className="text-[11px] font-black uppercase tracking-wider px-5 py-2.5 bg-[#051111] text-white rounded-xl hover:bg-[#051111]/90 shadow-lg shadow-[#051111]/20 transition-all active:scale-95"
                            >
                                Riwayat Transaksi
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 1: Choose Amount */}
                <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center font-black text-sm">
                            1
                        </div>
                        <h3 className="text-xl font-bold">Pilih Nominal Top Up</h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {presetAmounts.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => handlePresetClick(amount)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden",
                                    selectedAmount === amount
                                        ? "bg-primary/10 border-primary shadow-[0_0_25px_rgba(0,214,181,0.15)] scale-[1.02]"
                                        : "bg-card border-gray-800 hover:border-primary/50 hover:bg-primary/5"
                                )}
                            >
                                {selectedAmount === amount && (
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-primary flex items-center justify-center clip-path-polygon">
                                        <Zap className="w-3 h-3 text-background fill-current" />
                                    </div>
                                )}
                                <span className={cn(
                                    "font-black text-sm whitespace-nowrap tracking-tight transition-colors",
                                    selectedAmount === amount ? "text-primary" : "text-gray-400 group-hover:text-white"
                                )}>
                                    {formatCurrency(amount)}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-[0.15em] text-gray-500 ml-1">Atau masukkan nominal lainnya</label>
                        <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-primary group-focus-within:scale-110 transition-transform">Rp</span>
                            <input
                                type="text"
                                value={currentAmount > 0 && selectedAmount === null ? customAmount : customAmount}
                                onChange={handleCustomAmountChange}
                                placeholder="10.000 - 10.000.000"
                                className="w-full bg-card border-2 border-gray-800 rounded-[2rem] py-5 pl-16 pr-6 text-xl font-black focus:outline-none focus:border-primary transition-all placeholder:text-gray-800 placeholder:font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Summary & Action */}
                <div className="bg-[#16282a] border border-gray-800/50 rounded-[2.5rem] p-8 mb-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="space-y-5 mb-10">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-gray-400 font-medium">Nominal Top Up</span>
                            <span className="font-black text-white text-lg tracking-tight">{formatCurrency(currentAmount)}</span>
                        </div>
                        <div className="h-px bg-gray-800/50 my-2" />
                        <div className="flex justify-between items-end px-2">
                            <span className="text-lg font-bold text-white uppercase tracking-tighter">Total Pembayaran</span>
                            <span className="text-3xl font-black text-primary tracking-tighter drop-shadow-[0_0_10px_rgba(0,214,181,0.2)]">
                                {formatCurrency(totalPayment)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleTopUp}
                        disabled={currentAmount < 10000 || topUpMutation.isPending}
                        className={cn(
                            "w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-3 text-lg font-black transition-all duration-300 relative group-btn",
                            currentAmount >= 10000 && !topUpMutation.isPending
                                ? "bg-primary text-background hover:shadow-[0_10px_40px_rgba(0,214,181,0.3)] hover:-translate-y-1"
                                : "bg-gray-800 text-gray-500 cursor-not-allowed grayscale"
                        )}
                    >
                        {topUpMutation.isPending ? (
                            <div className="w-6 h-6 border-[3px] border-background border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Zap className={cn("w-6 h-6 fill-current transition-transform group-hover-btn:scale-125", currentAmount >= 10000 ? "animate-pulse" : "")} />
                                <span>Pilih Metode Pembayaran</span>
                            </>
                        )}
                    </button>

                </div>

                <div className="text-center px-10">
                    <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-wider bg-gray-900/50 py-3 rounded-2xl border border-gray-800/30">
                        Dengan menekan tombol di atas, Anda menyetujui <Link to="/terms" className="text-primary hover:underline underline-offset-4">Syarat & Ketentuan</Link> pengisian saldo SmashPay.
                    </p>
                </div>
            </main>

            {/* Specialized Footer for SmashPay */}
            <footer className="border-t border-gray-800 mt-20 pt-16 pb-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-10">
                        <div className="flex items-center gap-3 group">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
                                <span className="text-background font-black text-xl">S</span>
                            </div>
                            <span className="font-black text-2xl text-white tracking-tighter">SmashPay</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
                            <button className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">Pusat Bantuan</button>
                            <button className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">Kebijakan Privasi</button>
                            <button className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">Kontak Kami</button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-gray-800/50">
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
                            © 2023 SmashPay Indonesia. Seluruh hak cipta dilindungi.
                        </p>
                        <div className="flex items-center gap-2 bg-gray-800/30 px-3 py-1.5 rounded-full border border-gray-800/50">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Terdaftar dan diawasi oleh</span>
                            <span className="text-[9px] text-white font-black tracking-widest">OJK</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
