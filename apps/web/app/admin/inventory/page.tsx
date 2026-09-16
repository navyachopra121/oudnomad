'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '../admin-api';
import { DataTable, Column } from '../components/DataTable';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Adjustment Modal state
  const [selectedInv, setSelectedInv] = useState<any | null>(null);
  const [delta, setDelta] = useState<number>(0);
  const [reason, setReason] = useState<string>('restock');
  const [adjusting, setAdjusting] = useState(false);

  // History Drawer state
  const [historyInv, setHistoryInv] = useState<any | null>(null);
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchInventory = (p = page, lowStock = lowStockOnly) => {
    setLoading(true);
    AdminApi.getInventory({ page: p, limit: 10, lowStockOnly: lowStock })
      .then((res) => {
        setInventory(res.items || []);
        setTotal(res.total || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory(page, lowStockOnly);
  }, [page, lowStockOnly]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInv || delta === 0) return;
    setAdjusting(true);
    try {
      await AdminApi.adjustInventory(selectedInv.id, delta, reason);
      setSelectedInv(null);
      setDelta(0);
      fetchInventory(page);
    } catch (err: any) {
      alert(`Adjustment error: ${err.message}`);
    } finally {
      setAdjusting(false);
    }
  };

  const handleOpenHistory = (inv: any) => {
    setHistoryInv(inv);
    setLoadingHistory(true);
    AdminApi.getInventoryAdjustments(inv.id)
      .then((res) => setAdjustments(res.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoadingHistory(false));
  };

  const columns: Column<any>[] = [
    {
      header: 'Product / Variant',
      cell: (row) => (
        <div>
          <div className="font-semibold text-stone-100">{row.productName}</div>
          <div className="text-xs text-stone-400 font-mono">
            {row.variantName ? `${row.variantName} — ` : ''}SKU: {row.sku}
          </div>
        </div>
      ),
    },
    {
      header: 'Available Stock',
      cell: (row) => (
        <span
          className={`font-bold text-sm ${
            row.quantityAvailable <= row.lowStockThreshold ? 'text-red-400' : 'text-emerald-400'
          }`}
        >
          {row.quantityAvailable} units
        </span>
      ),
    },
    {
      header: 'Reserved Stock',
      cell: (row) => <span className="text-xs text-stone-400">{row.quantityReserved} units</span>,
    },
    {
      header: 'Low Stock Threshold',
      cell: (row) => <span className="text-xs text-stone-400">{row.lowStockThreshold} units</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedInv(row)}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded transition-all shadow"
          >
            Adjust Stock
          </button>
          <button
            onClick={() => handleOpenHistory(row)}
            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs rounded border border-stone-700 transition-all"
          >
            History
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">Inventory Stock Control</h1>
          <p className="text-sm text-stone-400">Track variant stock, adjust quantities with audit log, and view adjustments.</p>
        </div>

        <button
          onClick={() => {
            setLowStockOnly(!lowStockOnly);
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
            lowStockOnly
              ? 'bg-red-500/20 text-red-300 border-red-500/40'
              : 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800'
          }`}
        >
          {lowStockOnly ? '⚠️ Showing Low Stock Only' : 'Filter Low Stock Items'}
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={inventory}
        total={total}
        page={page}
        limit={10}
        onPageChange={setPage}
        isLoading={loading}
      />

      {/* Adjust Stock Modal */}
      {selectedInv && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-stone-100">Adjust Inventory Stock</h3>
            <p className="text-xs text-stone-400">
              Product: <span className="font-semibold text-stone-200">{selectedInv.productName}</span> (Current: {selectedInv.quantityAvailable})
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Quantity Delta (Positive = Add stock, Negative = Remove)
                </label>
                <input
                  type="number"
                  value={delta}
                  onChange={(e) => setDelta(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Reason for Adjustment
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="restock">Restock / New Shipment</option>
                  <option value="damaged">Damaged / Expired</option>
                  <option value="correction">Inventory Correction</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInv(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting || delta === 0}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-all shadow-md disabled:opacity-50"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Drawer Modal */}
      {historyInv && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-stone-100">Adjustment History</h3>
              <button
                onClick={() => setHistoryInv(null)}
                className="text-stone-400 hover:text-stone-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-stone-400">
              Audit log of all manual stock changes for {historyInv.productName} ({historyInv.sku})
            </p>

            {loadingHistory ? (
              <div className="text-center py-8 text-stone-500 text-sm">Loading history...</div>
            ) : adjustments.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-sm">No adjustments recorded for this inventory item.</div>
            ) : (
              <div className="max-h-80 overflow-y-auto divide-y divide-stone-800">
                {adjustments.map((adj: any) => (
                  <div key={adj.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-stone-200">{adj.reason}</div>
                      <div className="text-[10px] text-stone-500">
                        Adjusted by Admin ({adj.adjustedBy}) on {new Date(adj.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className={`font-bold ${adj.delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {adj.delta > 0 ? `+${adj.delta}` : adj.delta}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
