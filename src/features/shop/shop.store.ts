import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, ProductAPI, ProductVariant } from './shop.types';
import { shopService } from './shop.service';
import { useAuthStore } from '../auth/auth.store';

export interface ShopOrder {
    id: number;
    orderCode: string;
    items: CartItem[];
    orderItemImgLink: string;
    subtotal: number;
    shipping: number;
    insurance: number;
    serviceFee: number;
    total: number;
    status: 'DIBATALKAN' | 'MENUNGGU PEMBAYARAN' | 'DIPROSES' | 'SIAP DIAMBIL' | 'SELESAI';
    date: string;
    rawDate: string;
    refundStatus: number;
    refundRequestDate: string | null;
    refundStatusUpdateDate: string | null;
    paymentLink: string | null;
    updatedAt: string | null;
}

interface ShopState {
    cart: CartItem[];
    isCartOpen: boolean;
    products: Product[];
    orderHistory: ShopOrder[];
    isLoading: boolean;
    error: string | null;
    buyNowProduct: Product | null;
    buyNowStartingVariant: ProductVariant | null;
    buyNowStartingQuantity: number;
    isBuyNowModalOpen: boolean;
    addToCartProduct: Product | null;
    addToCartStartingVariant: ProductVariant | null;
    addToCartStartingQuantity: number;
    isAddToCartModalOpen: boolean;
    fetchProducts: () => Promise<void>;
    fetchProductById: (id: number | string) => Promise<void>;
    fetchCart: () => Promise<void>;
    addToCart: (product: Product, quantity?: number) => void;
    addToCartAPI: (variantId: number, quantity: number) => Promise<void>;
    removeFromCart: (CartItemId: number) => void;
    removeFromCartAPI: (cartItemId: number) => Promise<void>;
    updateQuantity: (cartItemId: number, quantity: number) => void;
    updateQuantityAPI: (cartItemId: number, quantity: number) => Promise<void>;
    clearCart: () => void;
    clearCartAPI: () => Promise<void>;
    toggleCart: (open?: boolean) => void;
    addOrder: (order: ShopOrder) => void;
    cancelOrder: (orderId: number) => void;
    getTotalItems: () => number;
    getSubtotal: () => number;
    buyNowAPI: (variantId: number, quantity: number) => Promise<any>;
    checkoutCartAPI: (data?: any) => Promise<any>;
    getOrderHistoryAPI: (page?: number, pageSize?: number) => Promise<void>;
    getOrderSummaryAPI: (orderId: number) => Promise<any>;
    refundRequestAPI: (orderId: string, reason: string) => Promise<any>;
    openBuyNowModal: (product: Product, variant?: ProductVariant, quantity?: number) => void;
    closeBuyNowModal: () => void;
    openAddToCartModal: (product: Product, variant?: ProductVariant, quantity?: number) => void;
    closeAddToCartModal: () => void;
}

const mapAPICartItems = (items: any[]): CartItem[] => {
    return items
        .map((apiItem: any, index: number) => {
            if (!apiItem) return null;

            // Item ID — backend may use id or cartItemId
            const rawId = apiItem.cartItemId ?? apiItem.id ?? apiItem.productId;
            const id = rawId != null ? Number(rawId) : index;

            // Variant data — prioritized from new docs structure
            const variant = apiItem.variant ?? apiItem.productVariant ?? null;
            const variantName = variant?.variantName ?? apiItem.variantName ?? null;

            // Product name extraction
            const productName =
                apiItem.productName ??
                apiItem.product?.productName ??
                variant?.product?.productName ??
                "Produk";

            const displayName = variantName && !productName.includes(variantName)
                ? `${productName} - ${variantName}`
                : productName;

            // Price: prioritize variant price from the new structure
            const price =
                apiItem.priceAtAdd ??
                variant?.price ??
                apiItem.price ??
                0;

            // Image: prioritize variant image link
            const image =
                variant?.variantImgLink ??
                apiItem.imgLink ??
                apiItem.product?.defaultImgLink ??
                variant?.product?.defaultImgLink ??
                "";

            // Category
            const category =
                apiItem.category ??
                apiItem.product?.category ??
                variant?.product?.category ??
                "Kategori";

            return {
                id,
                name: displayName,
                category,
                price,
                image,
                quantity: apiItem.quantity ?? 1,
                variantName: variantName ?? '',
                variantImgLink: variant?.variantImgLink ?? image ?? '',
            } as CartItem;
        })
        .filter(Boolean) as CartItem[];
};

