import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Check, Home, ClipboardList, ArrowLeft, ShieldCheck, HelpCircle, Wallet } from "lucide-react"
import { useBookingStore } from "../../features/booking/booking.store"

export default function BookingRefundPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { bookingHistory } = useBookingStore()
    const [selectedReason, setSelectedReason] = useState<string>("")
    const [additionalInfo, setAdditionalInfo] = useState<string>("")
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    // Find the booking in history or use mock
    const booking = bookingHistory.find(b => b.id === id)

    const mockBooking = {
        id: id || "2023081501",
        courtName: "Emerald Tennis Center",
        date: "15 Agustus 2023",
        totalPrice: 505000,
        status: 'SELESAI',
    }

    const currentBooking = booking ? booking : mockBooking

    const reasons = [
        "Jadwal tidak sesuai",
        "Perubahan rencana",
        "Kesalahan sistem saat pembayaran",
        "Fasilitas tidak memadai",
        "Lainnya"
    ]

    const handleSubmitRefund = () => {
        if (!selectedReason) {
            alert("Mohon pilih alasan pengembalian dana.")
            return
        }

        setShowSuccessModal(true)
    }

    return (
        <div className="bg-[#051111] min-h-screen text-white font-sans overflow-x-hidden">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Header with Back Arrow */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-1.5 rounded-lg text-[#051111]">
                            <span className="font-black text-xs">S</span>
                        </div>
                        <span className="font-black tracking-tighter text-xl italic uppercase">SmashClub</span>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>

                {/* Title Section */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black mb-3 uppercase italic tracking-tighter">
                        Pengajuan <span className="text-primary">Pengembalian Dana</span>
                    </h1>
                    <p className="text-gray-400 font-medium text-sm">
                        Silakan lengkapi formulir di bawah ini untuk memproses refund pesanan Anda.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Order Details Card */}
                    <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShieldCheck className="w-24 h-24 text-primary" />
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-bold text-primary">Rincian Pesanan</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 tracking-widest uppercase">ID Pesanan</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-gray-300">
                                    #SC-{currentBooking.id}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 tracking-widest uppercase">Tanggal Pesanan</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-gray-300">
                                    {currentBooking.date}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Refund Reason Card */}
                    <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <HelpCircle className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-bold text-primary">Alasan Pengembalian</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300">Pilih Alasan</label>
                                <select
                                    value={selectedReason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer font-medium"
                                >
                                    <option value="" disabled className="bg-[#0a1a1a]">Pilih alasan utama...</option>
                                    {reasons.map(r => (
                                        <option key={r} value={r} className="bg-[#0a1a1a]">{r}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-300">Penjelasan Tambahan</label>
                                    <span className="text-[10px] font-bold text-gray-600 uppercase">Opsional</span>
                                </div>
                                <textarea
                                    placeholder="Berikan detail lebih lanjut tentang pengajuan Anda..."
                                    value={additionalInfo}
                                    onChange={(e) => setAdditionalInfo(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors h-32 resize-none font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Refund Destination Info */}
                    <div className="bg-[#112426] border border-primary/20 rounded-3xl p-6 flex items-center gap-4 group">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white mb-0.5">Metode Pengembalian Dana</h3>
                            <p className="text-[11px] text-gray-400 font-medium">Dana akan dikembalikan ke <span className="text-primary font-bold">Smash Pay</span> Anda setelah pengajuan disetujui.</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            onClick={handleSubmitRefund}
                            className="w-full bg-primary text-[#051111] py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_4px_30px_rgba(0,214,181,0.3)] mb-6"
                        >
                            Ajukan Refund
                        </button>
                        <p className="text-center text-[11px] font-bold text-gray-500 leading-relaxed max-w-md mx-auto">
                            Dengan mengajukan refund, Anda menyetujui <button className="text-primary hover:underline">Syarat & Ketentuan</button> pembatalan pesanan di SmashClub.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="py-12 mt-12 opacity-30 text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-loose">
                        &copy; 2023 SMASHCLUB COMMUNITY. ALL RIGHTS RESERVED.<br />
                        ESTABLISHED IN JAKARTA, INDONESIA.
                    </p>
                </div>
            </div >

            {/* Success Modal */}
            {
                showSuccessModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#051111]/95 backdrop-blur-md animate-in fade-in duration-500">
                        <div className="container mx-auto px-4 max-w-xl text-center">
                            {/* Success Icon */}
                            <div className="relative w-40 h-40 mx-auto mb-10">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse"></div>
                                <div className="relative w-full h-full bg-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,214,181,0.4)]">
                                    <Check className="w-20 h-20 text-[#051111] stroke-[4px]" />
                                </div>
                            </div>

                            {/* Text Content */}
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-6">
                                Pengajuan <span className="text-primary">Diterima</span>
                            </h2>
                            <p className="text-gray-400 font-bold text-lg leading-relaxed max-w-md mx-auto mb-12">
                                Permintaan refund Anda telah kami terima dan sedang dalam proses peninjauan. Dana akan dikreditkan ke <span className="text-primary">Smash Pay</span> Anda dalam 1-3 hari kerja.
                            </p>

                            {/* Buttons */}
                            <div className="space-y-4 max-w-xs mx-auto">
                                <button
                                    onClick={() => navigate(`/booking/${currentBooking.id}/refund-details`, { state: { reason: selectedReason, additionalInfo, status: 'PENGAJUAN' } })}
                                    className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all shadow-[0_4px_30px_rgba(0,214,181,0.2)]"
                                >
                                    <ClipboardList className="w-5 h-5 flex-shrink-0" /> Lihat Detail Refund
                                </button>
                                <Link
                                    to="/"
                                    className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                                >
                                    <Home className="w-5 h-5 flex-shrink-0" /> Kembali ke Beranda
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
