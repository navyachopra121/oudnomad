'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '../admin-api';

interface ReportedReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string | null;
  body: string | null;
  isReported: boolean;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  product: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReportedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchReported = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminApi.getReportedReviews();
      setReviews(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reported reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReported();
  }, []);

  const handleRemove = async (reviewId: string) => {
    if (!confirm('Are you sure you want to remove this reported review?')) return;
    try {
      await AdminApi.deleteReview(reviewId);
      setActionSuccess('Review removed successfully');
      fetchReported();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(`Failed to remove review: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">Review Moderation</h1>
          <p className="text-sm text-stone-400">
            Manage reviews flagged by customers for admin removal.
          </p>
        </div>
        <button
          onClick={fetchReported}
          className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-sm transition-all"
        >
          🔄 Refresh
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm">
          {actionSuccess}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-stone-500">Loading flagged reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center text-stone-400">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-lg font-semibold text-stone-200">No Flagged Reviews</h3>
          <p className="text-sm text-stone-500 mt-1">There are currently no reviews reported for moderation.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-stone-700 transition-all"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-md text-xs font-semibold">
                    ⭐ {rev.rating} / 5
                  </span>
                  <span className="text-xs font-medium text-stone-400">
                    Product:{' '}
                    <span className="text-stone-200 font-semibold">{rev.product?.name || rev.productId}</span>
                  </span>
                  <span className="text-xs text-stone-500">
                    By: {rev.user?.firstName || rev.user?.email || 'User'}
                  </span>
                </div>

                {rev.title && <h4 className="font-semibold text-stone-100 text-sm">{rev.title}</h4>}
                {rev.body && <p className="text-sm text-stone-300 bg-stone-950/60 p-3 rounded-lg border border-stone-800">{rev.body}</p>}

                <div className="text-xs text-stone-500">
                  Reported on: {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleRemove(rev.id)}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition-all"
                >
                  🗑️ Remove Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
