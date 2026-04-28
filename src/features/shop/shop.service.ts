import { api } from "../../lib/axios";
import type {
    AddToCartResponse,
    CartAPIResponse,
    MessageResponse,
    OrderResponse,
    OrderSummaryResponse,
    OrderHistoryResponse,
    ProductResponse,
    ProductSearchResponse,
} from "./shop.types";

export const shopService = {
    getProducts: async (page = 0, size = 25): Promise<ProductSearchResponse> => {
        try {
            const response = await api.get<ProductSearchResponse>("/products/search", {
                params: { page, size }
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    },

    getProductById: async (id: number | string): Promise<ProductResponse> => {
        try {
            const response = await api.get<ProductResponse>(`/products/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    },

    getCart: async (): Promise<CartAPIResponse> => {
        try {
            const response = await api.get<CartAPIResponse>("/cart");
            return response.data;
        } catch (error: any) {
            // Re-throw so callers can handle HTTP errors (e.g. 404 = no active cart)
            throw error;
        }
    },

    addToCart: async (data: { variantId: number; quantity: number }): Promise<AddToCartResponse> => {
        try {
            const response = await api.post<AddToCartResponse>("/cart/add", data);
            // 1. Check HTTP status code
            if (response.status !== 200) {
                const msg = response.data?.message || `Gagal menambahkan ke keranjang (HTTP ${response.status})`;
                throw new Error(msg);
            }
            // 2. Check success flag in response body (backend may return 200 with success: false)
            if (response.data?.success === false) {
                const msg = response.data?.message || 'Gagal menambahkan ke keranjang';
                throw new Error(msg);
            }
            return response.data;
        } catch (error: any) {
            // Re-throw with the backend's error message so callers can surface it
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                'Gagal menambahkan ke keranjang';
            throw new Error(msg);
        }
    },

    updateCartItem: async (cartItemId: number, quantity: number): Promise<AddToCartResponse> => {
        try {
            const response = await api.put<AddToCartResponse>(`/cart/update/${cartItemId}`, {
                cartItemId,
                quantity
            });
            if (response.status !== 200) {
                const msg = (response.data as any)?.message || `Gagal memperbarui jumlah (HTTP ${response.status})`;
                throw new Error(msg);
            }
            return response.data;
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || 'Gagal memperbarui jumlah';
            throw new Error(msg);
        }
    },

    removeCartItem: async (cartItemId: number): Promise<MessageResponse> => {
        try {
            const response = await api.delete<MessageResponse>(`/cart/remove/${cartItemId}`);
            if (response.status !== 200 || (response.data as any)?.success === false) {
                const msg = (response.data as any)?.message || `Gagal menghapus item (HTTP ${response.status})`;
                throw new Error(msg);
            }
            return response.data;
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || 'Gagal menghapus item';
            throw new Error(msg);
        }
    },

    clearCart: async (): Promise<MessageResponse> => {
        try {
            const response = await api.delete<MessageResponse>("/cart/clear");
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    },

    checkout: async (data: any = {}): Promise<OrderResponse> => {
        try {
            const response = await api.post<OrderResponse>("/orders/checkout", data);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    },

    buyNow: async (data: { variantId: number; quantity: number }): Promise<OrderResponse> => {
        try {
            const response = await api.post<OrderResponse>("/orders/buy-now", data);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    },

    getOrderSummary: async (orderId: number): Promise<OrderSummaryResponse> => {
        try {
            const response = await api.get<OrderSummaryResponse>(`/orders/${orderId}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    },

    getOrderHistory: async (page = 0, pageSize = 25): Promise<OrderHistoryResponse> => {
        try {
            const response = await api.get<OrderHistoryResponse>("/orders/history", {
                params: { page, page_size: pageSize }
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    },

    updateOrderStatus: async (orderId: number, status: string): Promise<MessageResponse> => {
        try {
            const response = await api.patch<MessageResponse>(`/orders/${orderId}/update`, null, {
                params: { status }
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    },

    cancelOrder: async (orderCode: string): Promise<MessageResponse> => {
        try {
            const response = await api.patch<MessageResponse>(`/orders/${orderCode}/cancel`);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    },

    requestRefund: async (orderCode: string, reason: string): Promise<MessageResponse> => {
        try {
            const response = await api.post<MessageResponse>(`/transaction/cancel-by-reference/${orderCode}`, {
                refundReason: reason
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    }
};
