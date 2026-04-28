import { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, CheckCircle2, Loader2, ShoppingBag, AlertCircle } from 'lucide-react';
import { useShopStore } from '../../features/shop/shop.store';
import { useAuthStore } from '../../features/auth/auth.store';
import type { ProductVariant } from '../../features/shop/shop.types';
import { cn } from '../../lib/utils';

export default function AddToCartModal() {
    const {
        isAddToCartModalOpen,
        closeAddToCartModal,
        addToCartProduct,
        addToCartStartingVariant,
        addToCartStartingQuantity,
        addToCartAPI,
        addToCart,
        toggleCart,
    } = useShopStore();
    const { token, user } = useAuthStore();

    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [addedItem, setAddedItem] = useState<{
        name: string;
        image: string;
        price: number;
        quantity: number;
        category: string;
    } | null>(null);

    useEffect(() => {
        if (addToCartProduct) {
            setQuantity(addToCartStartingQuantity);
            setSelectedVariant(addToCartStartingVariant);
            setIsSuccess(false);
            setAddedItem(null);
            setErrorMessage(null);
        }
    }, [addToCartProduct, addToCartStartingVariant, addToCartStartingQuantity]);

    if (!isAddToCartModalOpen || !addToCartProduct) return null;

    const price = selectedVariant ? selectedVariant.price : addToCartProduct.price;
    const subtotal = price * quantity;

    const formatPrice = (p: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(p).replace('Rp', 'Rp ');

    const handleConfirmAddToCart = async () => {
        setIsProcessing(true);
        setErrorMessage(null);
        try {
            if (token && user) {
                let variantId: number;
                if (selectedVariant) {
                    variantId = selectedVariant.id;
                } else if (!isNaN(addToCartProduct.id)) {
                    variantId = addToCartProduct.id;
                } else {
                    throw new Error('ID Produk tidak valid');
                }
                await addToCartAPI(variantId, quantity);
            } else {
                const productWithSelectedVariant = {
                    ...addToCartProduct,
                    price: selectedVariant ? selectedVariant.price : addToCartProduct.price,
                    image: selectedVariant ? selectedVariant.variantImgLink : addToCartProduct.image,
                    name: selectedVariant
                        ? `${addToCartProduct.name} - ${selectedVariant.variantName}`
                        : addToCartProduct.name,
                    id: Number(selectedVariant
                        ? selectedVariant.id
                        : addToCartProduct.id),
                };
                addToCart(productWithSelectedVariant, quantity);
            }

            // Snapshot the added item for the success screen
            setAddedItem({
                name: selectedVariant
                    ? `${addToCartProduct.name} - ${selectedVariant.variantName}`
                    : addToCartProduct.name,
                image: selectedVariant
                    ? selectedVariant.variantImgLink
                    : addToCartProduct.image,
                price,
                quantity,
                category: addToCartProduct.category,
            });
            setIsSuccess(true);
        } catch (error: any) {
            console.error(error);
            const msg = 'Gagal menambahkan ke keranjang. Silahkan coba lagi.'
            setErrorMessage(msg);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleViewCart = () => {
        closeAddToCartModal();
        toggleCart(true);
    };

    const handleContinueShopping = () => {
        closeAddToCartModal();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={isSuccess ? handleContinueShopping : closeAddToCartModal}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-[#0a1a1a] border border-gray-800 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* ── SUCCESS SCREEN ── */}
                {isSuccess && addedItem ? (
                    <div className="flex flex-col items-center text-center p-8 gap-6">
                        {/* Close button */}
                        <button
                            onClick={handleContinueShopping}
                            className="absolute top-5 right-5 p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Animated check icon */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center animate-in zoom-in duration-500">
                                <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
                            </div>
                            {/* Pulse ring */}
                            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                        </div>

                        {/* Title */}
                        <div>
                            <h2 className="text-xl font-black text-white mb-1">Berhasil Ditambahkan!</h2>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">ke Keranjang Belanja</p>
                        </div>

                        {/* Item summary card */}
                        <div className="w-full flex gap-4 p-4 bg-white/5 rounded-2xl border border-gray-800 text-left">
                            <div className="w-20 h-20 flex-shrink-0 bg-white/5 rounded-xl border border-gray-800 p-2 flex items-center justify-center overflow-hidden">
                                <img
                                    src={addedItem.image}
                                    alt={addedItem.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col justify-center gap-1 min-w-0">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                    {addedItem.category}
                                </p>
                                <p className="text-sm font-bold text-white leading-snug line-clamp-2">
                                    {addedItem.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">
                                        {addedItem.quantity}x
                                    </span>
                                    <span className="text-sm font-black text-white">
                                        {formatPrice(addedItem.price * addedItem.quantity)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="w-full flex flex-col gap-3">
                            <button
                                onClick={handleViewCart}
                                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-background font-black text-sm hover:bg-primary/90 transition-all active:scale-[0.98] shadow-[0_0_25px_rgba(0,214,181,0.2)]"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Lihat Keranjang
                            </button>
                            <button
                                onClick={handleContinueShopping}
                                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-gray-800 px-6 py-4 text-gray-300 font-bold text-sm transition-all active:scale-[0.98]"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Lanjut Belanja
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── FORM SCREEN ── */
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-primary" />
                                Tambah ke Keranjang
                            </h2>
                            <button
                                onClick={closeAddToCartModal}
                                className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Product Summary */}
                            <div className="flex gap-4 p-4 bg-card/10 rounded-2xl border border-gray-800">
                                <div className="w-24 h-24 bg-card/20 rounded-xl border border-gray-800 flex items-center justify-center p-2 shrink-0">
                                    <img
                                        src={selectedVariant ? selectedVariant.variantImgLink : addToCartProduct.image}
                                        alt={addToCartProduct.name}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                                        {addToCartProduct.category}
                                    </p>
                                    <h3 className="text-lg font-bold text-white leading-tight mb-2">
                                        {addToCartProduct.name}
                                    </h3>
                                    <p className="text-xl font-black text-white">{formatPrice(price)}</p>
                                </div>
                            </div>

                            {/* Variant Selector */}
                            {addToCartProduct.variants && addToCartProduct.variants.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Pilih Varian</p>
                                    <div className="flex flex-wrap gap-2">
                                        {addToCartProduct.variants.map((v) => (
                                            <button
                                                key={v.id}
                                                onClick={() => setSelectedVariant(v)}
                                                className={cn(
                                                    'px-4 py-2 rounded-xl text-xs font-bold transition-all border',
                                                    selectedVariant?.id === v.id
                                                        ? 'bg-primary border-primary text-background shadow-[0_0_15px_rgba(0,214,181,0.3)]'
                                                        : 'bg-card/30 border-gray-800 text-gray-400 hover:border-gray-600'
                                                )}
                                            >
                                                {v.variantName}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Modifier */}
                            <div className="flex items-center justify-between p-4 bg-card/10 rounded-2xl border border-gray-800">
                                <span className="text-sm font-bold text-gray-400">Jumlah Pesanan</span>
                                <div className="flex items-center gap-6 bg-background/50 rounded-xl p-1.5 border border-gray-800">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-4 text-center text-white font-black text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Error Banner */}
                            {errorMessage && (
                                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-300">
                                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-red-400">Gagal Menambahkan ke Dalam Keranjang, Silakan Coba Lagi </p>
                                    </div>
                                    <button
                                        onClick={() => setErrorMessage(null)}
                                        className="ml-auto p-1 hover:bg-red-500/10 rounded-lg text-red-400/60 hover:text-red-400 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            {/* Summary & Confirm */}
                            <div className="pt-4 border-t border-gray-800">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Harga</p>
                                        <p className="text-2xl font-black text-primary">{formatPrice(subtotal)}</p>
                                    </div>
                                    <button
                                        onClick={handleConfirmAddToCart}
                                        disabled={isProcessing}
                                        className={cn(
                                            'px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg',
                                            'bg-primary text-background hover:bg-primary/90 shadow-primary/20',
                                            isProcessing && 'opacity-70 cursor-not-allowed'
                                        )}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5" />
                                                Konfirmasi
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
