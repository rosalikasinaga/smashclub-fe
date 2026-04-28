import { Link, useNavigate, useLocation } from "react-router-dom"
import { ShoppingBag, ArrowLeft, Loader2, Package, Clock, MapPin, CheckCircle2, AlertCircle, X } from "lucide-react"
import { useState } from "react"
import { useShopStore } from "../../features/shop/shop.store"

export default function ShopCheckoutPage() {
    const { cart, getSubtotal, addOrder, buyNowAPI, checkoutCartAPI } = useShopStore()
    const navigate = useNavigate()
    const location = useLocation()
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })

    // Check for order data passed from previous steps
    const orderIdFromState = location.state?.orderId
    const orderCodeFromState = location.state?.orderCode
    const isBuyNow = location.state?.isBuyNow
    const buyNowItem = location.state?.buyNowItem
    const cartItemsFromState = location.state?.items
    const subtotalFromState = location.state?.subtotal

    // Use either the single buy now item, passed items, or the entire store cart
    const checkoutItems = buyNowItem ? [buyNowItem] : (cartItemsFromState || cart)

    // Calculate subtotal based on source
    const subtotal = subtotalFromState || (buyNowItem ? (buyNowItem.price * buyNowItem.quantity) : getSubtotal())

    const shipping = 0 // Mock free shipping
    const insurance = 0 // Mock free insurance
    const serviceFee = 0
    const total = subtotal + shipping + insurance + serviceFee

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    if (checkoutItems.length === 0 && !orderIdFromState) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Keranjang Anda kosong</h1>
                <p className="text-gray-400 mb-8">Tambahkan beberapa produk ke keranjang Anda sebelum checkout.</p>
                <Link to="/shop" className="inline-flex items-center gap-2 text-primary hover:underline font-bold">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Katalog
                </Link>
            </div>
        )
    }

    const handlePayment = async () => {
        setIsProcessing(true)
        try {
            let orderId = orderIdFromState;
            let response: any = null;

            // If it's a Buy Now and we don't have an orderId yet, create it now
            if (isBuyNow && !orderId && buyNowItem) {
                response = await buyNowAPI(buyNowItem.variantId, buyNowItem.quantity);
                if (response?.data?.orderId) {
                    orderId = response.data.orderId;
                } else {
                    setErrorModal({ show: true, message: "Checkout gagal." });
                    setIsProcessing(false);
                    return;
                }
            }
            // If it's a regular cart checkout (not buy now) and no orderId, call checkoutCartAPI
            else if (!isBuyNow && !orderId && cart.length > 0) {
                response = await checkoutCartAPI();
                if (response?.data?.orderId) {
                    orderId = response.data.orderId;
                } else {
                    setErrorModal({ show: true, message: "Checkout gagal." });
                    setIsProcessing(false);
                    return;
                }
            }

            // If we still don't have an orderId (and it wasn't already in state), fail
            if (!orderId) {
                setErrorModal({ show: true, message: "Gagal melanjutkan checkout." });
                setIsProcessing(false);
                return;
            }

            const finalOrderId = orderId.toString();
            const paymentLink = response?.data?.paymentLink;

            addOrder({
                id: finalOrderId,
                orderCode: orderCodeFromState,
                items: checkoutItems,
                orderItemImgLink: checkoutItems[0]?.image || checkoutItems[0]?.variantImgLink || '',
                subtotal,
                shipping,
                insurance,
                serviceFee,
                total,
                status: 'MENUNGGU PEMBAYARAN',
                date: new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) + ' WIB',
                rawDate: new Date().toISOString(),
                refundStatus: 0,
                refundRequestDate: null,
                refundStatusUpdateDate: null,
                paymentLink: paymentLink,
                updatedAt: null
            });

            // Handle automatic redirect/new tab for paymentLink
            if (paymentLink) {
                // Open in new tab
                window.open(paymentLink, '_blank');
            }

            // Navigate to the order detail page
            navigate(`/shop/order/${finalOrderId}`);
        } catch (error) {
            console.error(error);
            setErrorModal({ show: true, message: "Gagal melakukan pembayaran. Silakan coba lagi." });
        } finally {
            setIsProcessing(false)
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl font-sans">
            {/* Breadcrumb / Header */}
            <div className="mb-12">
                <div className="text-[10px] font-black tracking-widest uppercase flex items-center gap-2 mb-4 text-gray-500">
                    <Link to="/shop" className="hover:text-white transition-colors">Katalog</Link>
                    <span>&rsaquo;</span>
                    <span className="text-primary font-bold">Checkout Pembayaran</span>
                </div>
                <h1 className="text-5xl font-black text-white mb-2 italic uppercase tracking-tighter">
                    Tinjau <span className="text-primary">Pesanan</span>
                </h1>
                <p className="text-gray-400 font-medium">Selesaikan pembayaran Anda untuk membeli perlengkapan SmashClub.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN - Order Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Item List */}
                    <div className="bg-[#0a1a1a] border border-white/5 rounded-[2rem] p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-primary/10 rounded-xl">
                                <Package className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Item Pesanan ({checkoutItems.length})</h2>
                        </div>

                        <div className="space-y-6">
                            {checkoutItems.map((item: any) => (
                                <div key={item.id} className="flex gap-6 group">
                                    <div className="w-24 h-24 rounded-2xl bg-gray-900 border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center p-4 group-hover:border-primary/30 transition-all duration-300">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{item.category}</p>
                                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors duration-300 truncate pr-4">{item.name}</h3>
                                            </div>
                                            <span className="text-lg font-bold text-white">{formatPrice(item.price)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-xs font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">Jumlah: {item.quantity}</span>
                                            <span className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pick-up Info (Visual filler since payment selection is gone) */}
                    <div className="bg-[#0a1a1a] border border-white/5 rounded-[2rem] p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-primary/10 rounded-xl">
                                <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Informasi Pengambilan</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase mb-1">LOKASI TOKO</p>
                                    <p className="font-bold text-white text-sm">Venue Court SmashClub Arena</p>
                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Jl. Raya Menteng No. 12, Jakarta Pusat</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase mb-1">WAKTU ESTIMASI</p>
                                    <p className="font-bold text-white text-sm">Tersedia dalam 24 Jam</p>
                                    <p className="text-xs text-emerald-500/80 mt-1">Pukul 10:00 - 20:00 WIB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-[#0a1a1a] border border-white/5 rounded-[2rem] p-8 sticky top-24 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/20 rounded-full blur-[80px]"></div>

                        <h2 className="text-xl font-bold text-white mb-8 relative z-10">Ringkasan Pembayaran</h2>

                        {/* Price Breakdown */}
                        <div className="space-y-4 text-sm mb-8 border-b border-white/5 pb-8 relative z-10">
                            <div className="flex justify-between items-center text-gray-400 font-medium tracking-tight">
                                <span>Subtotal</span>
                                <span className="font-bold text-white">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400 font-medium tracking-tight">
                                <span>Estimasi Pengiriman</span>
                                <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-widest">Gratis</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400 font-medium tracking-tight">
                                <span>Biaya Layanan</span>
                                <span className="font-bold text-white">Gratis</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="mb-10 relative z-10">
                            <span className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase mb-1 block">TOTAL PEMBAYARAN</span>
                            <span className="text-4xl font-black text-primary italic tracking-tighter">{formatPrice(total)}</span>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full bg-primary text-[#051111] text-center font-black py-5 rounded-2xl hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(0,214,181,0.3)] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest text-xs"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                "Bayar Sekarang"
                            )}
                        </button>

                        <p className="text-[10px] font-bold text-gray-600 text-center mt-6 uppercase tracking-[0.2em] relative z-10 flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gray-600" />
                            Transaksi Aman & Terenkripsi
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Modal */}
            {errorModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setErrorModal({ ...errorModal, show: false })}
                    />
                    <div className="relative bg-[#16282a] border border-white/10 w-full max-w-md rounded-[2rem] p-10 text-center shadow-2xl overflow-hidden group animate-in fade-in zoom-in duration-300">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-red-500/10 rounded-full blur-[60px]" />

                        <button
                            onClick={() => setErrorModal({ ...errorModal, show: false })}
                            className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 relative border border-red-500/20">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tighter">
                            Oops! <span className="text-red-500">Ada Masalah</span>
                        </h3>

                        <div className="space-y-4 mb-10">
                            <p className="text-gray-400 font-medium leading-relaxed">
                                {errorModal.message}
                            </p>
                        </div>

                        <button
                            onClick={() => setErrorModal({ ...errorModal, show: false })}
                            className="w-full bg-red-500 text-white font-black py-4 rounded-xl hover:bg-red-600 transition-all shadow-[0_0_30px_rgba(239,68,68,0.2)] active:scale-95 uppercase tracking-widest text-xs"
                        >
                            Tutup & Coba Lagi
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
