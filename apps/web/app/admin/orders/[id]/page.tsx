'use client';

import React, { useEffect, useState, use } from 'react';
import { useParams } from 'next/navigation';
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

export default function AdminOrderDetailPage({ params }: { params?: Promise<{ id: string }> | { id: string } }) {
  const routeParams = useParams();
  let paramId = '';
  if (params) {
    if (typeof (params as any).then === 'function') {
      try {
        paramId = (use(params as Promise<{ id: string }>) as any)?.id || '';
      } catch (_) {}
    } else if (typeof (params as any)?.id === 'string') {
      paramId = (params as any).id;
    }
  }
  const id = (typeof routeParams?.id === 'string' ? routeParams.id : paramId) || '';
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('');
  const [refundStatusMsg, setRefundStatusMsg] = useState<string | null>(null);

  // Carrier tracking state
  const [awbCode, setAwbCode] = useState('');
  const [carrierShipmentId, setCarrierShipmentId] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [savingTracking, setSavingTracking] = useState(false);
  const [trackingMsg, setTrackingMsg] = useState<string | null>(null);

  const fetchOrder = () => {
    setLoading(true);
    AdminApi.getOrderById(id)
      .then((res) => {
        setOrder(res);
        setRefundAmount(Number(res.total));
        setAwbCode(res.awbCode || '');
        setCarrierShipmentId(res.carrierShipmentId || '');
        setTrackingUrl(res.trackingUrl || '');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTracking(true);
    setTrackingMsg(null);
    try {
      await AdminApi.updateOrderTracking(id, {
        awbCode,
        carrierShipmentId,
        trackingUrl,
      });
      setTrackingMsg('DHL tracking details saved and dispatched timestamp updated.');
      fetchOrder();
      setTimeout(() => setTrackingMsg(null), 3000);
    } catch (err: any) {
      alert(`Failed to save tracking: ${err.message}`);
    } finally {
      setSavingTracking(false);
    }
  };

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
                    AED {Number(item.lineTotal).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-stone-950/60 border-t border-stone-800 flex justify-between items-center text-sm font-bold text-stone-100">
              <span>Total Amount</span>
              <span className="text-amber-400 text-lg">AED {Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Status Timeline History */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
              Status Event History
            </h3>
            {(!order.statusHistory || order.statusHistory.length === 0) ? (
              <div className="text-xs text-stone-500 py-2">No status history recorded.</div>
            ) : (
              <div className="space-y-4">
                {order.statusHistory.map((event: any) => (
                  <div key={event.id} className="flex gap-4 text-xs border-l-2 border-amber-500 pl-4 py-1">
                    <div>
                      <div className="font-bold text-stone-200">{event.status}</div>
                      {event.note && <div className="text-stone-400">{event.note}</div>}
                      <div className="text-stone-500 text-[10px] mt-0.5">
                        {new Date(event.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
              Customer Information
            </h3>
            {order.user ? (
              <div className="text-xs text-stone-300 space-y-1.5">
                <div className="font-semibold text-stone-100 text-sm">
                  {order.user.firstName || order.user.lastName
                    ? `${order.user.firstName ?? ''} ${order.user.lastName ?? ''}`.trim()
                    : 'Unknown Customer'}
                </div>
                <div className="text-stone-400 font-mono">{order.user.email}</div>
                {order.user.phone && (
                  <div className="text-stone-400">{order.user.phone}</div>
                )}
                <div className="pt-1">
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    order.user.isBlocked
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {order.user.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-stone-500">Customer details unavailable</div>
            )}
          </div>

          {/* DHL / Carrier Fulfillment Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>🚚</span> DHL Carrier Fulfillment
            </h3>
            <p className="text-[11px] text-stone-400 mb-4">
              Assign AWB code or update tracking URL to provide customer with real-time DHL tracking.
            </p>

            {trackingMsg && (
              <div className="p-2.5 mb-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs">
                {trackingMsg}
              </div>
            )}

            <form onSubmit={handleSaveTracking} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                  DHL Waybill / AWB Code
                </label>
                <input
                  type="text"
                  value={awbCode}
                  onChange={(e) => setAwbCode(e.target.value)}
                  placeholder="e.g. 1234567890"
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-1.5 text-xs text-stone-200 font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                  Carrier Shipment ID
                </label>
                <input
                  type="text"
                  value={carrierShipmentId}
                  onChange={(e) => setCarrierShipmentId(e.target.value)}
                  placeholder="Optional internal shipment ID"
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-1.5 text-xs text-stone-200 font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                  Tracking URL
                </label>
                <input
                  type="text"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://www.dhl.com/..."
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-1.5 text-xs text-stone-200 focus:border-amber-500 outline-none"
                />
              </div>

              {order.trackingUrl && (
                <div className="pt-1">
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>🔗</span> Open Live Tracking Page ↗
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={savingTracking}
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2 rounded text-xs transition-all shadow disabled:opacity-50 mt-2"
              >
                {savingTracking ? 'Saving...' : 'Save Tracking Information'}
              </button>
            </form>
          </div>

          {/* Shipping Address */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
              Shipping Address
            </h3>
            {(order.shippingAddress || order.snapLine1) ? (
              <div className="text-xs text-stone-300 space-y-1">
                <div className="font-semibold text-stone-100">
                  {order.shippingAddress?.recipientName || order.snapRecipientName}
                </div>
                <div>{order.shippingAddress?.line1 || order.snapLine1}</div>
                {(order.shippingAddress?.line2 || order.snapLine2) && (
                  <div>{order.shippingAddress?.line2 || order.snapLine2}</div>
                )}
                <div>
                  {order.shippingAddress?.city || order.snapCity},{' '}
                  {order.shippingAddress?.postalCode || order.snapPostalCode}
                </div>
                <div>{order.shippingAddress?.countryCode || order.snapCountryCode}</div>
                {(order.shippingAddress?.phone || order.snapPhone) && (
                  <div className="text-stone-400">{order.shippingAddress?.phone || order.snapPhone}</div>
                )}
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
            {!order.paymentAttempts || order.paymentAttempts.length === 0 ? (
              <div className="text-xs text-stone-500 py-2">No payment attempts recorded.</div>
            ) : (
              <div className="space-y-3">
                {order.paymentAttempts.map((attempt: any) => (
                  <div key={attempt.id} className="p-3 bg-stone-950 rounded-lg text-xs border border-stone-800">
                    <div className="flex justify-between font-medium">
                      <span className="text-amber-400 font-mono">{attempt.gatewayOrderId}</span>
                      <span className={`font-bold ${attempt.status === 'SUCCEEDED' ? 'text-emerald-400' : attempt.status === 'FAILED' ? 'text-red-400' : 'text-stone-300'}`}>
                        {attempt.status}
                      </span>
                    </div>
                    {attempt.amount && (
                      <div className="text-stone-300 mt-0.5">AED {Number(attempt.amount).toFixed(2)}</div>
                    )}
                    {attempt.failureReason && (
                      <div className="text-red-400 mt-0.5 text-[10px]">{attempt.failureReason}</div>
                    )}
                    <div className="text-stone-500 text-[10px] mt-1">
                      {new Date(attempt.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Refunds */}
          {order.refunds && order.refunds.length > 0 && (
            <div className="bg-stone-900 border border-rose-900/40 rounded-xl p-6 shadow-md">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">
                Refunds ({order.refunds.length})
              </h3>
              <div className="space-y-3">
                {order.refunds.map((refund: any) => (
                  <div key={refund.id} className="p-3 bg-stone-950 rounded-lg text-xs border border-rose-900/30">
                    <div className="flex justify-between font-medium">
                      <span className="text-rose-300 font-bold">AED {Number(refund.amount).toFixed(2)}</span>
                      <span className={`font-bold text-[10px] uppercase ${refund.status === 'PROCESSED' ? 'text-emerald-400' : refund.status === 'FAILED' ? 'text-red-400' : 'text-amber-400'}`}>
                        {refund.status}
                      </span>
                    </div>
                    {refund.reason && (
                      <div className="text-stone-400 mt-0.5">{refund.reason}</div>
                    )}
                    <div className="text-stone-500 text-[10px] mt-1">
                      {new Date(refund.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                  Refund Amount (AED)
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
