import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Calendar, Clock, Loader2 } from "lucide-react"
import { useBookingStore } from "../../features/booking/booking.store"
import { useQuery } from "@tanstack/react-query"
import { bookingService } from "../../features/booking/booking.service"
import { transactionService } from "../../features/booking/transaction.service"

import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

export default function CheckoutPage() {
    const { courtId } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const urlBookingCode = searchParams.get('bookingCode')

    const {
        selectedDate,
        selectedSlots,
        addBookingToHistory,
        resetBooking,
    } = useBookingStore();

    const selectedSlotsCount = selectedSlots.length;

    // Fetch booking details to get real prices and info from server
    const { data: bookingResponse, isLoading: isLoadingSummary } = useQuery({
        queryKey: ['booking-details', urlBookingCode],
        queryFn: () => bookingService.getBookingDetails(urlBookingCode || ""),
        enabled: !!urlBookingCode
    });

    const summaryData = bookingResponse?.data;

    // Prices from API if available, otherwise fallback to local calculation
    const courtPrice = summaryData?.basePrice || 0;
    const coachPrice = summaryData?.coaches?.reduce((sum, c) => sum + (c.coachPrice || 0), 0) || 0;
    const equipmentPrice = summaryData?.equipment?.reduce((sum, e) => sum + (e.equipmentPrice || 0), 0) || 0;
    const serviceFee = 0; // Service fee removed as per user request
    const totalPrice = summaryData?.totalPrice || 0;

    const timeRange = selectedSlots.length > 0
        ? `${selectedSlots[0]} - ${`${parseInt(selectedSlots[selectedSlots.length - 1].split(':')[0]) + 1}:00`}`
        : "-";



    const handlePayment = async () => {
        if (!urlBookingCode || !summaryData) {
            alert("Informasi booking tidak ditemukan.");
            return;
        }

        const bookingCode = urlBookingCode;

        // Add to local history (keeping as fallback/state)
        addBookingToHistory({
            id: bookingCode,
            courtName: summaryData.court.courtName,
            courtType: summaryData.court.courtCode,
            date: dayjs(summaryData.bookingDate).format('D MMM YYYY'),
            timeRange: `${summaryData.startTime.substring(0, 5)} - ${summaryData.endTime.substring(0, 5)}`,
            totalPrice: summaryData.totalPrice,
            status: 'MENUNGGU BAYAR',
            image: summaryData.court.courtImgLink || "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop",
            coachName: summaryData.coaches.length > 0 ? summaryData.coaches[0].coachName : undefined,
            equipments: summaryData.equipment.map(e => ({ name: e.equipmentName, quantity: e.quantity, price: e.pricePerUnit })),
            courtPrice: summaryData.basePrice,
            coachPrice: coachPrice,
            equipmentPrice: equipmentPrice,
            serviceFee: serviceFee
        });

        // Reset booking state
        resetBooking();

        // Attempt to get payment link from summary data first
        const directInvoiceUrl = summaryData.respCreateTransactionDTO?.paymentData?.invoiceUrl;
        if (directInvoiceUrl) {
            window.location.href = directInvoiceUrl;
            return;
        }

        // Fallback to transaction service if not in summary
        try {
            const transactionResponse = await transactionService.getTransactionDetail(bookingCode);
            if (transactionResponse.success && transactionResponse.data.paymentLink) {
                window.location.href = transactionResponse.data.paymentLink;
                return;
            }
        } catch (error) {
            console.error("Failed to fetch transaction detail:", error);
        }

        // Final fallback to success page
        navigate("/booking/success", { state: { bookingCode } });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Breadcrumb / Header Centered */}
            <div className="mb-8 text-center">
                <div className="text-sm text-gray-400 flex items-center justify-center gap-2 mb-2">
                    <Link to={`/booking/schedule/${courtId || '1'}`} className="hover:text-white">Jadwal</Link>
                    <span>&rsaquo;</span>
                    <span className="text-white">Checkout</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Checkout Booking Tennis</h1>
                <p className="text-gray-400">Konfirmasi pesanan SmashClub Anda di bawah ini.</p>
            </div>

            <div className="max-w-md mx-auto">
                {/* Summary Card */}
                <div className="bg-[#16282a] border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Ringkasan Pesanan</h2>

                    {isLoadingSummary ? (
                        <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 text-primary animate-pulse" />
                                </div>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Memuat Detail...</p>
                        </div>
                    ) : (
                        <>
                            {/* Court Snippet */}
                            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-700 border-dashed">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800">
                                    <img
                                        src={summaryData?.court.courtImgLink || "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop"}
                                        alt="Court"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{summaryData?.court.courtName || "Center Court Arena"}</h3>
                                    <div className="text-xs text-gray-400 mb-2">{summaryData?.court.courtCode || "Lapangan Indoor 02"}</div>
                                    <div className="flex flex-col gap-1">
                                        <div className="inline-flex items-center px-2 py-1 rounded bg-[#0f2226] border border-gray-700 text-[10px] text-primary">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {dayjs(selectedDate).format('D MMM YYYY')}
                                        </div>
                                        <div className="inline-flex items-center px-2 py-1 rounded bg-[#0f2226] border border-gray-700 text-[10px] text-primary">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {timeRange}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 text-sm mb-6 border-b border-gray-700 border-dashed pb-6">
                                <div className="flex justify-between items-center text-gray-300">
                                    <span>Sewa Lapangan ({selectedSlotsCount} Jam)</span>
                                    <span className="font-bold text-white">
                                        Rp {courtPrice.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                {coachPrice > 0 && (
                                    <div className="flex justify-between items-center text-gray-300">
                                        <span>Pelatih</span>
                                        <span className="font-bold text-white">
                                            Rp {coachPrice.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                )}
                                {equipmentPrice > 0 && summaryData?.equipment?.map(e => (
                                    <div key={e.id} className="flex justify-between items-center text-gray-300">
                                        <span>{e.equipmentName} ({e.quantity} unit)</span>
                                        <span className="font-bold text-white">Rp {(e.equipmentPrice * e.quantity).toLocaleString('id-ID')}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-end mb-8">
                                <span className="text-gray-300 font-medium">Total Pembayaran</span>
                                <span className="text-3xl font-bold text-primary">
                                    Rp {totalPrice.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </>
                    )}

                    <button
                        onClick={handlePayment}
                        disabled={isLoadingSummary}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-[#0a1a1a] text-center font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,214,181,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoadingSummary ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Menghitung Harga...
                            </>
                        ) : (
                            "Konfirmasi Booking"
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
}
