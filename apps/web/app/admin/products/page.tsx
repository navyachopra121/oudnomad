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
  
  // Create / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryName: 'Royal Oud & Extraits',
    price: 350,
    sku: '',
    concentration: 'Extrait de Parfum',
  });

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

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      categoryName: 'Royal Oud & Extraits',
      price: 350,
      sku: 'OUD-' + Math.floor(100 + Math.random() * 900),
      concentration: 'Extrait de Parfum',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      categoryName: product.category?.name || 'Royal Oud & Extraits',
      price: product.price || 350,
      sku: product.sku || '',
      concentration: product.concentration || 'Extrait de Parfum',
    });
    setShowModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await AdminApi.updateProduct(editingId, formData);
        alert('Product updated successfully.');
      } else {
        await AdminApi.createProduct(formData);
        alert('New product created successfully in catalog.');
      }
      setShowModal(false);
      fetchProducts(page);
    } catch (err: any) {
      alert(`Operation failed: ${err.message}`);
    }
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
      cell: (row) => <span className="text-xs text-stone-300">{row.category?.name || row.categoryName || 'Unassigned'}</span>,
    },
    {
      header: 'Price',
      cell: (row) => <span className="font-mono text-amber-400 font-semibold">${row.price}</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <span
          className={`inline-flex px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${
            row.status !== 'ARCHIVED'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-stone-800 text-stone-400 border border-stone-700'
          }`}
        >
          {row.status || 'ACTIVE'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenEditModal(row)}
            className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded transition-all"
          >
            Edit
          </button>
          {row.status !== 'ARCHIVED' && (
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
          <p className="text-sm text-stone-400">View, search, create, edit, and soft-delete products.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm"
        >
          + Add New Flacon
        </button>
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
          className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold px-5 py-2 rounded-lg text-sm transition-all border border-stone-700"
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

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 max-w-lg w-full space-y-5 shadow-2xl text-stone-200">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-lg text-stone-100">
                {editingId ? 'Edit Product Flacon' : 'Create New Product Flacon'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-100">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-amber-500 outline-none"
                  placeholder="e.g. Royal Cambodian Oud"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase tracking-wider">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-amber-500 outline-none font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase tracking-wider">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-amber-500 outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase tracking-wider">Category</label>
                  <select
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-amber-500 outline-none"
                  >
                    <option value="Royal Oud & Extraits">Royal Oud & Extraits</option>
                    <option value="Pure Concentrated Attars">Pure Concentrated Attars</option>
                    <option value="Incense & Sacred Bakhoor">Incense & Sacred Bakhoor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold uppercase tracking-wider">Price (USD)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-amber-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-amber-500 outline-none"
                  placeholder="Describe scent profile notes, wild harvest origin, and aging process..."
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
