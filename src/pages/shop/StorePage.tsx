import { useState, useEffect } from 'react';

import { ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShopStore } from '../../features/shop/shop.store';
import { useAuthStore } from '../../features/auth/auth.store';
import type { Product } from '../../features/shop/shop.types';

export default function StorePage() {
    const navigate = useNavigate();
    const { products, fetchProducts, openBuyNowModal, openAddToCartModal, isLoading, error } = useShopStore();
    const { token, user } = useAuthStore();
    const [activeCategory, setActiveCategory] = useState<string>('Semua Produk');

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    const allCategories = products.reduce((acc: string[], product) => {
        if (product.category && !acc.includes(product.category)) {
            acc.push(product.category);
        }
        return acc;
    }, []);

    const displayCategories = ['Semua Produk', ...allCategories];

    const filteredProducts = activeCategory === 'Semua Produk'
        ? products
        : products.filter(p => p.category === activeCategory);

    const groupedProducts = filteredProducts.reduce((acc: Record<string, Product[]>, product: Product) => {
        const category = product.category || 'Lainnya';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    const sectionsToDisplay = activeCategory === 'Semua Produk'
        ? allCategories
        : [activeCategory];

    return (
        <div className="bg-background min-h-screen pb-20">
            {/* HEADER SECTION */}
            <section className="pt-32 pb-12 container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Peralatan Tennis Profesional</h1>
                <p className="text-primary/80 text-lg">Temukan gear terbaik untuk meningkatkan permainan smash Anda.</p>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-3 mt-8">
                    {displayCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeCategory === category
                                ? 'bg-primary text-background'
                                : 'bg-card/50 text-gray-400 hover:bg-card hover:text-white border border-gray-800'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* PRODUCT GRID GROUPED BY CATEGORY */}
            <section className="container mx-auto px-4 min-h-[400px] flex flex-col justify-start">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-card/20 border border-gray-800 rounded-2xl aspect-[3/4] animate-pulse" />
                        ))}
                    </div>
                ) : (error || filteredProducts.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card/10 border border-white/5 rounded-[40px] mt-8 relative overflow-hidden group">
                        {/* Decorative background glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-[100px] rounded-full" />

                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20 transition-transform duration-500 group-hover:scale-110">
                            <ShoppingBag className="w-10 h-10 text-primary opacity-60" />
                        </div>

                        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                            {error ? 'Gagal Memuat Produk' : 'Produk Tidak Ditemukan'}
                        </h2>

                        <p className="text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
                            {error
                                ? 'Maaf, sepertinya terjadi gangguan koneksi saat mengambil katalog. Silakan coba segarkan halaman.'
                                : `Saat ini tidak ada produk yang tersedia di kategori "${activeCategory}". Jelajahi kategori lain untuk gear terbaik.`}
                        </p>

                        <button
                            onClick={() => {
                                if (error) fetchProducts();
                                setActiveCategory('Semua Produk');
                            }}
                            className="bg-primary hover:bg-primary/90 text-background px-10 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-[0_0_30px_rgba(0,214,181,0.2)] hover:shadow-[0_0_40px_rgba(0,214,181,0.4)]"
                        >
                            {error ? 'Coba Lagi' : 'Lihat Semua Produk'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {sectionsToDisplay.map((category) => groupedProducts[category] && (
                            <div key={category} className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">{category}</h2>
                                    <div className="h-px bg-gray-800 flex-grow"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {groupedProducts[category].map((product: Product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            formatPrice={formatPrice}
                                            token={token}
                                            onAddToCart={async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                const variantId = product.variants?.[0]?.id || product.id;
                                                if (!isNaN(variantId)) {
                                                    openAddToCartModal(product);
                                                } else {
                                                    alert("Produk tidak memiliki varian valid.");
                                                }
                                            }}
                                            onBuyNow={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                if (token && user) {
                                                    const variantId = product.variants?.[0]?.id || product.id;
                                                    if (!isNaN(variantId)) {
                                                        openBuyNowModal(product);
                                                    } else {
                                                        alert("Produk tidak memiliki varian valid.");
                                                    }
                                                } else {
                                                    navigate('/login');
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function ProductCard({
    product,
    formatPrice,
    onAddToCart,
    onBuyNow,
    token
}: {
    product: Product;
    formatPrice: (p: number) => string;
    onAddToCart: (e: React.MouseEvent) => void;
    onBuyNow: (e: React.MouseEvent) => void;
    token: string | null;
}) {
    return (
        <Link to={`/shop/${product.id}`} className="group bg-card/20 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden bg-white/5">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
                {product.isHot && (
                    <span className="absolute top-4 right-4 bg-red-600 text-[10px] font-black text-white px-2 py-1 rounded uppercase tracking-tighter">
                        HOT ITEM
                    </span>
                )}
                {product.isNew && (
                    <span className="absolute top-4 left-4 bg-primary text-[10px] font-black text-background px-2 py-1 rounded uppercase tracking-tighter">
                        BARU
                    </span>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">
                    {product.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                    {product.name}
                </h3>
                <p className="text-xl font-bold text-white mt-auto py-2">
                    {formatPrice(product.price)}
                </p>

                <button
                    onClick={onAddToCart}
                    className="w-full mt-4 bg-primary text-background font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98]"
                >
                    <ShoppingBag className="w-4 h-4 fill-current" />
                    {token ? 'Tambah ke Keranjang' : 'Login untuk Belanja'}
                </button>

                <button
                    onClick={onBuyNow}
                    className="w-full mt-2 bg-white text-background font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-[0.98]"
                >
                    Beli Sekarang
                </button>
            </div>
        </Link>
    );
}
