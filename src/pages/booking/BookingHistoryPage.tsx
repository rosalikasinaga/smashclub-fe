import { useQuery } from "@tanstack/react-query"
import { bookingService } from "../../features/booking/booking.service"
import type { BookingDetail } from "../../features/booking/booking.types"
import dayjs from 'dayjs'
import { Link } from "react-router-dom"
import { Calendar, ChevronRight, RefreshCw, Search, ChevronLeft, Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"
import { useState } from "react"

export default function BookingHistoryPage() {
    const [page, setPage] = useState(0);
    const size = 10;

    const { data: bookingsResponse, isLoading } = useQuery({
        queryKey: ['my-bookings', page, size],
        queryFn: () => bookingService.getMyBookings(page, size)
    });

    const paginatedData = bookingsResponse?.data;
    const bookings = paginatedData?.content || [];
    const totalPages = paginatedData?.totalPages || 0;
    const totalElements = paginatedData?.totalElements || 0;

    const statusStyles: Record<string, string> = {
        'COMPLETED': 'bg-green-500/10 border-green-500/30 text-green-400',
        'SELESAI': 'bg-green-500/10 border-green-500/30 text-green-400',
        'PENDING': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
        'MENUNGGU BAYAR': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
        'CONFIRMED': 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        'DIKONFIRMASI': 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        'ONGOING': 'bg-primary/10 border-primary/30 text-primary',
        'SEDANG BERJALAN': 'bg-primary/10 border-primary/30 text-primary',
        'CANCELLED': 'bg-red-500/10 border-red-500/30 text-red-400',
        'DIBATALKAN': 'bg-red-500/10 border-red-500/30 text-red-400'
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    const startIdx = page * size + 1;
    const endIdx = Math.min((page + 1) * size, totalElements);

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-4">
                <Link to="/" className="text-gray-500 hover:text-white transition-colors">BERANDA</Link>
                <span className="text-gray-700">/</span>
                <span className="text-primary">RIWAYAT BOOKING</span>
            </div>

            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Riwayat Booking</h1>
                <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                    Pantau jadwal main dan status pembayaran pesanan Anda secara real-time.
                </p>
            </div>

            {/* Main Content Card */}
            <div className="bg-[#0a1a1a] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                {/* Table Header - Desktop Only */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="col-span-4 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">DETAIL LAPANGAN</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">TANGGAL & WAKTU</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">TOTAL HARGA</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">STATUS</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase text-right px-4">AKSI</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                    {bookings.length > 0 ? (
                        bookings.map((booking: BookingDetail) => (
                            <div key={booking.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center px-8 py-8 hover:bg-white/[0.01] transition-all group">
                                {/* Detail Lapangan */}
                                <div className="col-span-1 md:col-span-4 flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-900 border border-white/5 flex-shrink-0 group-hover:border-primary/30 transition-colors">
                                        <img src={booking.court.courtImgLink || "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop"} alt={booking.court.courtName} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{booking.court.courtName}</h3>
                                        <p className="text-sm text-gray-500">{booking.court.courtCode}</p>
                                    </div>
                                </div>

                                {/* Tanggal & Waktu */}
                                <div className="col-span-1 md:col-span-2">
                                    <div className="text-sm font-bold text-gray-200 mb-1">{dayjs(booking.bookingDate).format('D MMM YYYY')}</div>
                                    <div className="text-xs text-gray-500 font-medium">{booking.startTime.substring(0, 5)} - {booking.endTime.substring(0, 5)}</div>
                                </div>

                                {/* Total Harga */}
                                <div className="col-span-1 md:col-span-2 font-sans font-bold text-xl text-white">
                                    <span className="text-xs mr-1 opacity-50 font-normal">Rp</span>
                                    {booking.totalPrice.toLocaleString('id-ID')}
                                </div>

                                {/* Status */}
                                <div className="col-span-1 md:col-span-2">
                                    <div className={cn(
                                        "inline-flex px-3 py-1 rounded-full text-[9px] font-black border tracking-widest",
                                        statusStyles[booking.statusDescription] || 'bg-gray-500/10 border-gray-500/30 text-gray-400'
                                    )}>
                                        {booking.statusDescription}
                                    </div>
                                </div>

                                {/* Aksi */}
                                <div className="col-span-1 md:col-span-2 flex flex-col md:items-end gap-3 px-0 md:px-4">
                                    {(booking.statusDescription === 'COMPLETED' || booking.statusDescription === 'SELESAI') && (
                                        <Link to="/booking" className="bg-primary text-[#051111] px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_4px_15px_rgba(34,197,94,0.2)]">
                                            <Calendar className="w-4 h-4" /> Booking Lagi
                                        </Link>
                                    )}
                                    {(booking.statusDescription === 'CANCELLED' || booking.statusDescription === 'DIBATALKAN') && (
                                        <Link to="/booking" className="text-gray-400 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                                            Re-book <RefreshCw className="w-3 h-3" />
                                        </Link>
                                    )}
                                    <Link to={`/orders/${booking.bookingCode}`} className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-all">
                                        Lihat Detail <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Belum ada riwayat booking</h3>
                            <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                                Mulai petualangan tennis Anda dengan memesan lapangan hari ini!
                            </p>
                            <Link to="/booking" className="inline-flex bg-primary text-[#051111] px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-primary/90 transition-all shadow-[0_8px_30px_rgba(34,197,94,0.3)]">
                                Pesan Lapangan Sekarang
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {bookings.length > 0 && totalPages > 1 && (
                    <div className="px-8 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.01]">
                        <p className="text-xs text-gray-500 font-bold tracking-tight">
                            Menampilkan <span className="text-gray-300">{startIdx} - {endIdx}</span> dari <span className="text-gray-300">{totalElements}</span> pesanan
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
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
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Info showing even if only 1 page */}
                {bookings.length > 0 && totalPages <= 1 && (
                    <div className="px-8 py-6 border-t border-white/5 flex justify-center bg-white/[0.01]">
                        <p className="text-xs text-gray-500 font-bold tracking-tight">
                            Menampilkan semua <span className="text-gray-300">{totalElements}</span> pesanan
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
