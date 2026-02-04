const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

interface TokenPair {
  access: string;
  refresh: string;
}

// Token management
export const getTokens = (): TokenPair | null => {
  const tokens = localStorage.getItem('auth_tokens');
  return tokens ? JSON.parse(tokens) : null;
};

export const setTokens = (tokens: TokenPair): void => {
  localStorage.setItem('auth_tokens', JSON.stringify(tokens));
};

export const clearTokens = (): void => {
  localStorage.removeItem('auth_tokens');
};

// API client with auth headers
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const tokens = getTokens();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (tokens?.access) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${tokens.access}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.detail || `HTTP ${response.status}`);
  }

  return response.json();
};

// Generate idempotency key for transfers
export const generateIdempotencyKey = (): string => {
  return crypto.randomUUID();
};
