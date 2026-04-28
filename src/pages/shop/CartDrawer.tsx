import { ShoppingCart, X, Plus, Minus, ArrowRight, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { useShopStore } from '../../features/shop/shop.store';
import { useAuthStore } from '../../features/auth/auth.store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export default function CartDrawer() {
    const {
        isCartOpen,
        toggleCart,
        cart,
        updateQuantity,
        updateQuantityAPI,
        removeFromCart,
        removeFromCartAPI,
        clearCart,
        clearCartAPI,
        getSubtotal,
        fetchCart,
        isLoading,
        error
    } = useShopStore();
    const { token } = useAuthStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    useEffect(() => {
        if (token) fetchCart();
    }, [token]);

    const handleCheckout = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        setIsProcessing(true);
        try {
            toggleCart(false);
            navigate('/shop/checkout', {
                state: {
                    isBuyNow: false,
                    items: cart,
                    subtotal: getSubtotal()
                }
            });
        } catch (error: any) {
            console.error("Checkout error:", error);
            alert(error.message || "Terjadi kesalahan saat checkout");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        if (token) {
            await updateQuantityAPI(itemId, newQuantity);
        } else {
            updateQuantity(itemId, newQuantity);
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        if (token) {
            await removeFromCartAPI(itemId);
        } else {
            removeFromCart(itemId);
        }
    };

    const handleClearCart = () => {
        setShowClearConfirm(true);
    };

    const confirmClear = async () => {
        setShowClearConfirm(false);
        if (token) {
            await clearCartAPI();
        } else {
            clearCart();
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[130] overflow-hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={() => toggleCart(false)}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md flex flex-col bg-[#051111] shadow-2xl border-l border-gray-800 animate-in slide-in-from-right duration-500">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800 bg-card/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                <ShoppingCart className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white leading-tight">Keranjang</h2>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    {cart.length} Item Tersimpan
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleCart(false)}
                            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto py-6 px-6 scrollbar-hide">
                        {isLoading && cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Memperbarui...</p>
                            </div>
                        ) : error ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6">
                                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20">
                                    <X className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-white font-bold mb-2">Gagal Memuat Keranjang</h3>
                                <p className="text-gray-500 text-xs mb-6 max-w-[200px]">{error}</p>
                                <button
                                    onClick={() => fetchCart()}
                                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-gray-800 rounded-lg text-xs font-bold transition-all"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        ) : cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-24 h-24 bg-card/10 rounded-[32px] border border-gray-800 flex items-center justify-center mb-6">
                                    <ShoppingCart className="w-10 h-10 text-gray-700 opacity-20" />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">Keranjang Kosong</h3>
                                <p className="text-gray-500 text-sm max-w-[200px] mb-8">Sepertinya Anda belum menambahkan gear apapun.</p>
                                <button
                                    onClick={() => {
                                        navigate("/shop");
                                        toggleCart(false)
                                    }}
                                    className="bg-primary text-background px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-95"
                                >
                                    Mulai Belanja
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 flex justify-end">
                                    <button
                                        onClick={handleClearCart}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Kosongkan Keranjang
                                    </button>
                                </div>
                                <ul className="space-y-6">
                                    {cart.map((item) => (
                                        <li key={item.id} className="group flex gap-4 p-4 bg-card/5 rounded-2xl border border-transparent hover:border-gray-800 transition-all">
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-white/5 border border-gray-800 p-2">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            <div className="flex flex-1 flex-col">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-0.5">{item.category}</p>
                                                        <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="flex items-center gap-1.5 px-2 py-1.5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all group/remove"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Hapus</span>
                                                    </button>
                                                </div>

                                                <div className="flex flex-1 items-end justify-between">
                                                    <p className="font-black text-white">{formatPrice(item.price)}</p>

                                                    <div className="flex items-center bg-background/50 rounded-xl p-1 border border-gray-800">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="mx-2 w-6 text-center text-white font-black text-sm">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="border-t border-gray-800 px-8 py-8 bg-card/20 backdrop-blur-md">
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="text-white font-bold">{formatPrice(getSubtotal())}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Pajak & Estimasi</span>
                                    <span className="text-primary font-bold">Gratis</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                                    <span className="text-white font-black text-lg">Total</span>
                                    <span className="text-primary font-black text-2xl">{formatPrice(getSubtotal())}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isLoading || isProcessing}
                                className={cn(
                                    "w-full flex items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-5 text-background font-black hover:bg-primary/90 transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(0,214,181,0.2)]",
                                    (isLoading || isProcessing) && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        Lanjut ke Pembayaran
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">Checkout Aman & Terenkripsi</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Clear Cart Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setShowClearConfirm(false)}
                    />
                    <div className="relative bg-[#0a1a1a] border border-white/5 w-full max-w-sm rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-[80px]"></div>

                        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>

                        <h3 className="text-2xl font-black text-white text-center mb-4 italic uppercase tracking-tighter">
                            KOSONGKAN <span className="text-red-500">KERANJANG?</span>
                        </h3>

                        <p className="text-gray-400 text-center font-bold text-sm leading-relaxed mb-10">
                            Semua item yang Anda pilih akan dihapus. Anda tidak dapat membatalkan tindakan ini.
                        </p>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={confirmClear}
                                className="w-full bg-red-500 text-[#051111] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-400 transition-all shadow-[0_10px_30px_rgba(239,68,68,0.2)] active:scale-95"
                            >
                                Ya, Kosongkan Sekarang
                            </button>
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="w-full bg-white/5 text-gray-400 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all border border-white/5"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
