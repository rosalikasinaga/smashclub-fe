import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../../features/booking/transaction.service';
import {
    ArrowLeft,
    Share2,
    HelpCircle,
    CheckCircle2,
    Receipt,
    MessageCircle,
    Copy,
    Loader2,
    AlertCircle,
    Clock,
    CreditCard
} from 'lucide-react';
import dayjs from 'dayjs';

export default function TopUpHistoryDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const stateInvoiceUrl = location.state?.invoiceUrl;

    const { data: transactionResponse, isLoading, error } = useQuery({
        queryKey: ['transaction-detail', id],
        queryFn: () => transactionService.getTransactionDetail(id!),
        enabled: !!id
    });

    const transaction = transactionResponse?.data;
    const invoiceUrl = transaction?.paymentLink || stateInvoiceUrl;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount).replace('Rp', 'Rp ');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#051111]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !transaction) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#051111] px-4 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-black mb-2">Transaksi Tidak Ditemukan</h2>
                <p className="text-gray-400 mb-8 max-w-xs">Maaf, rincian transaksi dengan kode {id} tidak dapat ditemukan.</p>
                <button onClick={() => navigate('/top-up/history')} className="px-8 py-3 bg-primary text-background font-black rounded-2xl">
                    Kembali ke Riwayat
                </button>
            </div>
        );
    }

    const isPending = transaction.status === 0 || transaction.status === 1;
    const isSuccess = transaction.status === 2;

    return (
        <div className="min-h-screen bg-background text-white font-sans pb-10">
            {/* Header */}
            <header className="bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/top-up/history")} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-primary">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-bold">Detail Riwayat Top-up</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-all">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-all">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-xl space-y-6">
                {/* Status Card */}
                <div className="bg-[#16282a] border border-gray-800 rounded-[2.5rem] p-10 text-center relative overflow-hidden group shadow-2xl">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${isSuccess ? 'via-primary/50' : 'via-yellow-500/50'} to-transparent`} />

                    <div className="flex justify-center mb-6">
                        <div className={`w-16 h-16 ${isSuccess ? 'bg-primary/20' : 'bg-yellow-500/20'} rounded-full flex items-center justify-center relative`}>
                            {isSuccess ? (
                                <>
                                    <div className="absolute inset-0 bg-primary/20 animate-ping rounded-full" />
                                    <CheckCircle2 className="w-10 h-10 text-primary relative z-10" />
                                </>
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-yellow-500/20 animate-pulse rounded-full" />
                                    <Clock className="w-10 h-10 text-yellow-500 relative z-10" />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 mb-8">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSuccess ? 'text-primary' : 'text-yellow-500'}`}>Status Transaksi</p>
                        <h2 className="text-3xl font-black">{isSuccess ? 'Berhasil' : isPending ? 'Menunggu Pembayaran' : 'Dibatalkan'}</h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                            {isSuccess
                                ? `Top-up SmashPay senilai ${formatCurrency(transaction.totalPrice)} telah masuk ke saldo akun Anda.`
                                : isPending
                                    ? `Silakan selesaikan pembayaran senilai ${formatCurrency(transaction.totalPrice)} sesuai panduan.`
                                    : `Transaksi top-up senilai ${formatCurrency(transaction.totalPrice)} telah dibatalkan atau kadaluarsa.`
                            }
                        </p>
                    </div>

                    {isPending && invoiceUrl && (
                        <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                            <a
                                href={invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-primary text-[#051111] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(0,214,181,0.3)]"
                            >
                                <CreditCard className="w-4 h-4" /> Bayar Sekarang / Lihat Panduan
                            </a>
                        </div>
                    )}
                </div>

                {/* Details Card */}
                <div className="bg-[#16282a] border border-gray-800 rounded-[2.5rem] p-8 space-y-8 shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <Receipt className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold">Rincian Transaksi</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center group">
                            <span className="text-gray-400 text-sm font-medium">ID Transaksi</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-200">{transaction.transactionCode}</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(transaction.transactionCode);
                                        // Optional: add toast
                                    }}
                                    className="p-1 hover:text-primary transition-colors text-gray-600"
                                >
                                    <Copy className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                        {transaction.referenceCode && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm font-medium">Reference Code</span>
                                <span className="font-bold text-gray-200">{transaction.referenceCode}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm font-medium">Tanggal & Waktu</span>
                            <span className="font-bold text-gray-200">{dayjs(transaction.createdAt).format('D MMM YYYY, HH:mm')}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-800 pb-6 mb-2">
                            <span className="text-gray-400 text-sm font-medium">Jenis Transaksi</span>
                            <span className="font-bold text-gray-200 text-right uppercase tracking-wider text-xs">Top Up SmashPay</span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <span className="text-gray-400 text-sm font-medium">Nominal Top-up</span>
                            <span className="font-bold text-gray-200">{formatCurrency(transaction.totalPrice)}</span>
                        </div>

                        <div className="h-px bg-gray-800/50 my-2" />

                        <div className="flex justify-between items-end pt-2">
                            <span className="text-lg font-bold">Total Pembayaran</span>
                            <span className="text-2xl font-black text-primary drop-shadow-[0_0_10px_rgba(0,214,181,0.2)]">
                                {formatCurrency(transaction.totalPrice)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="bg-primary/5 border border-primary/10 rounded-[1.5rem] p-6 flex items-center justify-between group hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Butuh Bantuan?</h4>
                            <p className="text-[10px] text-gray-500 font-medium tracking-wide">Hubungi Customer Service SmashClub</p>
                        </div>
                    </div>
                    <button className="text-xs font-black text-primary uppercase tracking-[0.1em] px-4 py-2 hover:bg-primary/20 rounded-xl transition-all">
                        Chat Admin
                    </button>
                </div>

                {/* Footer Action */}
                <button
                    onClick={() => navigate('/top-up/history')}
                    className="w-full py-5 rounded-3xl border-2 border-gray-800 hover:border-primary/30 hover:bg-primary/5 text-gray-400 hover:text-primary font-black transition-all uppercase tracking-widest text-xs"
                >
                    Kembali ke Riwayat
                </button>
            </main>

            {/* Specialized Detail Footer */}
            <footer className="mt-10 py-10 text-center">
                <div className="flex items-center justify-center gap-2 mb-2 opacity-30 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                    <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                        <span className="text-background font-black text-sm">S</span>
                    </div>
                    <span className="text-sm font-black text-white tracking-widest">SMASHPAY BY SMASHCLUB</span>
                </div>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">Terima kasih telah menggunakan layanan SmashPay</p>
            </footer>
        </div>
    );
}
