import { useQuery } from "@tanstack/react-query"
import { bookingService } from "../../features/booking/booking.service"
import dayjs from 'dayjs'
import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import { Calendar, Clock, ExternalLink, User, MapPin, ArrowLeft, XCircle, Loader2, CreditCard } from "lucide-react"
import { useBookingStore } from "../../features/booking/booking.store"
import { cn } from "../../lib/utils";

export default function BookingHistoryDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate();
    const location = useLocation();
    const bookingId = id || location.state?.bookingCode;
    const { setCourtId, setSelectedCoach, setSelectedEquipments, setSelectedSlots } = useBookingStore();

    const { data: bookingResponse, isLoading, error } = useQuery({
        queryKey: ['booking-history-detail', bookingId],
        queryFn: () => bookingService.getBookingDetails(bookingId!),
        enabled: !!bookingId
    });

    const booking = bookingResponse?.data;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#051111]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !booking || !bookingResponse?.success) {
        return (
            <div className="container mx-auto px-4 py-24 text-center bg-[#051111] min-h-screen">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-3xl font-black text-white mb-4">Booking Tidak Ditemukan</h1>
                <p className="text-gray-400 mb-8">Maaf, kami tidak dapat menemukan detail pesanan dengan kode tersebut.</p>
                <Link to="/booking-history" className="text-primary font-bold hover:underline">Kembali ke Riwayat</Link>
            </div>
        );
    }

    const statusMapping: Record<string, { label: string, color: string }> = {
        'COMPLETED': { label: 'SELESAI', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
        'SELESAI': { label: 'SELESAI', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
        'PENDING': { label: 'MENUNGGU BAYAR', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
        'MENUNGGU BAYAR': { label: 'MENUNGGU BAYAR', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
        'CONFIRMED': { label: 'DIKONFIRMASI', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
        'DIKONFIRMASI': { label: 'DIKONFIRMASI', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
        'ONGOING': { label: 'SEDANG BERJALAN', color: 'bg-primary/10 border-primary/30 text-primary' },
        'SEDANG BERJALAN': { label: 'SEDANG BERJALAN', color: 'bg-primary/10 border-primary/30 text-primary' },
        'CANCELLED': { label: 'DIBATALKAN', color: 'bg-red-500/10 border-red-500/30 text-red-400' },
        'DIBATALKAN': { label: 'DIBATALKAN', color: 'bg-red-500/10 border-red-500/30 text-red-400' }
    };

    const status = statusMapping[booking.statusDescription] || statusMapping[booking.status] || { label: booking.statusDescription || booking.status.toString(), color: 'bg-gray-500/10 border-gray-500/30 text-gray-400' };

    const handleBookingLagi = () => {
        setCourtId(booking.court.id.toString());
        setSelectedCoach(null);
        setSelectedEquipments([]);

        // if (booking.coaches.length > 0) {
        //     const c = booking.coaches[0];
        //     setSelectedCoach({
        //         id: c.id?.toString() || "",
        //         name: c.coachName,
        //         specialization: "Sesi Latihan Pro",
        //         price: c.pricePerHour,
        //         image: c.coachImgLink || ""
        //     });
        // }

        // if (booking.equipment.length > 0) {
        //     setSelectedEquipments(booking.equipment.map(e => ({
        //         id: e.id?.toString() || "",
        //         name: e.equipmentName,
        //         price: e.pricePerUnit,
        //         image: "",
        //         quantity: e.quantity,
        //         unit: e.categoryName === 'Bola' ? 'item' : 'sesi'
        //     })));
        // }

        setSelectedSlots([]);
        navigate(`/booking/schedule/${booking.court.id}`);
    };

    const isPendingPayment = booking.statusDescription === 'MENUNGGU BAYAR' || booking.statusDescription === 'PENDING' || booking.status === 1;

    const coachPrice = booking.coaches.reduce((acc: number, coach: any) => acc + coach.coachPrice, 0);
    const equipmentPrice = booking.equipment.reduce((acc: number, eq: any) => acc + eq.equipmentPrice, 0);

    return (
        <div className="bg-[#051111] min-h-screen">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <div className="text-sm text-gray-400 flex items-center gap-2 mb-4">
                        <Link to="/booking-history" className="hover:text-white flex items-center gap-1">
                            Riwayat
                        </Link>
                        <span>&rsaquo;</span>
                        <span className="text-primary font-bold">Detail Pesanan</span>
                        <div className="flex-1" />
                        <button onClick={() => navigate(-1)} className="hover:text-white flex items-center gap-1 text-xs">
                            <ArrowLeft className="w-3 h-3" /> Kembali
                        </button>
                    </div>

                    {/* Header Info */}
                    <div className="bg-[#0a1a1a] border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-2">Detail Riwayat Pesanan</h1>
                            <p className="text-gray-500 text-sm font-bold tracking-tight">ID Pesanan: #{booking.bookingCode}</p>
                        </div>
                        <div className="md:text-right">
                            <div className={cn(
                                "inline-flex items-center px-4 py-1.5 text-[10px] font-black tracking-widest rounded-full mb-3 border",
                                status.color
                            )}>
                                {status.label}
                            </div>
                            <div className="text-xs text-gray-600 font-bold">Dipesan pada {dayjs(booking.createdAt).format('D MMM YYYY, HH:mm')}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Details - Left */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Informasi Lapangan */}
                        <div className="bg-[#0a1a1a] border border-white/5 rounded-[2rem] p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <MapPin className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Informasi Lapangan</h2>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-full md:w-40 h-40 bg-gray-900 rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden flex-shrink-0">
                                    <img src={booking.court.courtImgLink || "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop"} alt={booking.court.courtName} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="font-black text-white text-2xl mb-1">{booking.court.courtName}</h3>
                                        <p className="text-gray-500 font-bold text-sm">{booking.court.courtCode}</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-xl border border-white/5">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-gray-200 font-bold">{dayjs(booking.bookingDate).format('D MMMM YYYY')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-xl border border-white/5">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-gray-200 font-bold">{booking.startTime.substring(0, 5)} - {booking.endTime.substring(0, 5)} ({booking.durationHour} Jam)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Layanan Tambahan */}
                        {(booking.coaches.length > 0 || booking.equipment.length > 0) && (
                            <div className="bg-[#0a1a1a] border border-white/5 rounded-[2rem] p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-5 h-5 flex items-center justify-center bg-primary text-[#051111] text-[10px] font-black rounded-sm">+</div>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Layanan Tambahan</h2>
                                </div>

                                <div className="space-y-4">
                                    {booking.coaches.map((coach, idx) => (
                                        <div key={`coach-${idx}`} className="flex items-center gap-5 bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-white text-base">Pelatih ({coach.coachName})</div>
                                                <div className="text-xs text-gray-500 font-medium">Sesi Latihan Pro</div>
                                            </div>
                                            <div className="font-black text-white">Rp {coach.coachPrice.toLocaleString('id-ID')}</div>
                                        </div>
                                    ))}

                                    {booking.equipment.map((item, idx) => (
                                        <div key={`eq-${idx}`} className="flex items-center gap-5 bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                <div className="w-6 h-6 flex items-center justify-center font-black">E</div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-white text-base">{item.equipmentName} ({item.quantity} unit)</div>
                                                <div className="text-xs text-gray-500 font-medium">{item.brand} - {item.type}</div>
                                            </div>
                                            <div className="font-black text-white">Rp {item.equipmentPrice.toLocaleString('id-ID')}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Summary - Right */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0a1a1a] border border-white/5 rounded-[2rem] p-8 shadow-2xl">
                            <h2 className="text-lg font-bold text-white mb-8 uppercase tracking-tight border-b border-white/5 pb-4">Ringkasan Pembayaran</h2>

                            <div className="space-y-4 text-sm mb-8 border-b border-white/5 border-dashed pb-8">
                                <div className="flex justify-between items-center text-gray-500 font-bold">
                                    <span>Sewa Lapangan ({booking.durationHour} Jam)</span>
                                    <span className="text-white">Rp {booking.basePrice.toLocaleString('id-ID')}</span>
                                </div>
                                {coachPrice > 0 && (
                                    <div className="flex justify-between items-center text-gray-500 font-bold">
                                        <span>Pelatih</span>
                                        <span className="text-white">Rp {coachPrice.toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                {equipmentPrice > 0 && (
                                    <div className="flex justify-between items-center text-gray-500 font-bold">
                                        <span>Sewa Alat</span>
                                        <span className="text-white">Rp {equipmentPrice.toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                            </div>

                            <div className="text-center">
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">TOTAL PEMBAYARAN</div>
                                <div className="text-4xl font-black text-primary tracking-tighter italic">
                                    Rp {booking.totalPrice.toLocaleString('id-ID')}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {isPendingPayment ? (
                                <a
                                    href={booking.respCreateTransactionDTO?.paymentData.invoiceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-5 bg-primary text-[#051111] font-black rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-[0_4px_30px_rgba(0,214,181,0.2)] text-sm uppercase tracking-widest"
                                >
                                    <CreditCard className="w-5 h-5" /> Lanjutkan Pembayaran
                                </a>
                            ) : (
                                <button
                                    onClick={handleBookingLagi}
                                    className="w-full py-5 bg-primary text-[#051111] font-black rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-[0_4px_30px_rgba(0,214,181,0.2)] text-sm uppercase tracking-widest"
                                >
                                    <Calendar className="w-5 h-5" /> Booking Lagi
                                </button>
                            )}

                            {['CONFIRMED', 'DIKONFIRMASI'].includes(booking.statusDescription) && (
                                <Link to={`/booking/${booking.bookingCode}/cancel`} className="w-full py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
                                    <XCircle className="w-5 h-5" /> Cancel Booking
                                </Link>
                            )}

                            <div className="bg-[#0a1a1a] border border-white/5 rounded-[2rem] p-6 text-center">
                                <div className="text-xs text-gray-500 font-bold mb-3 uppercase tracking-widest">Mengalami kendala?</div>
                                <a href="#" className="text-primary text-xs font-black uppercase tracking-widest hover:underline flex items-center justify-center gap-2">
                                    Hubungi Pusat Bantuan <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
