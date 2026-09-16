const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const data = await res.json();
      errorMsg = data.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return res.json();
}

export const AdminApi = {
  // Dashboard
  getDashboardSummary: () => apiFetch<any>('/admin/dashboard/summary'),

  // Products
  getProducts: (params: { page?: number; limit?: number; search?: string } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any>(`/catalog/products?${query}`);
  },
  createProduct: (data: any) => apiFetch<any>('/catalog/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) => apiFetch<any>(`/catalog/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProduct: (id: string) => apiFetch<any>(`/catalog/products/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: (params: { status?: string; startDate?: string; endDate?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any>(`/admin/orders?${query}`);
  },
  getOrderById: (id: string) => apiFetch<any>(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string, note?: string) =>
    apiFetch<any>(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, note }) }),
  releaseOrder: (id: string, note?: string) =>
    apiFetch<any>(`/admin/orders/${id}/release`, { method: 'PATCH', body: JSON.stringify({ note }) }),
  createRefund: (orderId: string, amount: number, reason?: string) =>
    apiFetch<any>('/admin/refunds', { method: 'POST', body: JSON.stringify({ orderId, amount, reason }) }),

  // Inventory
  getInventory: (params: { lowStockOnly?: boolean; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any>(`/admin/inventory?${query}`);
  },
  adjustInventory: (id: string, delta: number, reason: string) =>
    apiFetch<any>(`/admin/inventory/${id}/adjust`, { method: 'POST', body: JSON.stringify({ delta, reason }) }),
  getInventoryAdjustments: (id: string, params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any>(`/admin/inventory/${id}/adjustments?${query}`);
  },

  // Users
  getUsers: (params: { search?: string; role?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any>(`/admin/users?${query}`);
  },
  toggleBlockUser: (id: string, isBlocked: boolean) =>
    apiFetch<any>(`/admin/users/${id}/block`, { method: 'PATCH', body: JSON.stringify({ isBlocked }) }),
  changeUserRole: (id: string, role: string) =>
    apiFetch<any>(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),

  // Audit Logs
  getAuditLogs: (params: { targetType?: string; targetId?: string; actorId?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any>(`/admin/audit-logs?${query}`);
  },

  // Reviews Moderation
  getReportedReviews: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any>(`/admin/reviews?${query}`);
  },
  deleteReview: (id: string) => apiFetch<any>(`/admin/reviews/${id}`, { method: 'DELETE' }),
};
