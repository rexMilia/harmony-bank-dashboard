import { apiClient } from './api';

interface WalletBalanceResponse {
  'wallet balance': number;
}

export const walletService = {
  async getBalance(): Promise<number> {
    const response = await apiClient<WalletBalanceResponse>('/wallets/balance/');
    return response['wallet balance'];
  },
};
