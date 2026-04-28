export interface ProductVariant {
    id: number;
    price: number;
    sku: string;
    stock: number;
    variantImgLink: string;
    variantName: string;
}

export interface ProductAPI {
    category: string;
    defaultImgLink: string;
    id: number;
    productDesc: string;
    productName: string;
    productVariants: ProductVariant[];
    status: number;
}

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    images?: string[];
    description?: string;
    fullDescription?: string;
    isHot?: boolean;
    isNew?: boolean;
    gripSizes?: string[];
    sizes?: string[];
    specifications?: Record<string, string>;
    variants?: ProductVariant[];
}

export interface CartItem extends Product {
    quantity: number;
    variantName: string;
    variantImgLink: string;
}

export interface ProductSearchResponse {
    data: {
        content: ProductAPI[];
        empty: boolean;
        first: boolean;
        last: boolean;
        number: number;
        numberOfElements: number;
        pageable: any;
        size: number;
        sort: any;
        totalElements: number;
        totalPages: number;
    };
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
}

export interface ProductResponse {
    data: ProductAPI;
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
}

export interface CartAPIResponse {
    data: {
        cartId: number;
        createdAt: string;
        items: any[];
        status: number;
        totalPrice: number;
        userId: string;
    };
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
}

export interface AddToCartRequest {
    userId: string;
    variantId: number;
    quantity: number;
}

export interface AddToCartResponse {
    // Cart data fields
    cartId: number;
    userId: string;
    items: any[];
    totalPrice: number;
    status: number;
    createdAt: string;
    // Standard API wrapper fields
    success?: boolean;
    message?: string;
    timestamp?: string;
}

export interface MessageResponse {
    message: string;
}

export interface Order {
    orderId: number;
    orderCode: string;
    user: string;
    total_price: number;
    status: number;
    created_at: string;
    transactionId: string;
    userId: string;
    paymentLink?: string;
}

export interface OrderResponse {
    message: string;
    data: Order;
    success: boolean;
    status: number;
    timestamp: string;
}

export interface OrderItem {
    price: number;
    quantity: number;
    totalPrice: number;
    variantId: number;
    variantName: string;
}

export interface OrderSummary {
    items: OrderItem[];
    orderCode: string;
    orderDate: string;
    orderId: number;
    status: number;
    subtotal: number;
    totalPrice: number;
    paymentLink?: string;
}

export interface OrderSummaryResponse {
    data: OrderSummary;
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
}

export interface OrderHistoryResponse {
    data: {
        content: Order[];
        empty: boolean;
        first: boolean;
        last: boolean;
        number: number;
        numberOfElements: number;
        pageable: any;
        size: number;
        sort: any;
        totalElements: number;
        totalPages: number;
    };
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
}