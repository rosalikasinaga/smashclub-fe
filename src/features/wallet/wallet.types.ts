export interface WalletResponse<T> {
    path?: string;
    data: T;
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
}

export interface TopUpRequest {
    balance: number;
}

export interface TopUpData {
    transactionCode: string;
    paymentData: {
        invoiceUrl: string;
    };
}

export interface WalletLog {
    id: number;
    previousBalance: number;
    currentBalance: number;
    usageValue: number;
    usageType: boolean;
    refID: string;
    createdAt: string;
}

export interface WalletBalanceData {
    walletLog: WalletLog[];
    userBalance: number;
}

export type WalletBalanceResponse = WalletResponse<WalletBalanceData>;
