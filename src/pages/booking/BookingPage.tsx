import { MapPin, Star, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { bookingService } from "../../features/booking/booking.service"

export default function BookingPage() {
    const { data: courtsResponse, isLoading } = useQuery({
        queryKey: ['courts'],
        queryFn: bookingService.getAllCourts
    });

    const courts = courtsResponse?.data || [];

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Memuat daftar lapangan...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Cari Lapangan</h1>
                <p className="text-gray-400">Temukan lapangan tennis terbaik di sekitar Anda</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courts.length > 0 ? (
                    courts.map(court => (
                        <div key={court.id} className="bg-[#16282a] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all group">
                            <div className="relative h-48 overflow-hidden bg-gray-900 flex items-center justify-center">
                                {court.courtImgLink ? (
                                    <img
                                        src={court.courtImgLink}
                                        alt={court.courtName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-700">
                                        <MapPin className="w-12 h-12 opacity-20" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1">
                                    <Star className="w-3 h-3 text-secondary fill-secondary" />
                                    <span className="text-xs font-bold text-white">4.8</span>
                                    <span className="text-[10px] text-gray-400">(0)</span>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{court.courtCode}</div>
                                <h3 className="font-bold text-white text-lg mb-1">{court.courtName}</h3>
                                <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-4">
                                    <Clock className="w-4 h-4" />
                                    {court.openTime.substring(0, 5)} - {court.closeTime.substring(0, 5)}
                                </div>

                                <div className="border-t border-gray-700/50 pt-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] text-gray-400">Mulai dari</div>
                                        <div className="font-bold text-white">
                                            Rp {court.pricePerHour.toLocaleString("id-ID")}
                                            <span className="text-xs font-normal text-gray-500">/jam</span>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/booking/schedule/${court.id}`}
                                        className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-[#0a1a1a] rounded-lg text-sm font-bold transition-all"
                                    >
                                        Book
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-card/10 border border-dashed border-gray-800 rounded-2xl">
                        <MapPin className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-50" />
                        <h3 className="text-white font-bold mb-1">Tidak Ada Lapangan</h3>
                        <p className="text-gray-500 text-sm">Maaf, saat ini tidak ada lapangan yang tersedia.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
