'use client';

import React, { useEffect, useState, use } from 'react';
import { AdminApi } from '../../admin-api';
import Link from 'next/link';

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED', 'PAYMENT_FAILED', 'EXPIRED'],
  CONFIRMED: ['PLACED', 'CANCELLED', 'REFUNDED'],
  PLACED: ['SHIPPED', 'CANCELLED', 'REFUNDED'],
  SHIPPED: ['DELIVERED', 'REFUNDED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: [],
  PAYMENT_FAILED: [],
  EXPIRED: [],
  REFUNDED: [],
};

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('');
  const [refundStatusMsg, setRefundStatusMsg] = useState<string | null>(null);

  const fetchOrder = () => {
    setLoading(true);
    AdminApi.getOrderById(id)
      .then((res) => {
        setOrder(res);
        setRefundAmount(Number(res.total));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusTransition = async (targetStatus: string) => {
    if (targetStatus === 'REFUNDED') {
      setShowRefundModal(true);
      return;
    }

    if (!confirm(`Transition order status to ${targetStatus}?`)) return;

    setUpdating(true);
    try {
      if (targetStatus === 'PLACED' && order.status === 'CONFIRMED') {
        await AdminApi.releaseOrder(id, 'Admin released order for fulfillment');
      } else {
        await AdminApi.updateOrderStatus(id, targetStatus, `Admin transitioned status to ${targetStatus}`);
      }
      fetchOrder();
    } catch (err: any) {
      alert(`Transition failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setRefundStatusMsg(null);
    try {
      await AdminApi.createRefund(id, refundAmount, refundReason);
      setRefundStatusMsg('Refund initiated with Razorpay gateway. Confirmation will arrive via webhook.');
      setTimeout(() => {
        setShowRefundModal(false);
        fetchOrder();
      }, 2000);
    } catch (err: any) {
      alert(`Refund error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300">
        <h3 className="font-bold text-lg mb-1">Order Not Found</h3>
        <p className="text-sm text-red-400">{error || 'Order detail could not be retrieved.'}</p>
        <Link href="/admin/orders" className="inline-block mt-4 text-xs font-semibold text-amber-400 hover:underline">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const validNextStates = ALLOWED_TRANSITIONS[order.status] || [];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <Link href="/admin/orders" className="text-xs text-amber-400 font-medium hover:underline mb-2 inline-block">
            ← Back to Orders List
          </Link>
          <h1 className="text-2xl font-bold text-stone-100">
            Order {order.orderNumber || `#${order.id}`}
          </h1>
          <div className="text-xs text-stone-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Status:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {order.status}
          </span>
        </div>
      </div>

      {/* Allowed Transitions Action Bar */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
          State Machine Controls — Legal Next Actions
        </h2>
        {validNextStates.length === 0 ? (
          <div className="text-sm text-stone-500">
            Order status <span className="font-semibold text-stone-300">{order.status}</span> is terminal. No further state transitions allowed.
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {validNextStates.map((nextStatus) => (
              <button
                key={nextStatus}
                disabled={updating}
                onClick={() => handleStatusTransition(nextStatus)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 border ${
                  nextStatus === 'REFUNDED'
                    ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-800'
                    : nextStatus === 'CANCELLED'
                    ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
                    : 'bg-amber-600 hover:bg-amber-500 text-stone-950 border-amber-500 shadow-md'
                }`}
              >
                Transition to {nextStatus}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-md">
            <div className="p-4 bg-stone-950 border-b border-stone-800 text-xs font-bold text-stone-400 uppercase tracking-wider">
              Order Line Items
            </div>
            <div className="divide-y divide-stone-800">
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-200 text-sm">{item.productName}</div>
                    <div className="text-xs text-stone-400">
                      {item.size ? `Size: ${item.size} ` : ''}
                      {item.color ? `Color: ${item.color} ` : ''}
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-stone-100 text-sm">
                    ₹{Number(item.lineTotal).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-stone-950/60 border-t border-stone-800 flex justify-between items-center text-sm font-bold text-stone-100">
              <span>Total Amount</span>
              <span className="text-amber-400 text-lg">₹{Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Status Timeline History */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
              Status Event History
            </h3>
            <div className="space-y-4">
              {order.statusHistory?.map((event: any) => (
                <div key={event.id} className="flex gap-4 text-xs border-l-2 border-amber-500 pl-4 py-1">
                  <div>
                    <div className="font-bold text-stone-200">{event.status}</div>
                    <div className="text-stone-400">{event.note}</div>
                    <div className="text-stone-500 text-[10px] mt-0.5">
                      {new Date(event.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
              Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-xs text-stone-300 space-y-1">
                <div className="font-semibold text-stone-100">{order.shippingAddress.recipientName}</div>
                <div>{order.shippingAddress.line1}</div>
                {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </div>
                <div>{order.shippingAddress.countryCode}</div>
              </div>
            ) : (
              <div className="text-xs text-stone-500">No shipping address recorded</div>
            )}
          </div>

          {/* Payment Attempts */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
              Payment Attempts ({order.paymentAttempts?.length || 0})
            </h3>
            <div className="space-y-3">
              {order.paymentAttempts?.map((attempt: any) => (
                <div key={attempt.id} className="p-3 bg-stone-950 rounded-lg text-xs border border-stone-800">
                  <div className="flex justify-between font-medium">
                    <span className="text-amber-400 font-mono">{attempt.gatewayOrderId}</span>
                    <span className="font-bold text-stone-200">{attempt.status}</span>
                  </div>
                  <div className="text-stone-500 text-[10px] mt-1">
                    {new Date(attempt.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-stone-100">Initiate Gateway Refund</h3>
            <p className="text-xs text-stone-400">
              Triggers a refund request against the captured Razorpay payment attempt. Order status transitions to REFUNDED upon webhook confirmation.
            </p>

            <form onSubmit={handleRefundSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Refund Amount (INR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Reason for Refund
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Customer return, out of stock"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500 h-20"
                />
              </div>

              {refundStatusMsg && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs rounded-lg">
                  {refundStatusMsg}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-stone-950 font-bold rounded-lg text-xs transition-all shadow-md"
                >
                  Confirm & Process Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
