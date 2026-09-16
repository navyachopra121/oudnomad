'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '../admin-api';
import { DataTable, Column } from '../components/DataTable';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = (p = page) => {
    setLoading(true);
    AdminApi.getUsers({ page: p, limit: 10, search, role: roleFilter || undefined })
      .then((res) => {
        setUsers(res.items || []);
        setTotal(res.total || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page, roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1);
  };

  const handleToggleBlock = async (user: any) => {
    const action = user.isBlocked ? 'unblock' : 'block';
    if (!confirm(`Are you sure you want to ${action} user ${user.email}?`)) return;

    try {
      await AdminApi.toggleBlockUser(user.id, !user.isBlocked);
      fetchUsers(page);
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    }
  };

  const handleChangeRole = async (user: any, newRole: string) => {
    if (newRole === user.role) return;
    if (!confirm(`Change role of user ${user.email} from ${user.role} to ${newRole}?`)) return;

    try {
      await AdminApi.changeUserRole(user.id, newRole);
      fetchUsers(page);
    } catch (err: any) {
      alert(`Role change failed: ${err.message}`);
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'User',
      cell: (row) => (
        <div>
          <div className="font-semibold text-stone-100">
            {row.firstName || row.lastName ? `${row.firstName ?? ''} ${row.lastName ?? ''}` : 'No Name'}
          </div>
          <div className="text-xs text-stone-400 font-mono">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (row) => (
        <select
          value={row.role}
          onChange={(e) => handleChangeRole(row, e.target.value)}
          className="bg-stone-950 border border-stone-800 rounded px-2.5 py-1 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      ),
    },
    {
      header: 'Account Status',
      cell: (row) => (
        <span
          className={`inline-flex px-2.5 py-1 text-[11px] font-bold uppercase rounded-full border ${
            row.isBlocked
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          {row.isBlocked ? 'BLOCKED' : 'ACTIVE'}
        </span>
      ),
    },
    {
      header: 'Joined Date',
      cell: (row) => <span className="text-xs text-stone-400">{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => handleToggleBlock(row)}
          className={`px-3 py-1 text-xs font-bold rounded transition-all border ${
            row.isBlocked
              ? 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800'
              : 'bg-red-950/60 hover:bg-red-900/60 text-red-400 border-red-800'
          }`}
        >
          {row.isBlocked ? 'Unblock User' : 'Block User'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-100">User Account Administration</h1>
          <p className="text-sm text-stone-400">View accounts, assign admin roles, and toggle block status.</p>
        </div>
      </div>

      {/* Search & Role Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-3 flex-1">
          <input
            type="text"
            placeholder="Search users by email or name..."
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

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="bg-stone-900 border border-stone-800 rounded-lg px-4 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500 font-medium"
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={users}
        total={total}
        page={page}
        limit={10}
        onPageChange={setPage}
        isLoading={loading}
      />
    </div>
  );
}
