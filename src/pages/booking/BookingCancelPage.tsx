import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ChevronRight, HelpCircle, Check, Home, ClipboardList, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { bookingService } from "../../features/booking/booking.service"
import { transactionService } from "../../features/booking/transaction.service"
import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

export default function BookingCancelPage() {
    const { id: bookingCode } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [selectedReason, setSelectedReason] = useState<string>("")
    const [otherReason, setOtherReason] = useState<string>("")
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    // Fetch actual booking detail
    const { data: bookingResponse, isLoading } = useQuery({
        queryKey: ['booking-detail', bookingCode],
        queryFn: () => bookingService.getBookingDetails(bookingCode!),
        enabled: !!bookingCode
    });

    const booking = bookingResponse?.data;

    const cancelMutation = useMutation({
        mutationFn: async (reason: string) => {
            // If there's a reference code (from booking or transaction detail), cancel the transaction
            const referenceCode = bookingCode!;
            if (referenceCode) {
                await transactionService.cancelTransactionByReference(referenceCode, reason);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking-detail', bookingCode] });
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
            setShowSuccessModal(true);
        },
        onError: (error: any) => {
            alert(error?.response?.data?.message || "Gagal membatalkan pesanan. Silakan coba lagi.");
        }
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    const reasons = [
        "Salah pilih court / jadwal",
        "Ingin mengubah metode pembayaran",
        "Lainnya"
    ]

    const handleConfirmCancel = () => {
        if (!selectedReason) {
            alert("Mohon pilih alasan pembatalan.")
            return
        }

        const reason = selectedReason === "Lainnya" ? otherReason : selectedReason;
        if (selectedReason === "Lainnya" && !otherReason.trim()) {
            alert("Mohon tuliskan alasan Anda.")
            return
        }

        cancelMutation.mutate(reason);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#051111]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#051111] text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Pesanan Tidak Ditemukan</h2>
                    <Link to="/booking-history" className="text-primary hover:underline">Kembali ke Riwayat</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#051111] min-h-screen text-white font-sans overflow-x-hidden">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-8 text-gray-500">
                    <Link to="/booking-history" className="hover:text-white transition-colors">Pesanan Saya</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-primary">Batalkan Pesanan</span>
                </div>

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-5xl font-black mb-4 uppercase italic tracking-tighter">
                        Batalkan <span className="text-primary">Pesanan</span>
                    </h1>
                    <p className="text-gray-400 font-bold max-w-2xl text-lg leading-relaxed">
                        Mohon beritahu kami alasan pembatalan pesanan Anda agar kami dapat meningkatkan layanan kami.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Booking Detail Section */}
                    <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8">
                        <h2 className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase mb-6">DETAIL PESANAN</h2>

                        <div className="flex gap-6 group">
                            <div className="w-24 h-24 rounded-2xl bg-gray-900 border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center p-3">
                                <img src={booking.court.courtImgLink || "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop"} alt={booking.court.courtName} className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">ID Pesanan: #{booking.bookingCode}</p>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold">{booking.court.courtName}</h3>
                                    <span className="text-xl font-bold text-primary">{formatPrice(booking.totalPrice)}</span>
                                </div>
                                <div className="text-sm text-gray-500 font-medium">
                                    <p>{dayjs(booking.bookingDate).format('D MMMM YYYY')}</p>
                                    <p>{booking.startTime.substring(0, 5)} - {booking.endTime.substring(0, 5)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cancellation Reason Section */}
                    <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8">
                        <h2 className="text-xl font-bold mb-8">Alasan Pembatalan</h2>

                        <div className="space-y-4">
                            {reasons.map((reason) => (
                                <div key={reason} className="space-y-4">
                                    <label
                                        className={cn(
                                            "flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer group",
                                            selectedReason === reason
                                                ? "bg-primary/5 border-primary/30"
                                                : "bg-white/5 border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                            selectedReason === reason
                                                ? "border-primary"
                                                : "border-gray-600 group-hover:border-gray-400"
                                        )}>
                                            {selectedReason === reason && (
                                                <div className="w-3 h-3 rounded-full bg-primary" />
                                            )}
                                        </div>
                                        <input
                                            type="radio"
                                            name="reason"
                                            className="hidden"
                                            checked={selectedReason === reason}
                                            onChange={() => setSelectedReason(reason)}
                                        />
                                        <span className={cn(
                                            "font-bold transition-colors",
                                            selectedReason === reason ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                                        )}>
                                            {reason}
                                        </span>
                                    </label>

                                    {reason === "Lainnya" && selectedReason === "Lainnya" && (
                                        <textarea
                                            placeholder="Tuliskan alasan Anda di sini..."
                                            value={otherReason}
                                            onChange={(e) => setOtherReason(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors h-32 resize-none"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={handleConfirmCancel}
                                className="w-full bg-primary text-[#051111] py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(0,214,181,0.2)]"
                            >
                                Konfirmasi Pembatalan
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Kembali
                            </button>
                        </div>
                        <p className="text-center text-[10px] font-bold text-gray-500">
                            *Catatan: Pesanan yang sudah dibatalkan tidak dapat dipulihkan kembali.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-white/5 py-10 mt-20 opacity-40 text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">&copy; 2024 SMASHCLUB INDONESIA. ALL RIGHTS RESERVED.</p>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#051111]/95 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="container mx-auto px-4 max-w-2xl text-center">
                        {/* Success Icon */}
                        <div className="relative w-40 h-40 mx-auto mb-10 group">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[40px] animate-pulse"></div>
                            <div className="absolute inset-2 border-2 border-primary/30 rounded-full"></div>
                            <div className="relative w-full h-full bg-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,214,181,0.4)]">
                                <Check className="w-20 h-20 text-[#051111] stroke-[3px]" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-6">
                            Pembatalan <span className="text-primary">Berhasil</span>
                        </h2>
                        <p className="text-gray-400 font-bold text-lg leading-relaxed max-w-md mx-auto mb-8">
                            Pesanan Anda telah berhasil dibatalkan. Dana (jika ada) akan dikembalikan sesuai dengan ketentuan yang berlaku.
                        </p>

                        <p className="text-primary font-black uppercase tracking-widest text-sm mb-12">
                            ID Pesanan: #{booking.bookingCode}
                        </p>

                        {/* Buttons */}
                        <div className="space-y-4 max-w-md mx-auto">
                            <Link
                                to="/"
                                className="w-full bg-primary text-[#051111] py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-[0_4px_30px_rgba(0,214,181,0.2)]"
                            >
                                <Home className="w-5 h-5" /> Kembali ke Beranda
                            </Link>
                            <Link
                                to="/booking-history"
                                className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                            >
                                <ClipboardList className="w-5 h-5 text-primary" /> Lihat Riwayat Pesanan
                            </Link>
                        </div>

                        {/* Bottom Help Section */}
                        <div className="mt-16 bg-[#0a1a1a] border border-white/5 rounded-3xl p-6 flex items-center gap-5 max-w-md mx-auto group cursor-pointer hover:border-primary/20 transition-all">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/10 transition-all">
                                <HelpCircle className="w-6 h-6" />
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="text-sm font-black uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">Butuh bantuan?</h4>
                                <p className="text-[10px] text-gray-500 font-bold leading-tight">
                                    Punya pertanyaan mengenai pembatalan ini?
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-primary">
                                <span className="text-xs font-black uppercase tracking-widest group-hover:mr-1 transition-all">Hubungi Dukungan</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="mt-16 opacity-30">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">&copy; 2024 SMASHCLUB INDONESIA. SELURUH HAK CIPTA DILINDUNGI.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