const mapAPIOrderToShopOrder = (apiOrder: any): ShopOrder => {
    const statusMap: Record<number, ShopOrder['status']> = {
        0: 'DIBATALKAN',
        1: 'MENUNGGU PEMBAYARAN',
        2: 'DIPROSES',
        3: 'SIAP DIAMBIL',
        4: 'SELESAI'
    };

    // Items mapping — order summary API has items[], order history API does not
    const rawItems = apiOrder.items || apiOrder.orderItems || [];
    const items: CartItem[] = rawItems.map((item: any) => {
        const productName = item.productName || item.product?.productName || item.variantName || 'Produk';
        const image = item.orderItemImgLink || item.image || item.imgLink || item.variantImgLink || item.product?.defaultImgLink || '';
        const variantName = item.variantName || '';

        return {
            id: Number(item.productId || item.id || item.variantId || Math.floor(Math.random() * 1000000)),
            name: productName,
            category: item.category || item.product?.category || 'Kategori',
            price: item.price || item.priceAtAdd || 0,
            image: image,
            quantity: item.quantity || 1,
            variantName: variantName,
            variantImgLink: item.variantImgLink || image
        } as CartItem;
    });

    // Top-level image from order history API (flat structure, no items array)
    const orderItemImgLink = apiOrder.orderItemImgLink || items[0]?.variantImgLink || items[0]?.image || '';

    const orderDateRaw = apiOrder.orderDate || apiOrder.order_date || apiOrder.createdAt || apiOrder.created_at;
    const dateObj = orderDateRaw ? new Date(orderDateRaw) : new Date();

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        try {
            const dateObj = new Date(dateStr);
            if (isNaN(dateObj.getTime())) return null;
            return dateObj.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) + ' WIB';
        } catch (e) {
            return null;
        }
    };

    return {
        id: Number(apiOrder.orderId || apiOrder.id || 0),
        items,
        orderItemImgLink,
        orderCode: apiOrder.orderCode || '',
        subtotal: apiOrder.subtotal || apiOrder.totalPrice || apiOrder.total_price || 0,
        shipping: apiOrder.shippingFee || 0,
        insurance: apiOrder.insuranceFee || 0,
        serviceFee: apiOrder.serviceFee || 0,
        total: apiOrder.totalPrice || apiOrder.total_price || 0,
        status: statusMap[apiOrder.status] || 'MENUNGGU PEMBAYARAN',
        date: dateObj.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) + ' WIB',
        rawDate: dateObj.toISOString(),
        refundStatus: apiOrder.refundStatus ?? 0,
        refundRequestDate: formatDate(apiOrder.refundRequestDate),
        refundStatusUpdateDate: formatDate(apiOrder.refundStatusUpdateDate),
        paymentLink: apiOrder.paymentLink ?? null,
        updatedAt: formatDate(apiOrder.updatedAt)
    };
};

