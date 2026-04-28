import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ChevronRight, HelpCircle, ExternalLink, Check, Home, ClipboardList, ArrowRight, Package } from "lucide-react"
import { useShopStore } from "../../features/shop/shop.store"
import { cn } from "../../lib/utils"

export default function ShopOrderCancelPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { orderHistory, cancelOrder } = useShopStore()
    const [selectedReason, setSelectedReason] = useState<string>("")
    const [otherReason, setOtherReason] = useState<string>("")
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    // Find the order in history
    const order = orderHistory.find(o => o.id === Number(id))

    if (!order) {
        return (
            <div className="bg-[#051111] min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                    <Package className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2 italic uppercase tracking-tighter">PESANAN TIDAK <span className="text-red-500">DITEMUKAN</span></h1>
                <p className="text-gray-400 font-medium mb-8 max-w-md">Maaf, kami tidak dapat memproses pembatalan untuk pesanan yang tidak terdaftar.</p>
                <Link to="/shop/orders" className="bg-primary text-[#051111] px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-primary/90 transition-all shadow-[0_8px_30px_rgba(34,197,94,0.3)]">
                    Kembali ke Riwayat Pesanan
                </Link>
            </div>
        )
    }

    const currentOrder = order
    const mainItem = currentOrder.items[0]

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    const reasons = [
        "Salah pilih produk / varian",
        "Ingin mengubah metode pembayaran",
        "Menemukan harga lebih murah di toko lain",
        "Lainnya"
    ]

    const handleConfirmCancel = () => {
        if (!selectedReason) {
            alert("Mohon pilih alasan pembatalan.")
            return
        }

        if (selectedReason === "Lainnya" && !otherReason.trim()) {
            alert("Mohon tuliskan alasan Anda.")
            return
        }

        if (id) {
            cancelOrder(Number(id))
        }

        setShowSuccessModal(true)
    }

    return (
        <div className="bg-[#051111] min-h-screen text-white font-sans overflow-x-hidden">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-8 text-gray-500">
                    <Link to="/shop/orders" className="hover:text-white transition-colors">Pesanan Saya</Link>
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
                    {/* Product Detail Section */}
                    <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8">
                        <h2 className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase mb-6">DETAIL PRODUK</h2>

                        <div className="flex gap-6 group">
                            <div className="w-24 h-24 rounded-2xl bg-gray-900 border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center p-3">
                                <img src={mainItem?.image} alt={mainItem?.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Kode Pesanan: #{currentOrder.orderCode}</p>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold">{mainItem?.name}</h3>
                                    <span className="text-xl font-bold text-primary">{formatPrice(currentOrder.total)}</span>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Jumlah: {mainItem?.quantity} Unit</p>
                            </div>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8 flex gap-6 items-start">
                        <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                            <HelpCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-2">BUTUH BANTUAN?</h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-4">
                                Memiliki kendala dengan pesanan Anda? Tim dukungan kami siap membantu Anda menyelesaikan masalah tanpa harus membatalkan pesanan.
                            </p>
                            <a href="#" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                Hubungi Dukungan Pelanggan <ExternalLink className="w-3 h-3" />
                            </a>
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
                            KODE PESANAN: #{currentOrder.orderCode}
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
                                to="/shop/orders"
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
