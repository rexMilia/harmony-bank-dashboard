export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  walletId: string;
  walletBalance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  sender: {
    id: string;
    name: string;
  };
  receiver: {
    id: string;
    name: string;
  };
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  reference: string;
}

export const currentUser: User = {
  id: "USR-001",
  firstName: "Adaeze",
  lastName: "Okonkwo",
  email: "adaeze.okonkwo@email.com",
  phone: "+234 801 234 5678",
  avatar: "",
  walletId: "WAL-7829-4156-8932",
  walletBalance: 2547850.00,
  createdAt: "2023-06-15T10:30:00Z",
};

export const transactions: Transaction[] = [
  {
    id: "TXN-001",
    type: "credit",
    amount: 150000.00,
    description: "Salary Payment",
    sender: { id: "USR-010", name: "TechCorp Ltd" },
    receiver: { id: "USR-001", name: "Adaeze Okonkwo" },
    status: "completed",
    timestamp: "2024-01-28T09:30:00Z",
    reference: "REF-SAL-2024-001",
  },
  {
    id: "TXN-002",
    type: "debit",
    amount: 25000.00,
    description: "Utility Bill Payment",
    sender: { id: "USR-001", name: "Adaeze Okonkwo" },
    receiver: { id: "USR-020", name: "EKEDC" },
    status: "completed",
    timestamp: "2024-01-27T14:15:00Z",
    reference: "REF-BILL-2024-002",
  },
  {
    id: "TXN-003",
    type: "credit",
    amount: 50000.00,
    description: "Transfer from Emeka",
    sender: { id: "USR-015", name: "Emeka Chukwu" },
    receiver: { id: "USR-001", name: "Adaeze Okonkwo" },
    status: "completed",
    timestamp: "2024-01-26T11:45:00Z",
    reference: "REF-P2P-2024-003",
  },
  {
    id: "TXN-004",
    type: "debit",
    amount: 8500.00,
    description: "Mobile Airtime",
    sender: { id: "USR-001", name: "Adaeze Okonkwo" },
    receiver: { id: "USR-030", name: "MTN Nigeria" },
    status: "completed",
    timestamp: "2024-01-25T16:20:00Z",
    reference: "REF-AIR-2024-004",
  },
  {
    id: "TXN-005",
    type: "debit",
    amount: 75000.00,
    description: "Online Shopping",
    sender: { id: "USR-001", name: "Adaeze Okonkwo" },
    receiver: { id: "USR-040", name: "Jumia Nigeria" },
    status: "pending",
    timestamp: "2024-01-25T10:00:00Z",
    reference: "REF-SHOP-2024-005",
  },
  {
    id: "TXN-006",
    type: "credit",
    amount: 200000.00,
    description: "Freelance Payment",
    sender: { id: "USR-050", name: "Global Designs Inc" },
    receiver: { id: "USR-001", name: "Adaeze Okonkwo" },
    status: "completed",
    timestamp: "2024-01-24T08:30:00Z",
    reference: "REF-FREE-2024-006",
  },
  {
    id: "TXN-007",
    type: "debit",
    amount: 15000.00,
    description: "Transfer to Ngozi",
    sender: { id: "USR-001", name: "Adaeze Okonkwo" },
    receiver: { id: "USR-060", name: "Ngozi Ibe" },
    status: "completed",
    timestamp: "2024-01-23T15:45:00Z",
    reference: "REF-P2P-2024-007",
  },
  {
    id: "TXN-008",
    type: "debit",
    amount: 45000.00,
    description: "Internet Subscription",
    sender: { id: "USR-001", name: "Adaeze Okonkwo" },
    receiver: { id: "USR-070", name: "Spectranet" },
    status: "failed",
    timestamp: "2024-01-22T12:00:00Z",
    reference: "REF-NET-2024-008",
  },
  {
    id: "TXN-009",
    type: "credit",
    amount: 30000.00,
    description: "Refund - Failed Transaction",
    sender: { id: "USR-070", name: "Spectranet" },
    receiver: { id: "USR-001", name: "Adaeze Okonkwo" },
    status: "completed",
    timestamp: "2024-01-22T14:30:00Z",
    reference: "REF-REF-2024-009",
  },
  {
    id: "TXN-010",
    type: "debit",
    amount: 120000.00,
    description: "Rent Payment",
    sender: { id: "USR-001", name: "Adaeze Okonkwo" },
    receiver: { id: "USR-080", name: "Landlord Account" },
    status: "completed",
    timestamp: "2024-01-20T09:00:00Z",
    reference: "REF-RENT-2024-010",
  },
];

export const stats = {
  totalCredits: transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0),
  totalDebits: transactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0),
  pendingTransactions: transactions.filter(t => t.status === 'pending').length,
  totalTransactions: transactions.length,
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