export const useShopStore = create<ShopState>()(
    persist(
        (set, get) => ({
            cart: [],
            isCartOpen: false,
            products: [],
            orderHistory: [],
            isLoading: false,
            error: null,
            buyNowProduct: null,
            buyNowStartingVariant: null,
            buyNowStartingQuantity: 1,
            isBuyNowModalOpen: false,
            addToCartProduct: null,
            addToCartStartingVariant: null,
            addToCartStartingQuantity: 1,
            isAddToCartModalOpen: false,
            fetchProducts: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.getProducts();
                    if (response.success) {
                        const mappedProducts: Product[] = response.data.content.map((apiProduct: ProductAPI) => ({
                            id: apiProduct.id,
                            name: apiProduct.productName,
                            category: apiProduct.category,
                            price: apiProduct.productVariants[0]?.price || 0,
                            image: apiProduct.defaultImgLink,
                            description: apiProduct.productDesc,
                            variants: apiProduct.productVariants
                        }));
                        set({ products: mappedProducts, isLoading: false });
                    } else {
                        set({ error: response.message, isLoading: false });
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch products', isLoading: false });
                }
            },
            fetchProductById: async (id: number | string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.getProductById(id);
                    if (response.success) {
                        const apiProduct = response.data;
                        const mappedProduct: Product = {
                            id: apiProduct.id,
                            name: apiProduct.productName,
                            category: apiProduct.category,
                            price: apiProduct.productVariants[0]?.price || 0,
                            image: apiProduct.defaultImgLink,
                            description: apiProduct.productDesc,
                            variants: apiProduct.productVariants
                        };

                        set((state) => ({
                            products: state.products.some(p => p.id === mappedProduct.id)
                                ? state.products.map(p => p.id === mappedProduct.id ? mappedProduct : p)
                                : [...state.products, mappedProduct],
                            isLoading: false
                        }));
                    } else {
                        set({ error: response.message, isLoading: false });
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch product', isLoading: false });
                }
            },
            fetchCart: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.getCart() as any;
                    const cartData = response?.data;
                    const items: any[] = cartData?.items ?? response?.items ?? [];

                    const isSuccess =
                        response?.success === true ||
                        response?.status === 200 ||
                        (cartData?.cartId !== undefined);

                    if (isSuccess) {
                        const mappedItems = mapAPICartItems(items);
                        set({ cart: mappedItems, isLoading: false, error: null });
                    } else if (
                        response?.status === 404 ||
                        response?.message?.toLowerCase().includes('not found') ||
                        response?.message?.toLowerCase().includes('no active cart')
                    ) {
                        set({ cart: [], isLoading: false, error: null });
                    } else {
                        set({ error: response?.message || 'Gagal memuat keranjang', isLoading: false });
                    }
                } catch (error: any) {
                    if (error?.response?.status === 404) {
                        set({ cart: [], isLoading: false, error: null });
                    } else {
                        set({ error: error.message || 'Terjadi kesalahan saat memuat keranjang', isLoading: false });
                    }
                }
            },
            addToCartAPI: async (variantId: number, quantity: number) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.addToCart({ variantId, quantity });
                    // Backend returns the updated cart structure in AddToCartResponse
                    if (response && response.items) {
                        const mappedItems = mapAPICartItems(response.items);
                        set({ cart: mappedItems, isLoading: false });
                    } else {
                        // Fallback: if items not returned, we might need to fetch
                        await get().fetchCart();
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Gagal menambahkan ke keranjang', isLoading: false });
                    throw error;
                }
            },
            addToCart: (product, quantity = 1) => {
                const cart = get().cart;
                const existingItem = cart.find((item) => item.id === product.id);
                if (existingItem) {
                    set({
                        cart: cart.map((item) =>
                            item.id === product.id ? { ...item, quantity: item.quantity + (quantity || 1) } : item
                        ),
                    });
                } else {
                    set({
                        cart: [...cart, {
                            ...product,
                            quantity: quantity || 1,
                            variantName: '',
                            variantImgLink: product.image || ''
                        }]
                    });
                }
                set({ isCartOpen: true });
            },
            removeFromCart: (cartItemId: number) => {
                set({ cart: get().cart.filter((item) => item.id !== cartItemId) });
            },
            removeFromCartAPI: async (cartItemId: number) => {
                set({ isLoading: true, error: null });
                try {
                    await shopService.removeCartItem(cartItemId);
                    // Update local state by removing the item
                    set((state) => ({
                        cart: state.cart.filter(item => item.id !== cartItemId),
                        isLoading: false
                    }));
                } catch (error: any) {
                    set({ error: error.message || 'Failed to remove item', isLoading: false });
                }
            },
            updateQuantity: (cartItemId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(cartItemId);
                    return;
                }
                set({
                    cart: get().cart.map((item) =>
                        item.id === cartItemId ? { ...item, quantity } : item
                    ),
                });
            },
            updateQuantityAPI: async (cartItemId: number, quantity: number) => {
                if (quantity <= 0) {
                    await get().removeFromCartAPI(cartItemId);
                    return;
                }
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.updateCartItem(cartItemId, quantity);
                    // Updated to use the returned cart data from API
                    if (response && response.items) {
                        const mappedItems = mapAPICartItems(response.items);
                        set({ cart: mappedItems, isLoading: false });
                    } else {
                        // Fallback: manually update if items not returned
                        set((state) => ({
                            cart: state.cart.map(item =>
                                item.id === cartItemId ? { ...item, quantity } : item
                            ),
                            isLoading: false
                        }));
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to update quantity', isLoading: false });
                }
            },
            clearCart: () => set({ cart: [] }),
            clearCartAPI: async () => {
                const token = useAuthStore.getState().token;
                if (!token) {
                    set({ cart: [] });
                    return;
                }

                set({ isLoading: true, error: null });
                try {
                    await shopService.clearCart();
                    set({ cart: [], isLoading: false });
                } catch (error: any) {
                    set({ error: error.message || 'Failed to clear cart', isLoading: false });
                }
            },
            toggleCart: (open) => set({ isCartOpen: open !== undefined ? open : !get().isCartOpen }),
            addOrder: (order) => set((state) => ({
                orderHistory: [order, ...state.orderHistory],
                cart: []
            })),
            cancelOrder: (orderId: number) => set((state) => ({
                orderHistory: state.orderHistory.map(order =>
                    order.id === orderId ? { ...order, status: 'DIBATALKAN' } : order
                )
            })),
            getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
            getSubtotal: () => get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
            buyNowAPI: async (variantId: number, quantity: number) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.buyNow({ variantId, quantity });
                    if (response.message.includes('successfully') || response.data) {
                        // Optionally clear cart or update order history
                        // For now we just return the response
                        set({ isLoading: false });
                        return response;
                    } else {
                        set({ error: response.message, isLoading: false });
                        return response;
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to buy product', isLoading: false });
                    throw error;
                }
            },
            checkoutCartAPI: async (data: any = {}) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.checkout(data);
                    if (response.message.includes('successfully') || response.data) {
                        set({ cart: [], isLoading: false });
                        return response;
                    } else {
                        set({ error: response.message || 'Failed to checkout', isLoading: false });
                        return response;
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to checkout cart', isLoading: false });
                    throw error;
                }
            },
            getOrderHistoryAPI: async (page = 0, pageSize = 25) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.getOrderHistory(page, pageSize) as any;
                    // Handle pagination or array return
                    const items = response.data?.content || response.data || [];
                    const apiOrders = Array.isArray(items) ? items : [items].filter(Boolean);

                    const mappedOrders = apiOrders.map(mapAPIOrderToShopOrder);
                    set({ orderHistory: mappedOrders, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch order history', isLoading: false });
                }
            },
            getOrderSummaryAPI: async (orderId: number) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.getOrderSummary(orderId);
                    if (response && response.data) {
                        const mappedOrder = mapAPIOrderToShopOrder(response.data);
                        set((state) => ({
                            orderHistory: state.orderHistory.some(o => o.id === mappedOrder.id)
                                ? state.orderHistory.map(o => o.id === mappedOrder.id ? mappedOrder : o)
                                : [mappedOrder, ...state.orderHistory],
                            isLoading: false
                        }));
                    }
                    set({ isLoading: false });
                    return response;
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch order summary', isLoading: false });
                    throw error;
                }
            },
            refundRequestAPI: async (orderCode: string, reason: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.requestRefund(orderCode, reason);
                    set({ isLoading: false });
                    return response;
                } catch (error: any) {
                    set({ error: error.message || 'Failed to submit refund request', isLoading: false });
                    throw error;
                }
            },
            openBuyNowModal: (product, variant, quantity) => set({
                buyNowProduct: product,
                buyNowStartingVariant: variant || (product.variants?.[0] || null),
                buyNowStartingQuantity: quantity || 1,
                isBuyNowModalOpen: true
            }),
            closeBuyNowModal: () => set({
                buyNowProduct: null,
                buyNowStartingVariant: null,
                buyNowStartingQuantity: 1,
                isBuyNowModalOpen: false
            }),
            openAddToCartModal: (product: Product, variant?: ProductVariant, quantity?: number) => set({
                addToCartProduct: product,
                addToCartStartingVariant: variant || (product.variants?.[0] || null),
                addToCartStartingQuantity: quantity || 1,
                isAddToCartModalOpen: true
            }),
            closeAddToCartModal: () => set({
                addToCartProduct: null,
                addToCartStartingVariant: null,
                addToCartStartingQuantity: 1,
                isAddToCartModalOpen: false
            }),
        }),
        {
            name: 'smashclub-shop-storage',
            partialize: (state: ShopState) => ({
                cart: state.cart,
                orderHistory: state.orderHistory
            }),
        }
    )
);
