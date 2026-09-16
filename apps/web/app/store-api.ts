const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function storeFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
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

export const StoreApi = {
  // Search
  search: (params: { q?: string; category?: string; minPrice?: number; maxPrice?: number; minRating?: number; page?: number; limit?: number }) => {
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return storeFetch<any>(`/search?${query}`);
  },

  // Products
  getProductBySlug: (slug: string) => storeFetch<any>(`/catalog/products/${slug}`),

  // Reviews
  getProductReviews: (productId: string, page = 1) => storeFetch<any>(`/products/${productId}/reviews?page=${page}`),
  createReview: (productId: string, data: { rating: number; title?: string; body?: string }) =>
    storeFetch<any>(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
  deleteReview: (reviewId: string) => storeFetch<any>(`/reviews/${reviewId}`, { method: 'DELETE' }),
  reportReview: (productId: string, reviewId: string) =>
    storeFetch<any>(`/products/${productId}/reviews/${reviewId}/report`, { method: 'POST' }),

  // Recommendations
  getRecommendations: (productId: string) => storeFetch<any>(`/products/${productId}/recommendations`),

  // Categories (public tree for navigation)
  getCategories: () =>
    storeFetch<
      {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        children: { id: string; name: string; slug: string; description: string | null; children: unknown[] }[];
      }[]
    >('/categories'),

  // Wishlist
  getWishlist: (page = 1) => storeFetch<any>(`/wishlist?page=${page}`),
  addToWishlist: (productId: string) => storeFetch<any>(`/wishlist/${productId}`, { method: 'POST' }),
  removeFromWishlist: (productId: string) => storeFetch<any>(`/wishlist/${productId}`, { method: 'DELETE' }),
};
