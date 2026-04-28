import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus, ChevronLeft, BarChart2, User } from 'lucide-react';
import { useShopStore } from '../../features/shop/shop.store';
import { useAuthStore } from '../../features/auth/auth.store';
import type { ProductVariant } from '../../features/shop/shop.types';

export default function ProductDetailPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { products, fetchProductById, openBuyNowModal, openAddToCartModal, isLoading, error } = useShopStore();
    const { token, user } = useAuthStore();

    const product = products.find(p => p.id === Number(productId));

    const [selectedImage, setSelectedImage] = useState('');
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        if (productId) {
            fetchProductById(productId);
        }
    }, [productId, fetchProductById]);

    useEffect(() => {
        if (product) {
            if (product.variants && product.variants.length > 0) {
                // If variant not yet selected, select the first one
                if (!selectedVariant) {
                    setSelectedVariant(product.variants[0]);
                }
            } else {
                setSelectedImage(product.image);
            }
        }
    }, [product, selectedVariant]);

    useEffect(() => {
        if (selectedVariant) {
            setSelectedImage(selectedVariant.variantImgLink);
        }
    }, [selectedVariant]);

    // Only show error screen if we failed to load the product itself
    // Subsequent action errors (like add to cart) should show a toast or local message
    if (!product) {
        if (isLoading) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center text-white bg-background">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-400">Memuat detail produk...</p>
                </div>
            );
        }

        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white bg-background p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">{error || "Produk tidak ditemukan"}</h2>
                <button
                    onClick={() => navigate('/shop')}
                    className="text-primary hover:underline flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" /> Kembali ke Toko
                </button>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    const handleAddToCart = () => {
        setActionError(null);
        if (!selectedVariant && product.variants && product.variants.length > 0) {
            alert("Silakan pilih varian produk terlebih dahulu.");
            return;
        }

        openAddToCartModal(product, selectedVariant || undefined, quantity);
    };

    const handleBuyNow = () => {
        setActionError(null);
        if (!selectedVariant && product.variants && product.variants.length > 0) {
            alert("Silakan pilih varian produk terlebih dahulu.");
            return;
        }

        if (token && user) {
            let variantId: number | null = null;
            if (selectedVariant) {
                variantId = selectedVariant.id;
            } else if (!isNaN(product.id)) {
                variantId = product.id;
            }

            if (variantId !== null) {
                openBuyNowModal(product, selectedVariant || undefined, quantity);
            } else {
                alert("Varian produk belum dipilih atau produk tidak valid.");
            }
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="bg-background min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs / Back button */}
                <button
                    onClick={() => navigate('/shop')}
                    className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Toko
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* LEFT COLUMN: IMAGES */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-card/20 rounded-3xl overflow-hidden border border-gray-800 flex items-center justify-center p-8 lg:p-12 relative group">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                            />
                            {product.isHot && (
                                <span className="absolute top-6 right-6 bg-red-600 text-[10px] font-black text-white px-3 py-1.5 rounded-full uppercase tracking-tighter">
                                    HOT ITEM
                                </span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square rounded-2xl border-2 transition-all p-2 bg-card/10 overflow-hidden ${selectedImage === img ? 'border-primary' : 'border-gray-800 hover:border-gray-600'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: INFO */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase mb-4">
                                {product.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-3xl font-black text-primary">
                                {formatPrice(selectedVariant ? selectedVariant.price : product.price)}
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Deskripsi Produk</h3>
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    {product.fullDescription || product.description}
                                </p>
                            </div>

                            {/* Options: Variant selection */}
                            <div className="space-y-8">
                                {product.variants && product.variants.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Pilih Varian <span className="text-red-500">*</span></h3>
                                        <div className="flex flex-wrap gap-3">
                                            {product.variants.map(variant => (
                                                <button
                                                    key={variant.id}
                                                    onClick={() => setSelectedVariant(variant)}
                                                    className={`px-4 py-2 rounded-lg font-bold transition-all border ${selectedVariant?.id === variant.id
                                                        ? 'bg-primary border-primary text-background'
                                                        : 'bg-card/30 border-gray-800 text-gray-400 hover:border-gray-600'
                                                        }`}
                                                >
                                                    {variant.variantName}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Jumlah</h3>
                                    <div className="flex items-center w-32 bg-card/30 rounded-lg p-1 border border-gray-800">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="flex-1 text-center font-bold text-white text-lg">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                {actionError && (
                                    <p className="text-red-500 font-bold text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                        {actionError}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            {token ? (
                                <>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-primary text-background font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                                        >
                                            <ShoppingCart className="w-5 h-5 fill-current" />
                                            Tambah ke Keranjang
                                        </button>
                                        <button className="p-4 bg-card/30 border border-gray-800 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500/50 transition-all group">
                                            <Heart className="w-6 h-6 group-hover:fill-current transition-colors" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleBuyNow}
                                        className="w-full bg-white text-background font-black py-4 px-8 rounded-xl hover:bg-gray-100 transition-all active:scale-[0.98]"
                                    >
                                        Beli Sekarang
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-4 pt-4">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full bg-primary text-background font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                                    >
                                        <User className="w-5 h-5" />
                                        Login untuk Belanja
                                    </button>
                                    <p className="text-center text-sm text-gray-400">
                                        Anda harus masuk ke akun Anda untuk dapat melakukan pembelian.
                                    </p>
                                </div>
                            )}

                            {/* Specifications */}
                            {product.specifications && (
                                <div className="mt-12 pt-12 border-t border-gray-800">
                                    <div className="flex items-center gap-3 mb-8">
                                        <BarChart2 className="w-6 h-6 text-primary" />
                                        <h3 className="text-xl font-bold text-white">Spesifikasi Produk</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-card/20 border border-gray-800">
                                                <span className="text-gray-400 font-medium">{key}</span>
                                                <span className="text-white font-bold">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
