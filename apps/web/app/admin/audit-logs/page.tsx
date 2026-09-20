'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '../admin-api';
import { DataTable, Column } from '../components/DataTable';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [targetTypeFilter, setTargetTypeFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const fetchLogs = (p = page) => {
    setLoading(true);
    AdminApi.getAuditLogs({ page: p, limit: 10, targetType: targetTypeFilter || undefined })
      .then((res) => {
        setLogs(res.items || []);
        setTotal(res.total || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page, targetTypeFilter]);

  const columns: Column<any>[] = [
    {
      header: 'Timestamp',
      cell: (row) => (
        <span className="text-xs font-mono text-stone-400">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Action',
      cell: (row) => (
        <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-md bg-stone-800 text-amber-400 border border-stone-700">
          {row.actionType || row.action}
        </span>
      ),
    },
    {
      header: 'Target',
      cell: (row) => (
        <div className="text-xs">
          <span className="font-semibold text-stone-200">{row.targetType}</span>
          <span className="text-stone-500 font-mono ml-1.5">#{row.targetId.substring(0, 8)}</span>
        </div>
      ),
    },
    {
      header: 'Actor ID',
      cell: (row) => <span className="text-xs font-mono text-stone-400">{row.actorId}</span>,
    },
    {
      header: 'Metadata',
      cell: (row) => (
        <button
          onClick={() => setSelectedLog(row)}
          className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded border border-stone-700 transition-all"
        >
          View JSON
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">Audit Trail History</h1>
          <p className="text-sm text-stone-400">Immutable record of sensitive admin operations.</p>
        </div>
      </div>

      {/* Target Type Filter */}
      <div className="flex gap-2">
        {['', 'Order', 'User', 'Inventory'].map((type) => (
          <button
            key={type}
            onClick={() => {
              setTargetTypeFilter(type);
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all border ${
              targetTypeFilter === type
                ? 'bg-amber-500 text-stone-950 border-amber-500'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800'
            }`}
          >
            {type ? type.toUpperCase() : 'ALL TARGETS'}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={logs}
        total={total}
        page={page}
        limit={10}
        onPageChange={setPage}
        isLoading={loading}
      />

      {/* JSON Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-stone-100">Audit Event Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-stone-400 hover:text-stone-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div><span className="text-stone-400">Log ID:</span> <span className="font-mono text-stone-200">{selectedLog.id}</span></div>
              <div><span className="text-stone-400">Action:</span> <span className="font-bold text-amber-400">{selectedLog.actionType || selectedLog.action}</span></div>
              <div><span className="text-stone-400">Actor Admin ID:</span> <span className="font-mono text-stone-200">{selectedLog.actorId}</span></div>
              <div><span className="text-stone-400">Target:</span> <span className="font-semibold text-stone-200">{selectedLog.targetType} ({selectedLog.targetId})</span></div>
            </div>

            <div className="pt-2">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Metadata Payload</div>
              <pre className="bg-stone-950 border border-stone-800 p-4 rounded-xl text-xs font-mono text-amber-300/90 overflow-x-auto">
                {JSON.stringify(selectedLog.metadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
