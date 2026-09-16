'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '../admin-api';
import { DataTable, Column } from '../components/DataTable';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = (p = page, status = statusFilter) => {
    setLoading(true);
    AdminApi.getOrders({ page: p, limit: 10, status: status || undefined })
      .then((res) => {
        setOrders(res.items || []);
        setTotal(res.total || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders(page, statusFilter);
  }, [page, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      PENDING_PAYMENT: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      CONFIRMED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      PLACED: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      SHIPPED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      DELIVERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      CANCELLED: 'bg-stone-800 text-stone-400 border-stone-700',
      REFUNDED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      PAYMENT_FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
      EXPIRED: 'bg-stone-800 text-stone-400 border-stone-700',
    };

    return (
      <span
        className={`inline-flex px-2.5 py-1 text-[11px] font-bold uppercase rounded-full border ${
          colorMap[status] || 'bg-stone-800 text-stone-300 border-stone-700'
        }`}
      >
        {status.replace('_', ' ')}
      </span>
    );
  };

  const columns: Column<any>[] = [
    {
      header: 'Order Number / ID',
      accessorKey: 'id',
      cell: (row) => (
        <div>
          <Link href={`/admin/orders/${row.id}`} className="font-bold text-amber-400 hover:underline">
            {row.orderNumber || `#${row.id.substring(0, 8)}`}
          </Link>
          <div className="text-[11px] text-stone-500">{new Date(row.createdAt).toLocaleString()}</div>
        </div>
      ),
    },
    {
      header: 'Customer',
      cell: (row) => (
        <div className="text-xs">
          <div className="font-semibold text-stone-200">
            {row.user?.firstName} {row.user?.lastName}
          </div>
          <div className="text-stone-400">{row.user?.email}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Total Amount',
      cell: (row) => <span className="font-bold text-stone-100">{formatCurrency(row.total)}</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Link
          href={`/admin/orders/${row.id}`}
          className="px-3 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 transition-all font-medium"
        >
          View Detail →
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">Order Management</h1>
          <p className="text-sm text-stone-400">View and update store order statuses.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['', 'PENDING_PAYMENT', 'CONFIRMED', 'PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].map(
          (status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all border ${
                statusFilter === status
                  ? 'bg-amber-500 text-stone-950 border-amber-500'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800'
              }`}
            >
              {status ? status.replace('_', ' ') : 'ALL ORDERS'}
            </button>
          ),
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={orders}
        total={total}
        page={page}
        limit={10}
        onPageChange={setPage}
        isLoading={loading}
      />
    </div>
  );
}
