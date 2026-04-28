import { Link } from "react-router-dom"
import { ShoppingBag, ChevronRight, Package, ChevronLeft } from "lucide-react"
import { useShopStore } from "../../features/shop/shop.store"
import { cn } from "../../lib/utils"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function ShopOrderHistoryPage() {
    const { orderHistory, getOrderHistoryAPI, isLoading } = useShopStore()

    useEffect(() => {
        getOrderHistoryAPI()
    }, [getOrderHistoryAPI])

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    const statusStyles = {
        'MENUNGGU PEMBAYARAN': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
        'DIPROSES': 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        'SIAP DIAMBIL': 'bg-primary/10 border-primary/30 text-primary',
        'SELESAI': 'bg-green-500/10 border-green-500/30 text-green-400',
        'DIBATALKAN': 'bg-red-500/10 border-red-500/30 text-red-500'
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-4">
                <Link to="/" className="text-gray-500 hover:text-white transition-colors">BERANDA</Link>
                <span className="text-gray-700">/</span>
                <Link to="/shop" className="text-gray-500 hover:text-white transition-colors">SHOP</Link>
                <span className="text-gray-700">/</span>
                <span className="text-primary">PESANAN SAYA</span>
            </div>

            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Pesanan Saya</h1>
                <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                    Kelola dan pantau status pembelian perlengkapan SmashClub Anda.
                </p>
            </div>

            {/* Main Content Card */}
            <div className="bg-[#0a1a1a] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                {/* Table Header - Desktop Only */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="col-span-4 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">PRODUK</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">TANGGAL</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">TOTAL</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">STATUS</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase text-right px-4">AKSI</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                    {isLoading ? (
                        <div className="py-24 text-center">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-white mb-2 uppercase italic tracking-tighter">Memuat <span className="text-primary">Riwayat Pesanan...</span></h3>
                        </div>
                    ) : orderHistory.length > 0 ? (
                        orderHistory.map((order) => (
                            <div key={order.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center px-8 py-8 hover:bg-white/[0.01] transition-all group">
                                {/* Produk */}
                                <div className="col-span-1 md:col-span-4 flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-900 border border-white/5 flex-shrink-0 group-hover:border-primary/30 transition-colors flex items-center justify-center p-2">
                                        {order.orderItemImgLink ? (
                                            <img src={order.orderItemImgLink} alt={order.orderCode} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <Package className="w-8 h-8 text-gray-700" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                            {order.items.length > 0 ? order.items[0].name : 'Pesanan'}
                                            {order.items.length > 1 && <span className="text-gray-500 text-sm ml-2">+{order.items.length - 1} produk lainnya</span>}
                                        </h3>
                                        <p className="text-sm text-gray-500 tracking-wider">Kode Pesanan: #{order.orderCode}</p>
                                    </div>
                                </div>

                                {/* Tanggal */}
                                <div className="col-span-1 md:col-span-2">
                                    <div className="text-sm font-bold text-gray-200">{order.date.split(',')[0]}</div>
                                    <div className="text-xs text-gray-500 mt-1">{order.date.split(',')[1] || ''}</div>
                                </div>

                                {/* Total */}
                                <div className="col-span-1 md:col-span-2 font-sans font-bold text-xl text-white">
                                    {formatPrice(order.total)}
                                </div>

                                {/* Status */}
                                <div className="col-span-1 md:col-span-2">
                                    <div className={cn(
                                        "inline-flex px-3 py-1 rounded-full text-[9px] font-black border tracking-widest uppercase",
                                        statusStyles[order.status]
                                    )}>
                                        {order.status}
                                    </div>
                                </div>

                                {/* Aksi */}
                                <div className="col-span-1 md:col-span-2 flex flex-col md:items-end gap-3 px-0 md:px-4">
                                    <Link to={`/shop/order/${order.id}`} className="bg-primary text-[#051111] px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_4px_15px_rgba(34,197,94,0.2)]">
                                        Lihat Detail
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Belum ada pesanan</h3>
                            <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                                Anda belum melakukan pembelian produk apapun di SmashClub Store.
                            </p>
                            <Link to="/shop" className="inline-flex bg-primary text-[#051111] px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-primary/90 transition-all shadow-[0_8px_30px_rgba(34,197,94,0.3)]">
                                Mulai Belanja
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {orderHistory.length > 0 && (
                    <div className="px-8 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.01]">
                        <p className="text-xs text-gray-500 font-bold tracking-tight">
                            Menampilkan <span className="text-gray-300">1 - {orderHistory.length}</span> dari <span className="text-gray-300">{orderHistory.length}</span> pesanan
                        </p>
                        <div className="flex items-center gap-3">
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-600 border border-white/5">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-[#051111] font-black text-xs">1</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-600 border border-white/5">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
