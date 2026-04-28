import { useQuery } from "@tanstack/react-query"
import { transactionService, type Transaction } from "../../features/booking/transaction.service"
import dayjs from 'dayjs'
import { Link } from "react-router-dom"
import { Search, Loader2, CreditCard, ChevronRight, ChevronLeft, ArrowLeft, Filter, Zap } from "lucide-react"
import { cn } from "../../lib/utils"
import { useState } from "react"

export default function TransactionListPage() {
    const [page, setPage] = useState(0);
    const size = 10;

    const { data: transactionsResponse, isLoading } = useQuery({
        queryKey: ['transaction-list', page, size],
        queryFn: () => transactionService.getTransactionList({
            startDate: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
            endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
            page,
            size
        })
    });

    const paginatedData = transactionsResponse?.data;
    const transactions = paginatedData?.content || [];
    const totalPages = paginatedData?.totalPages || 0;
    const totalElements = paginatedData?.totalElements || 0;

    const getStatusInfo = (status: number) => {
        switch (status) {
            case 0:
            case 1: return { label: 'PENDING', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' };
            case 2: return { label: 'SETTLED', color: 'bg-green-500/10 border-green-500/30 text-green-400' };
            case 3: return { label: 'EXPIRED', color: 'bg-red-500/10 border-red-500/30 text-red-400' };
            case 4: return { label: 'CANCELLED', color: 'bg-gray-500/10 border-gray-500/30 text-gray-400' };
            default: return { label: 'UNKNOWN', color: 'bg-gray-500/10 border-gray-500/30 text-gray-400' };
        }
    };

    const generateDetailPath = (transactionType: number, transactionCode: string, referenceCode: string) => {
        if (transactionType === 1) {
            return `/orders/${referenceCode}`;
        }

        if (transactionType === 2) {
            return `/shop/orders/${referenceCode}`;
        }

        if (transactionType === 3) {
            return `/top-up/history/${transactionCode}`;
        }

        return `#`;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <Link to="/booking-history" className="text-sm text-gray-400 hover:text-white flex items-center gap-2 mb-4">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Riwayat
                    </Link>
                    <h1 className="text-3xl font-black text-white">Daftar Transaksi</h1>
                    <p className="text-gray-400 mt-1">Pantau semua transaksi pembayaran Anda.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/top-up" className="flex items-center gap-2 bg-primary text-[#051111] px-5 py-2.5 rounded-xl text-sm font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/5 active:scale-95">
                        <Zap className="w-4 h-4 fill-current" /> Top Up
                    </Link>
                    <button className="flex items-center gap-2 bg-[#16282a] border border-gray-800 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-[#1c3235] transition-all">
                        <Filter className="w-4 h-4 text-primary" /> Filter
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari transaksi..."
                            className="bg-[#16282a] border border-gray-800 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
                {transactions.length > 0 ? (
                    transactions.map((transaction: Transaction) => {
                        const status = getStatusInfo(transaction.status);
                        return (
                            <div key={transaction.id} className="bg-[#16282a] border border-gray-800 rounded-2xl p-6 hover:border-primary/30 transition-all group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                                                    {transaction.transactionLabel || `Transaksi #${transaction.transactionCode}`}
                                                </h3>
                                                <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border tracking-widest", status.color)}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {dayjs(transaction.createdAt).format('D MMMM YYYY, HH:mm')} • {transaction.transactionCode}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-8">
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest font-bold">TOTAL BAYAR</div>
                                            <div className="text-xl font-black text-white">
                                                <span className="text-xs mr-1 opacity-50 font-normal">Rp</span>
                                                {transaction.totalPrice.toLocaleString('id-ID')}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {transaction.paymentLink && (transaction.status === 0 || transaction.status === 1) && (
                                                <a
                                                    href={transaction.paymentLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-primary text-[#051111] px-4 py-2 rounded-lg text-xs font-black hover:bg-primary/90 transition-all"
                                                >
                                                    Bayar
                                                </a>
                                            )}
                                            <Link
                                                to={generateDetailPath(transaction.transactionType, transaction.transactionCode, transaction.referenceCode || '')}
                                                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-all"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-24 text-center bg-[#16282a] border border-gray-800 rounded-[2rem]">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Belum ada transaksi</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                            Semua riwayat pembayaran Anda akan muncul di sini setelah Anda melakukan pemesanan.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {transactions.length > 0 && totalPages > 1 && (
                <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#16282a] border border-gray-800 rounded-2xl p-6">
                    <p className="text-xs text-gray-500 font-bold tracking-tight">
                        Menampilkan <span className="text-gray-300">{(page * size) + 1} - {Math.min((page + 1) * size, totalElements)}</span> dari <span className="text-gray-300">{totalElements}</span> transaksi
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all font-black"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={cn(
                                    "w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black border transition-all",
                                    page === i
                                        ? "bg-primary text-[#051111] border-primary shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                                        : "bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all font-black"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
