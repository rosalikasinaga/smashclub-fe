import { api } from "../../lib/axios";
import type { TopUpRequest, TopUpData, WalletResponse, WalletBalanceResponse } from "./wallet.types";

export const walletService = {
    topUp: async (data: TopUpRequest): Promise<WalletResponse<TopUpData>> => {
        const response = await api.post("/wallet/balance/topup", data);
        return response.data;
    },

    getWalletBalance: async (): Promise<WalletBalanceResponse> => {
        const response = await api.get<WalletBalanceResponse>("/wallet/balance");
        return response.data;
    }
};
