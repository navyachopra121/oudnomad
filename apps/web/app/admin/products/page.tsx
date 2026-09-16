'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '../admin-api';
import { DataTable, Column } from '../components/DataTable';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', slug: '', description: '', categoryId: '', price: 0, sku: '' });

  const fetchProducts = (p = page) => {
    setLoading(true);
    AdminApi.getProducts({ page: p, limit: 10, search })
      .then((res) => {
        setProducts(res.items || res.products || []);
        setTotal(res.total || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1);
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive (soft delete) this product?')) return;
    try {
      await AdminApi.deleteProduct(id);
      fetchProducts(page);
    } catch (err: any) {
      alert(`Archive failed: ${err.message}`);
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Product Name',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <div className="font-semibold text-stone-100">{row.name}</div>
          <div className="text-xs text-stone-400 font-mono">/{row.slug}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (row) => <span className="text-xs text-stone-300">{row.category?.name || 'Unassigned'}</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <span
          className={`inline-flex px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${
            row.status === 'ACTIVE'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-stone-800 text-stone-400 border border-stone-700'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          {row.status === 'ACTIVE' && (
            <button
              onClick={() => handleArchive(row.id)}
              className="px-2.5 py-1 text-xs bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-800/40 rounded transition-all"
            >
              Archive
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">Product Catalog Management</h1>
          <p className="text-sm text-stone-400">View, search, create, and soft-delete products.</p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3">
        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-stone-900 border border-stone-800 rounded-lg px-4 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500 flex-1"
        />
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-5 py-2 rounded-lg text-sm transition-all"
        >
          Search
        </button>
      </form>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={products}
        total={total}
        page={page}
        limit={10}
        onPageChange={setPage}
        isLoading={loading}
      />
    </div>
  );
}
