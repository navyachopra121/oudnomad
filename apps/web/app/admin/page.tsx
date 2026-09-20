'use client';

import React, { useEffect, useState } from 'react';
import { AdminApi } from './admin-api';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminApi.getDashboardSummary()
      .then((data) => setSummary(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  const formatCurrency = (minor: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(minor / 100);
  };

  const lowStockItems = summary?.lowStock || [];
  const statusCounts = summary?.ordersByStatus || { CONFIRMED: 0, SHIPPED: 0, DELIVERED: 0, CANCELLED: 0 };

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">Atelier Operations Control</h1>
          <p className="text-sm text-stone-400">
            Real-time metrics, revenue totals, stock alerts, and store controls.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm"
          >
            + Add New Flacon
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-all border border-stone-700"
          >
            Process Orders
          </Link>
          <Link
            href="/admin/inventory"
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-all border border-stone-700"
          >
            Adjust Stock
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Today Orders */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-medium">
            <span>TODAY'S ORDERS</span>
            <span className="text-amber-500 font-bold">24H</span>
          </div>
          <div className="text-3xl font-extrabold text-stone-100">{summary?.orders?.today ?? 0}</div>
          <div className="text-xs text-stone-500 mt-2">New order submissions today</div>
        </div>

        {/* Week Orders */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-medium">
            <span>THIS WEEK'S ORDERS</span>
            <span className="text-amber-500 font-bold">7D</span>
          </div>
          <div className="text-3xl font-extrabold text-stone-100">{summary?.orders?.thisWeek ?? 0}</div>
          <div className="text-xs text-stone-500 mt-2">Total orders in current week</div>
        </div>

        {/* Month Orders */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-medium">
            <span>THIS MONTH'S ORDERS</span>
            <span className="text-amber-500 font-bold">30D</span>
          </div>
          <div className="text-3xl font-extrabold text-stone-100">{summary?.orders?.thisMonth ?? 0}</div>
          <div className="text-xs text-stone-500 mt-2">Total orders in current month</div>
        </div>

        {/* Today Revenue */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-medium">
            <span>TODAY'S REVENUE</span>
            <span className="text-emerald-500 font-bold">USD</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {formatCurrency(summary?.revenue?.today?.[0]?.totalMinor ?? 0)}
          </div>
          <div className="text-xs text-stone-500 mt-2">Confirmed payment total today</div>
        </div>

        {/* Week Revenue */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-medium">
            <span>THIS WEEK'S REVENUE</span>
            <span className="text-emerald-500 font-bold">USD</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {formatCurrency(summary?.revenue?.thisWeek?.[0]?.totalMinor ?? 0)}
          </div>
          <div className="text-xs text-stone-500 mt-2">Confirmed payment total this week</div>
        </div>

        {/* Month Revenue */}
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-medium">
            <span>THIS MONTH'S REVENUE</span>
            <span className="text-emerald-500 font-bold">USD</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {formatCurrency(summary?.revenue?.thisMonth?.[0]?.totalMinor ?? 0)}
          </div>
          <div className="text-xs text-stone-500 mt-2">Confirmed payment total this month</div>
        </div>
      </div>

      {/* Orders by Status Section */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-stone-200 mb-4">Orders Breakdown by Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="bg-stone-950 p-4 rounded-lg border border-stone-800/80">
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                {status.replace('_', ' ')}
              </div>
              <div className="text-2xl font-bold text-amber-400">{count as number}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert Section */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-200">Low Stock Vault Alert</h2>
            <p className="text-xs text-stone-400">
              Products with available stock below configured threshold
            </p>
          </div>
          <Link
            href="/admin/inventory?lowStockOnly=true"
            className="text-xs font-semibold text-amber-400 hover:underline"
          >
            Manage Inventory →
          </Link>
        </div>

        {lowStockItems.length === 0 ? (
          <div className="text-xs text-stone-500 py-6 text-center">
            No items currently below low stock threshold.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-300">
              <thead className="bg-stone-950 text-stone-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Available Stock</th>
                  <th className="px-4 py-3">Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {lowStockItems.map((item: any) => (
                  <tr key={item.variantId} className="hover:bg-stone-800/40">
                    <td className="px-4 py-3 font-medium text-stone-200">{item.productName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-400">{item.sku}</td>
                    <td className="px-4 py-3 font-bold text-red-400">{item.quantityAvailable}</td>
                    <td className="px-4 py-3 text-stone-400">{item.threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
