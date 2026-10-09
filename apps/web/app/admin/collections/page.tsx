'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminApi } from '../admin-api';
import { DataTable, Column } from '../components/DataTable';

interface CollectionRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  status: string;
  sortOrder: number;
  productCount: number;
  products?: string[];
}

interface ProductOption {
  id: string;
  name: string;
  slug: string;
  price: number;
  images?: string[];
  category?: string;
}

type CollectionForm = {
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  status: string;
  sortOrder: number;
  products: string[];
  productSearch: string;
};

const defaultForm = (): CollectionForm => ({
  name: '',
  slug: '',
  description: '',
  bannerImage: '',
  status: 'ACTIVE',
  sortOrder: 0,
  products: [],
  productSearch: '',
});

const inputClass =
  'w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-amber-500 outline-none text-xs';
const labelClass =
  'block text-stone-400 mb-1 font-semibold uppercase tracking-wider text-[10px]';

const SEED_COLLECTIONS: CollectionRow[] = [
  {
    id: 'col-all',
    name: 'All Fragrances',
    slug: 'all',
    description: 'Explore the complete Oud Nomad universe — luxury perfumes and refreshing mists, crafted for the GCC.',
    bannerImage: '/perfume-banner.jpg',
    status: 'ACTIVE',
    sortOrder: 0,
    productCount: 3,
    products: [],
  },
  {
    id: 'col-perfumes',
    name: 'Perfumes',
    slug: 'perfumes',
    description: 'Intense, long-lasting Extrait de Parfum blends crafted with rare botanicals, precious resins, and warm musks.',
    bannerImage: '/perfume-banner.jpg',
    status: 'ACTIVE',
    sortOrder: 1,
    productCount: 3,
    products: [],
  },
  {
    id: 'col-mists',
    name: 'Mists',
    slug: 'mists',
    description: 'Light, refreshing body and hair mists — the perfect everyday scent for warm GCC days and effortless layering.',
    bannerImage: '/banners.jpg',
    status: 'ACTIVE',
    sortOrder: 2,
    productCount: 0,
    products: [],
  },
];

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CollectionForm>(defaultForm());
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'products'>('details');

  const [availableProducts, setAvailableProducts] = useState<ProductOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const fetchCollections = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await AdminApi.getCollections({ page: p, limit: 10, search });
      const items: CollectionRow[] = res.items || res.collections || [];
      setCollections(items.length > 0 ? items : SEED_COLLECTIONS);
      setTotal(res.total || SEED_COLLECTIONS.length);
    } catch {
      setCollections(SEED_COLLECTIONS);
      setTotal(SEED_COLLECTIONS.length);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchCollections(page); }, [page]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await AdminApi.getProducts({ page: 1, limit: 100 });
      setAvailableProducts(res.items || res.products || []);
    } catch {
      setAvailableProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const set = (key: keyof CollectionForm, val: any) =>
    setForm((f) => ({ ...f, [key]: val }));

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm());
    setActiveTab('details');
    setShowModal(true);
    fetchProducts();
  };

  const openEdit = (col: CollectionRow) => {
    setEditingId(col.id);
    setForm({
      name: col.name || '',
      slug: col.slug || '',
      description: col.description || '',
      bannerImage: col.bannerImage || '',
      status: col.status || 'ACTIVE',
      sortOrder: col.sortOrder ?? 0,
      products: col.products || [],
      productSearch: '',
    });
    setActiveTab('details');
    setShowModal(true);
    fetchProducts();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      bannerImage: form.bannerImage,
      status: form.status,
      sortOrder: Number(form.sortOrder),
      products: form.products,
    };
    try {
      if (editingId) {
        await AdminApi.updateCollection(editingId, payload);
      } else {
        await AdminApi.createCollection(payload);
      }
      setShowModal(false);
      fetchCollections(page);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Archive collection "${name}"?`)) return;
    try {
      await AdminApi.deleteCollection(id);
      fetchCollections(page);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const toggleProduct = (id: string) => {
    setForm((f) => ({
      ...f,
      products: f.products.includes(id)
        ? f.products.filter((p) => p !== id)
        : [...f.products, id],
    }));
  };

  const filteredProducts = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(form.productSearch.toLowerCase())
  );

  const columns: Column<CollectionRow>[] = [
    {
      header: 'Collection',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.bannerImage && (
            <img
              src={row.bannerImage}
              alt=""
              className="w-14 h-9 object-cover rounded opacity-80 flex-shrink-0 bg-stone-800 border border-stone-700"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div>
            <div className="font-semibold text-stone-100 text-sm">{row.name}</div>
            <div className="text-[10px] text-stone-500 font-mono">/collections/{row.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      cell: (row) => (
        <span className="text-xs text-stone-400 line-clamp-2 max-w-xs">
          {row.description || '—'}
        </span>
      ),
    },
    {
      header: 'Products',
      cell: (row) => (
        <span className="font-mono text-amber-400 font-bold text-xs">
          {row.productCount ?? (row.products?.length || 0)}
        </span>
      ),
    },
    {
      header: 'Sort',
      cell: (row) => (
        <span className="font-mono text-stone-400 text-xs">{row.sortOrder ?? 0}</span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
          row.status === 'ACTIVE'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-stone-800 text-stone-400 border-stone-700'
        }`}>
          {row.status || 'ACTIVE'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <a
            href={`/collections/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded transition-all"
          >
            View ↗
          </a>
          <button
            onClick={() => openEdit(row)}
            className="px-2.5 py-1 text-xs bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-600/30 rounded transition-all"
          >
            Edit
          </button>
          {row.id !== 'col-all' && (
            <button
              onClick={() => handleDelete(row.id, row.name)}
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
          <h1 className="text-2xl font-bold text-stone-100">Collections</h1>
          <p className="text-sm text-stone-400">
            Manage storefront collections — banners, descriptions, sort order, and product assignments.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
        >
          + New Collection
        </button>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); setPage(1); fetchCollections(1); }}
        className="flex gap-3"
      >
        <input
          type="text"
          placeholder="Search collections by name..."
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

      <DataTable
        columns={columns}
        data={collections}
        total={total}
        page={page}
        limit={10}
        onPageChange={setPage}
        isLoading={loading}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[92vh]">

            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 flex-shrink-0">
              <div>
                <h3 className="font-bold text-lg text-stone-100">
                  {editingId ? 'Edit Collection' : 'New Collection'}
                </h3>
                {editingId && (
                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                    /collections/{form.slug}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-100 text-lg w-8 h-8 flex items-center justify-center rounded hover:bg-stone-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-stone-800 flex-shrink-0">
              {[
                { id: 'details', label: '🗂️  Details' },
                { id: 'products', label: '🧴  Products' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as 'details' | 'products')}
                  className={`flex items-center gap-1.5 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-stone-500 hover:text-stone-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                {activeTab === 'details' && (
                  <>
                    <div>
                      <label className={labelClass}>Collection Name *</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            name: e.target.value,
                            slug: e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, '-')
                              .replace(/[^a-z0-9-]/g, ''),
                          }))
                        }
                        className={inputClass}
                        placeholder="e.g. Royal Oud Reserve"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>URL Handle *</label>
                        <input
                          required
                          type="text"
                          value={form.slug}
                          onChange={(e) => set('slug', e.target.value)}
                          className={`${inputClass} font-mono`}
                          placeholder="royal-oud-reserve"
                        />
                        <p className="text-[10px] text-stone-600 mt-1">
                          /collections/{form.slug || '…'}
                        </p>
                      </div>
                      <div>
                        <label className={labelClass}>Sort Order</label>
                        <input
                          type="number"
                          min="0"
                          value={form.sortOrder}
                          onChange={(e) => set('sortOrder', Number(e.target.value))}
                          className={`${inputClass} font-mono`}
                          placeholder="0"
                        />
                        <p className="text-[10px] text-stone-600 mt-1">
                          Lower = appears first in nav.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) => set('description', e.target.value)}
                        className={inputClass}
                        placeholder="Shown as subtitle under the collection banner on storefront."
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Banner Image URL</label>
                      <input
                        type="text"
                        value={form.bannerImage}
                        onChange={(e) => set('bannerImage', e.target.value)}
                        className={inputClass}
                        placeholder="https://cdn.shopify.com/… or Cloudinary URL"
                      />
                      {form.bannerImage && (
                        <div className="mt-2 relative w-full h-28 rounded overflow-hidden border border-stone-800 bg-stone-950">
                          <img
                            src={form.bannerImage}
                            alt="Banner preview"
                            className="w-full h-full object-cover opacity-80"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://placehold.co/640x112/1c1917/6b7280?text=Invalid+Image+URL';
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <span className="text-[9px] text-white/60 font-mono uppercase tracking-wider">
                              Live Banner Preview
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Status *</label>
                      <select
                        value={form.status}
                        onChange={(e) => set('status', e.target.value)}
                        className={inputClass}
                      >
                        <option value="ACTIVE">Active — visible on storefront</option>
                        <option value="DRAFT">Draft — hidden from navigation</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'products' && (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>Assign Products</label>
                      <p className="text-[10px] text-stone-500 mb-3">
                        Selected products appear when customers browse{' '}
                        <span className="text-amber-400 font-mono">/collections/{form.slug || '…'}</span>
                      </p>
                      <input
                        type="text"
                        value={form.productSearch}
                        onChange={(e) => set('productSearch', e.target.value)}
                        className={inputClass}
                        placeholder="Filter products by name..."
                      />
                    </div>

                    <div className="flex items-center justify-between py-2 px-3 bg-amber-500/5 border border-amber-500/20 rounded text-xs">
                      <span className="text-stone-400">
                        {form.products.length === 0
                          ? 'No products selected'
                          : `${form.products.length} product${form.products.length === 1 ? '' : 's'} assigned`}
                      </span>
                      {form.products.length > 0 && (
                        <button
                          type="button"
                          onClick={() => set('products', [])}
                          className="text-red-400 hover:text-red-300 text-[10px] font-semibold"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {productsLoading ? (
                      <div className="py-10 text-center text-stone-500 text-xs">
                        Loading products...
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="py-10 text-center text-stone-600 text-xs border border-dashed border-stone-800 rounded">
                        No products found.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                        {filteredProducts.map((product) => {
                          const isSelected = form.products.includes(product.id);
                          return (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => toggleProduct(product.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${
                                isSelected
                                  ? 'border-amber-500/40 bg-amber-500/10 text-stone-100'
                                  : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                              }`}
                            >
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt=""
                                  className="w-9 h-12 object-cover rounded flex-shrink-0 bg-stone-800"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              ) : (
                                <div className="w-9 h-12 bg-stone-800 rounded flex-shrink-0 flex items-center justify-center text-lg">
                                  🧴
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium truncate">{product.name}</div>
                                <div className="text-[10px] text-stone-500 font-mono">
                                  AED {product.price} · {product.category || 'uncategorized'}
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected
                                  ? 'bg-amber-500 border-amber-500 text-stone-950'
                                  : 'border-stone-700'
                              }`}>
                                {isSelected && <span className="text-[10px] font-bold leading-none">✓</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-t border-stone-800 flex-shrink-0 bg-stone-900 rounded-b-xl">
                <span className="text-[10px] text-stone-600 font-mono">
                  {activeTab === 'details' ? '1/2 — Details' : '2/2 — Products'}
                </span>
                <div className="flex gap-3">
                  {activeTab === 'details' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className="px-5 py-2 bg-stone-700 hover:bg-stone-600 text-stone-100 font-bold rounded text-xs uppercase tracking-wider transition-all"
                      >
                        Next: Products →
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveTab('details')}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded text-xs"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold rounded text-xs uppercase tracking-wider transition-all"
                      >
                        {saving ? 'Saving...' : editingId ? 'Update Collection' : 'Create Collection'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
