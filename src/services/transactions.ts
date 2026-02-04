import { apiClient, generateIdempotencyKey } from './api';

export interface LedgerEntry {
  transaction_id: string;
  wallet: number;
  amount: string;
  entry_type: 'CREDIT' | 'DEBIT';
  created_at: string;
}

interface TransferRequest {
  receiver_id: string;
  amount: number;
}

interface TransferResponse {
  transaction_id: string;
  status: string;
}

export const transactionService = {
  async transfer(data: TransferRequest): Promise<TransferResponse> {
    return apiClient<TransferResponse>('/transactions/transfer/', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        idempotency_key: generateIdempotencyKey(),
      }),
    });
  },

  async getLedger(): Promise<LedgerEntry[]> {
    return apiClient<LedgerEntry[]>('/transactions/ledgerEntry');
  },
};
