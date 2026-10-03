'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '../admin-api';
import { DataTable, Column } from '../components/DataTable';

const defaultForm = () => ({
  name: '',
  slug: '',
  sku: 'OUD-' + Math.floor(100 + Math.random() * 900),
  categoryName: 'Royal Oud & Extraits',
  price: 350,
  compareAtPrice: '',
  status: 'ACTIVE',
  description: '',
  images: [] as string[],
  imageInput: '',
  topNotes: '',
  middleNotes: '',
  baseNotes: '',
  quantity: '100ml',
  longevity: '8-12 Hours',
  type: 'Extrait de Parfum',
  variants: [{ size: '100ml', price: 350, sku: '' }] as { size: string; price: number; sku: string }[],
});

type FormData = ReturnType<typeof defaultForm>;
type Tab = 'basic' | 'content' | 'images' | 'fragrance' | 'variants';

const inputClass = 'w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-amber-500 outline-none text-xs';
const labelClass = 'block text-stone-400 mb-1 font-semibold uppercase tracking-wider text-[10px]';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'basic', label: 'Basic Info', icon: '📋' },
  { id: 'content', label: 'Description', icon: '✍️' },
  { id: 'images', label: 'Images', icon: '🖼️' },
  { id: 'fragrance', label: 'Fragrance Notes', icon: '🏺' },
  { id: 'variants', label: 'Variants', icon: '📦' },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm());
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [saving, setSaving] = useState(false);

  const fetchProducts = (p = page) => {
    setLoading(true);
    AdminApi.getProducts({ page: p, limit: 10, search })
      .then((res) => {
        setProducts(res.items || res.products || []);
        setTotal(res.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(page); }, [page]);

  const set = (key: keyof FormData, val: any) => setFormData((f) => ({ ...f, [key]: val }));

  const openCreate = () => {
    setEditingId(null);
    setFormData(defaultForm());
    setActiveTab('basic');
    setShowModal(true);
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setActiveTab('basic');
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      sku: product.sku || '',
      categoryName: product.category?.name || 'Royal Oud & Extraits',
      price: product.price || 350,
      compareAtPrice: product.compareAtPrice || '',
      status: product.status || 'ACTIVE',
      description: product.description || '',
      images: Array.isArray(product.images) ? product.images : [],
      imageInput: '',
      topNotes: product.features?.topNotes || '',
      middleNotes: product.features?.middleNotes || '',
      baseNotes: product.features?.baseNotes || '',
      quantity: product.features?.quantity || '100ml',
      longevity: product.features?.longevity || '8-12 Hours',
      type: product.features?.type || product.concentration || 'Extrait de Parfum',
      variants: product.variants?.length
        ? product.variants.map((v: any) => ({ size: v.size || '100ml', price: v.price || product.price, sku: v.sku || '' }))
        : [{ size: '100ml', price: product.price || 350, sku: product.sku || '' }],
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: formData.name,
      slug: formData.slug,
      sku: formData.sku,
      categoryName: formData.categoryName,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
      status: formData.status,
      description: formData.description,
      images: formData.images,
      features: {
        topNotes: formData.topNotes,
        middleNotes: formData.middleNotes,
        baseNotes: formData.baseNotes,
        quantity: formData.quantity,
        longevity: formData.longevity,
        type: formData.type,
      },
      variants: formData.variants,
    };
    try {
      if (editingId) {
        await AdminApi.updateProduct(editingId, payload);
      } else {
        await AdminApi.createProduct(payload);
      }
      setShowModal(false);
      fetchProducts(page);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Archive this product?')) return;
    try {
      await AdminApi.deleteProduct(id);
      fetchProducts(page);
    } catch (err: any) {
      alert(`Archive failed: ${err.message}`);
    }
  };

  const addImage = () => {
    const url = formData.imageInput.trim();
    if (!url) return;
    setFormData((f) => ({ ...f, images: [...f.images, url], imageInput: '' }));
  };
  const removeImage = (idx: number) =>
    setFormData((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  const moveImage = (idx: number, dir: -1 | 1) => {
    setFormData((f) => {
      const imgs = [...f.images];
      const t = idx + dir;
      if (t < 0 || t >= imgs.length) return f;
      [imgs[idx], imgs[t]] = [imgs[t], imgs[idx]];
      return { ...f, images: imgs };
    });
  };

  const addVariant = () =>
    setFormData((f) => ({ ...f, variants: [...f.variants, { size: '50ml', price: f.price, sku: '' }] }));
  const removeVariant = (idx: number) =>
    setFormData((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));
  const updateVariant = (idx: number, key: string, val: any) =>
    setFormData((f) => ({ ...f, variants: f.variants.map((v, i) => i === idx ? { ...v, [key]: val } : v) }));

  const columns: Column<any>[] = [
    {
      header: 'Product',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.images?.[0] && (
            <img src={row.images[0]} alt="" className="w-10 h-14 object-cover rounded opacity-80 flex-shrink-0" />
          )}
          <div>
            <div className="font-semibold text-stone-100 text-sm">{row.name}</div>
            <div className="text-[10px] text-stone-500 font-mono">/{row.slug}</div>
            <div className="text-[10px] text-stone-600 font-mono">{row.sku}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (row) => <span className="text-xs text-stone-300">{row.category?.name || row.categoryName || '—'}</span>,
    },
    {
      header: 'Price',
      cell: (row) => (
        <div>
          <span className="font-mono text-amber-400 font-bold">AED {row.price}</span>
          {row.compareAtPrice && (
            <div className="text-[10px] text-stone-500 line-through font-mono">AED {row.compareAtPrice}</div>
          )}
        </div>
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
          <button onClick={() => openEdit(row)} className="px-2.5 py-1 text-xs bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-600/30 rounded transition-all">
            Edit
          </button>
          {row.status !== 'ARCHIVED' && (
            <button onClick={() => handleArchive(row.id)} className="px-2.5 py-1 text-xs bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-800/40 rounded transition-all">
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
          <h1 className="text-2xl font-bold text-stone-100">Product Catalog</h1>
          <p className="text-sm text-stone-400">Manage images, fragrance notes, variants and all product details.</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all">
          + Add New Flacon
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchProducts(1); }} className="flex gap-3">
        <input type="text" placeholder="Search products by name..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="bg-stone-900 border border-stone-800 rounded-lg px-4 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500 flex-1" />
        <button type="submit" className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold px-5 py-2 rounded-lg text-sm transition-all border border-stone-700">
          Search
        </button>
      </form>

      <DataTable columns={columns} data={products} total={total} page={page} limit={10} onPageChange={setPage} isLoading={loading} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[92vh]">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 flex-shrink-0">
              <div>
                <h3 className="font-bold text-lg text-stone-100">{editingId ? 'Edit Product' : 'New Product'}</h3>
                {editingId && <p className="text-xs text-stone-500 font-mono mt-0.5">{formData.slug}</p>}
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-100 text-lg w-8 h-8 flex items-center justify-center rounded hover:bg-stone-800 transition-colors">
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-800 flex-shrink-0 overflow-x-auto">
              {TABS.map((tab) => (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.id ? 'border-amber-500 text-amber-400' : 'border-transparent text-stone-500 hover:text-stone-300'
                  }`}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                {/* ── TAB 1: BASIC INFO ── */}
                {activeTab === 'basic' && (
                  <>
                    <div>
                      <label className={labelClass}>Product Name *</label>
                      <input required type="text" value={formData.name}
                        onChange={(e) => setFormData((f) => ({
                          ...f,
                          name: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                        }))}
                        className={inputClass} placeholder="e.g. Royal Cambodian Oud Extrait" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>URL Slug *</label>
                        <input required type="text" value={formData.slug} onChange={(e) => set('slug', e.target.value)}
                          className={`${inputClass} font-mono`} placeholder="royal-cambodian-oud" />
                      </div>
                      <div>
                        <label className={labelClass}>SKU *</label>
                        <input required type="text" value={formData.sku} onChange={(e) => set('sku', e.target.value)}
                          className={`${inputClass} font-mono`} placeholder="OUD-ROY-100ML" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Price (AED) *</label>
                        <input required type="number" min="1" value={formData.price}
                          onChange={(e) => set('price', Number(e.target.value))} className={`${inputClass} font-mono`} />
                      </div>
                      <div>
                        <label className={labelClass}>Compare-At Price (AED)</label>
                        <input type="number" min="0" value={formData.compareAtPrice}
                          onChange={(e) => set('compareAtPrice', e.target.value)}
                          className={`${inputClass} font-mono`} placeholder="Strike-through price (optional)" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Category *</label>
                        <select value={formData.categoryName} onChange={(e) => set('categoryName', e.target.value)} className={inputClass}>
                          <option value="Royal Oud & Extraits">Royal Oud &amp; Extraits</option>
                          <option value="Pure Concentrated Attars">Pure Concentrated Attars</option>
                          <option value="Incense & Sacred Bakhoor">Incense &amp; Sacred Bakhoor</option>
                          <option value="Luxury Perfumes">Luxury Perfumes</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Status *</label>
                        <select value={formData.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
                          <option value="ACTIVE">Active (visible on store)</option>
                          <option value="DRAFT">Draft (hidden)</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* ── TAB 2: DESCRIPTION ── */}
                {activeTab === 'content' && (
                  <>
                    <div>
                      <label className={labelClass}>About This Fragrance (Storytelling)</label>
                      <p className="text-[10px] text-stone-500 mb-2">
                        Shown in the <span className="text-amber-400 font-semibold">"About This Fragrance"</span> accordion on the product page.
                      </p>
                      <textarea rows={8} value={formData.description} onChange={(e) => set('description', e.target.value)}
                        className={inputClass}
                        placeholder="Write a rich, evocative description — origin story, olfactory journey, craftsmanship..." />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Concentration / Type</label>
                        <select value={formData.type} onChange={(e) => set('type', e.target.value)} className={inputClass}>
                          <option>Extrait de Parfum</option>
                          <option>Eau de Parfum</option>
                          <option>Pure Oil (Attar)</option>
                          <option>Concentrated Oil</option>
                          <option>Bakhoor / Incense</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Volume / Quantity</label>
                        <input type="text" value={formData.quantity} onChange={(e) => set('quantity', e.target.value)}
                          className={`${inputClass} font-mono`} placeholder="100ml" />
                      </div>
                    </div>
                  </>
                )}

                {/* ── TAB 3: IMAGES ── */}
                {activeTab === 'images' && (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>Product Images</label>
                      <p className="text-[10px] text-stone-500 mb-3">
                        First image = primary (shown first in carousel/gallery). Use arrows to reorder.
                      </p>
                      <div className="flex gap-2">
                        <input type="text" value={formData.imageInput} onChange={(e) => set('imageInput', e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                          className={`${inputClass} flex-1`} placeholder="Paste image URL (Shopify CDN, Cloudinary, etc.)" />
                        <button type="button" onClick={addImage}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded transition-all flex-shrink-0">
                          + Add
                        </button>
                      </div>
                    </div>

                    {formData.images.length === 0 ? (
                      <div className="border-2 border-dashed border-stone-700 rounded-lg py-12 text-center text-stone-500 text-xs">
                        <p className="text-2xl mb-2">🖼️</p>
                        <p>No images yet. Paste image URLs above and click Add.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.images.map((url, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-stone-950 border border-stone-800 rounded-lg p-2.5">
                            <img src={url} alt={`Image ${idx + 1}`}
                              className="w-12 h-16 object-cover rounded flex-shrink-0 bg-stone-800 border border-stone-700"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x64/1c1917/6b7280?text=ERR'; }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-mono text-stone-400 truncate mb-1">{url}</p>
                              {idx === 0 && (
                                <span className="text-[9px] bg-amber-600/20 text-amber-400 border border-amber-600/30 px-1.5 py-0.5 rounded-full font-bold">
                                  PRIMARY
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <button type="button" onClick={() => moveImage(idx, -1)} disabled={idx === 0}
                                className="text-stone-500 hover:text-amber-400 disabled:opacity-20 text-xs leading-none px-1">▲</button>
                              <button type="button" onClick={() => moveImage(idx, 1)} disabled={idx === formData.images.length - 1}
                                className="text-stone-500 hover:text-amber-400 disabled:opacity-20 text-xs leading-none px-1">▼</button>
                            </div>
                            <button type="button" onClick={() => removeImage(idx)}
                              className="text-red-500 hover:text-red-400 text-xs px-2 font-bold">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── TAB 4: FRAGRANCE NOTES ── */}
                {activeTab === 'fragrance' && (
                  <>
                    <p className="text-[10px] text-stone-500 bg-stone-950 border border-stone-800 rounded px-3 py-2 leading-relaxed">
                      These populate the <strong className="text-amber-400">Fragrance Notes</strong> section on the product page
                      (Top / Heart / Base notes row + Vol + Longevity).
                    </p>

                    <div>
                      <label className={labelClass}>Top Notes (Opening)</label>
                      <input type="text" value={formData.topNotes} onChange={(e) => set('topNotes', e.target.value)}
                        className={inputClass} placeholder="Jasmine, Taif Rose, Ruh al Ward" />
                      <p className="text-[10px] text-stone-600 mt-1">Comma-separated notes.</p>
                    </div>

                    <div>
                      <label className={labelClass}>Heart Notes (Middle / Body)</label>
                      <input type="text" value={formData.middleNotes} onChange={(e) => set('middleNotes', e.target.value)}
                        className={inputClass} placeholder="Jasmine Oud, Rose, Lavender" />
                      <p className="text-[10px] text-stone-600 mt-1">Comma-separated notes.</p>
                    </div>

                    <div>
                      <label className={labelClass}>Base Notes (Dry-down)</label>
                      <input type="text" value={formData.baseNotes} onChange={(e) => set('baseNotes', e.target.value)}
                        className={inputClass} placeholder="Amber, White Musk, Bulgarian Rose" />
                      <p className="text-[10px] text-stone-600 mt-1">Comma-separated notes.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-800">
                      <div>
                        <label className={labelClass}>Volume (Vol)</label>
                        <input type="text" value={formData.quantity} onChange={(e) => set('quantity', e.target.value)}
                          className={`${inputClass} font-mono`} placeholder="100ml" />
                      </div>
                      <div>
                        <label className={labelClass}>Longevity</label>
                        <input type="text" value={formData.longevity} onChange={(e) => set('longevity', e.target.value)}
                          className={`${inputClass} font-mono`} placeholder="8-12 Hours" />
                      </div>
                    </div>

                    {/* Live Preview — mirrors PDP exactly */}
                    <div className="bg-stone-950 border border-amber-500/20 rounded-lg p-4">
                      <p className="text-[9px] uppercase tracking-widest text-amber-400 font-bold mb-3">
                        Live Preview (as shown on product page)
                      </p>
                      <div className="space-y-2.5">
                        {[
                          { label: 'Top', value: formData.topNotes },
                          { label: 'Heart', value: formData.middleNotes },
                          { label: 'Base', value: formData.baseNotes },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-start gap-3 text-xs">
                            <span className="w-10 text-[10px] font-mono uppercase tracking-widest text-amber-400/80">{label}</span>
                            <span className="text-stone-400">{value || <em className="text-stone-600">not set</em>}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-3 text-xs pt-2 border-t border-stone-800 mt-1">
                          <span className="w-10 text-[10px] font-mono text-stone-600">Vol</span>
                          <span className="text-stone-500 font-mono">{formData.quantity || '—'}</span>
                          <span className="text-stone-700 mx-1">·</span>
                          <span className="text-[10px] font-mono text-stone-600">Longevity</span>
                          <span className="text-stone-500 font-mono">{formData.longevity || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── TAB 5: VARIANTS ── */}
                {activeTab === 'variants' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className={labelClass}>Size Variants</label>
                        <p className="text-[10px] text-stone-500">Each variant has its own size label, price and SKU. Shown as selectable chips on the product page.</p>
                      </div>
                      <button type="button" onClick={addVariant}
                        className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/30 rounded text-xs font-bold transition-all">
                        + Add Variant
                      </button>
                    </div>

                    {formData.variants.map((variant, idx) => (
                      <div key={idx} className="bg-stone-950 border border-stone-800 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-stone-400 font-semibold">Variant {idx + 1}</span>
                          {formData.variants.length > 1 && (
                            <button type="button" onClick={() => removeVariant(idx)}
                              className="text-red-500 hover:text-red-400 text-[10px] font-semibold">
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className={labelClass}>Size / Label</label>
                            <input type="text" value={variant.size} onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                              className={`${inputClass} font-mono`} placeholder="100ml" />
                          </div>
                          <div>
                            <label className={labelClass}>Price (AED)</label>
                            <input type="number" min="1" value={variant.price}
                              onChange={(e) => updateVariant(idx, 'price', Number(e.target.value))}
                              className={`${inputClass} font-mono`} />
                          </div>
                          <div>
                            <label className={labelClass}>SKU</label>
                            <input type="text" value={variant.sku} onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                              className={`${inputClass} font-mono`} placeholder="OUD-ROY-100" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-stone-800 flex-shrink-0 bg-stone-900 rounded-b-xl">
                <span className="text-[10px] text-stone-600 font-mono">
                  {TABS.findIndex((t) => t.id === activeTab) + 1}/{TABS.length} — {TABS.find((t) => t.id === activeTab)?.label}
                </span>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded text-xs">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold rounded text-xs uppercase tracking-wider transition-all">
                    {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
