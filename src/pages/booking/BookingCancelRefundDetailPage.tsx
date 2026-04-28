import { useLocation, useParams, Link } from "react-router-dom"
import { Check, Clock, Copy, MessageSquare, ShieldCheck, FileText, Wallet, XCircle } from "lucide-react"
import { useBookingStore } from "../../features/booking/booking.store"
import { cn } from "../../lib/utils"

export default function BookingRefundDetailPage() {
    const { id } = useParams()
    const location = useLocation()
    const { bookingHistory } = useBookingStore()

    // Get data passed from previous page or mock it
    const locationState = location.state || {}
    const { reason, additionalInfo, refundDate, status } = locationState

    // Map status to current step
    // Status can be: 'PENGAJUAN', 'BERHASIL', 'DITOLAK'
    const refundStatus = status || 'BERHASIL'

    // Find the booking in history or use mock
    const booking = bookingHistory.find(b => b.id === id) || {
        id: id || "2023081501",
        courtName: "Emerald Tennis Center",
        courtType: "Lapangan Indoor 02",
        date: "15 Agustus 2023",
        timeRange: "19:00 - 21:00",
        totalPrice: 505000,
        image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop",
        status: 'SELESAI',
    }

    const refundId = `RFD-${booking.id}`
    const mockDate = "24 Okt 2023, 10:00 WIB"
    const displayDate = refundDate || mockDate
    const displayReason = reason || "Jadwal tidak sesuai (Salah pilih jam)"

    // Mock timeline status logic
    let currentStep = 1
    if (refundStatus === 'PROSES') currentStep = 2
    if (refundStatus === 'BERHASIL' || refundStatus === 'DITOLAK') currentStep = 3

    const steps = [
        { id: 1, label: "Pengajuan", sub: "24 Okt 2023, 10:00", icon: FileText },
        { id: 2, label: "Diproses", sub: currentStep > 2 ? "Selesai Ditinjau" : "Sedang Ditinjau", icon: Clock },
        {
            id: 3,
            label: refundStatus === 'DITOLAK' ? "Ditolak" : "Berhasil",
            sub: currentStep === 3 ? "25 Okt 2023, 14:30" : "Menunggu Selesai",
            icon: refundStatus === 'DITOLAK' ? XCircle : ShieldCheck
        },
    ]

    return (
        <div className="bg-[#051111] min-h-screen text-white font-sans overflow-x-hidden">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-8 text-gray-500">
                    <Link to="/booking-history" className="hover:text-white transition-colors">Tiket Saya</Link>
                    <span>&rsaquo;</span>
                    <span className="text-primary">Detail Refund</span>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-black mb-2">Detail Tiket Refund</h1>
                        <div className="inline-flex items-center gap-2 bg-[#0a1a1a] border border-white/10 rounded-lg px-3 py-1.5">
                            <span className="text-primary font-bold text-sm">#{refundId}</span>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-[#0a1a1a] border border-white/10 hover:bg-white/5 transition-all text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
                        <Copy className="w-4 h-4" /> Salin ID Refund
                    </button>
                </div>

                {/* Timeline */}
                <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-10 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Clock className="w-64 h-64 text-primary" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between relative">
                            {/* Connector Line */}
                            <div className="absolute top-5 left-0 w-full h-0.5 bg-white/5 hidden md:block -z-10" />

                            {steps.map((step) => {
                                const isCompleted = step.id <= currentStep
                                const isActive = step.id === currentStep
                                const Icon = step.icon

                                return (
                                    <div key={step.id} className="flex flex-col items-center flex-1 text-center mb-6 md:mb-0 relative group">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-all duration-500 border-2 relative z-10",
                                            isCompleted ? (refundStatus === 'DITOLAK' && step.id === 3 ? "bg-red-500 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]" : "bg-primary border-primary shadow-[0_0_20px_rgba(0,214,181,0.4)]") :
                                                isActive ? "bg-[#0a1a1a] border-primary text-primary shadow-[0_0_15px_rgba(0,214,181,0.2)]" :
                                                    "bg-[#0a1a1a] border-white/10 text-gray-600"
                                        )}>
                                            {isCompleted ? (
                                                refundStatus === 'DITOLAK' && step.id === 3 ? <XCircle className="w-5 h-5 text-white" /> : <Check className="w-5 h-5 text-[#051111]" />
                                            ) : (
                                                <Icon className={cn("w-5 h-5", isActive ? "text-primary animate-pulse" : "text-gray-600")} />
                                            )}
                                        </div>
                                        <h3 className={cn(
                                            "font-bold text-sm mb-1 transition-colors",
                                            isActive || isCompleted ? (refundStatus === 'DITOLAK' && step.id === 3 ? "text-red-500" : "text-white") : "text-gray-500"
                                        )}>
                                            {step.label}
                                        </h3>
                                        {step.sub && (
                                            <p className={cn(
                                                "text-[10px] font-medium transition-colors",
                                                isCompleted ? "text-gray-400" : "text-gray-600"
                                            )}>{step.sub}</p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Info Pengajuan */}
                        <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Informasi Pengajuan</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-2">TANGGAL PENGAJUAN</p>
                                    <p className="font-bold text-lg">{displayDate}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-2">ID PESANAN ASLI</p>
                                    <Link to={`/booking/${booking.id}`} className="font-bold text-lg text-primary hover:underline">
                                        #SC-{booking.id}
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-3">ALASAN PENGEMBALIAN</p>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                        {displayReason}
                                        {additionalInfo && (
                                            <span className="block mt-2 text-gray-400 italic">"{additionalInfo}"</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rincian Produk (Court) */}
                        <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Rincian Booking</h2>
                            </div>

                            <div className="flex gap-6 group">
                                <div className="w-24 h-24 rounded-2xl bg-gray-900 border border-white/5 overflow-hidden flex-shrink-0">
                                    <img src={booking.image} alt={booking.courtName} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{booking.courtName}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{booking.courtType}</p>

                                    <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {booking.date}, {booking.timeRange}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-between items-end">
                                        <span className="text-sm text-gray-500">Harga Sewa</span>
                                        <span className="font-bold text-lg">Rp {booking.totalPrice.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Copy className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-lg font-bold">Ringkasan Refund</h2>
                            </div>

                            <div className="space-y-4 mb-6 pb-6 border-b border-white/5 border-dashed">
                                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                    <span>Total Booking</span>
                                    <span className="text-white">Rp {booking.totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                    <span>Biaya Admin Refund</span>
                                    <span className="text-white">Rp 0</span>
                                </div>
                            </div>

                            <div className="space-y-1 mb-8">
                                <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase">TOTAL PENGEMBALIAN</span>
                                <div className="flex items-end gap-1">
                                    <span className="text-primary text-sm font-bold mb-1">Rp</span>
                                    <span className="text-3xl font-black text-primary">{booking.totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-600 uppercase">DIKEMBALIKAN KE:</span>
                            </div>

                            <div className="bg-[#051111] border border-white/5 rounded-xl p-4 flex items-center gap-3">
                                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                    <Wallet className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white">Smash Pay</div>
                                    <div className="text-[10px] text-gray-500">Saldo akan bertambah otomatis</div>
                                </div>
                            </div>
                        </div>

                        {/* Help */}
                        <div className="bg-[#16282a] border border-primary/20 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MessageSquare className="w-32 h-32 text-primary" />
                            </div>

                            <h3 className="font-bold text-white mb-2 relative z-10">Butuh Bantuan?</h3>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6 relative z-10">
                                Jika Anda memiliki kendala atau pertanyaan terkait pengajuan ini, tim kami siap membantu.
                            </p>

                            <button className="w-full bg-primary text-[#051111] py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 relative z-10 shadow-[0_0_20px_rgba(0,214,181,0.2)]">
                                <MessageSquare className="w-4 h-4" /> Hubungi Pusat Bantuan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
