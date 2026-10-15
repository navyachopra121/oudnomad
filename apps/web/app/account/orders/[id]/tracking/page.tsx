'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface TrackingEvent {
  timestamp: string;
  location?: string;
  description: string;
  typeCode: string;
}

interface TrackingData {
  awbCode?: string;
  trackingUrl?: string;
  status: string;
  description: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
  message?: string;
}

const DHL_STATUS_ICONS: Record<string, string> = {
  PU: '📦',  // Picked up
  DF: '✈️',  // Departed facility
  AF: '🏭',  // Arrived at facility
  OD: '🚚',  // Out for delivery
  OK: '✅',  // Delivered
  DL: '✅',  // Delivered (alternate)
  PL: '🏷️',  // Processed label
};

function TimelineIcon({ typeCode, isLatest }: { typeCode: string; isLatest: boolean }) {
  const emoji = DHL_STATUS_ICONS[typeCode] ?? '📍';
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: isLatest ? '#b8860b' : '#1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        flexShrink: 0,
        boxShadow: isLatest ? '0 0 0 4px rgba(184,134,11,0.25)' : 'none',
      }}
    >
      {emoji}
    </div>
  );
}

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
    fetch(`${apiBase}/shipping/track/${orderId}`, {
      credentials: 'include',
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<TrackingData>;
      })
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 50%, #0d0d1a 100%)',
        padding: '40px 20px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 8,
              letterSpacing: '-0.5px',
            }}
          >
            📦 Order Tracking
          </h1>
          <p style={{ color: '#888', fontSize: 14 }}>
            Real-time shipment updates via DHL Express
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', color: '#888', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12, animation: 'spin 1s linear infinite' }}>
              ⏳
            </div>
            <p>Loading tracking information…</p>
          </div>
        )}

        {error && (
          <div
            style={{
              background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: 12,
              padding: 20,
              color: '#fca5a5',
              textAlign: 'center',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {data && !loading && (
          <>
            {/* Status Card */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: 28,
                marginBottom: 24,
              }}
            >
              {data.awbCode ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <p style={{ color: '#888', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Tracking Number (AWB)
                      </p>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: 22, fontFamily: 'monospace' }}>
                        {data.awbCode}
                      </p>
                    </div>
                    <div
                      style={{
                        background: data.status === 'delivered' ? 'rgba(34,197,94,0.15)' : 'rgba(184,134,11,0.15)',
                        border: `1px solid ${data.status === 'delivered' ? 'rgba(34,197,94,0.4)' : 'rgba(184,134,11,0.4)'}`,
                        borderRadius: 20,
                        padding: '6px 16px',
                        color: data.status === 'delivered' ? '#86efac' : '#d4a843',
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        flexShrink: 0,
                      }}
                    >
                      {data.status}
                    </div>
                  </div>

                  {data.estimatedDelivery && (
                    <div
                      style={{
                        marginTop: 16,
                        padding: '12px 16px',
                        background: 'rgba(184,134,11,0.08)',
                        borderRadius: 10,
                        border: '1px solid rgba(184,134,11,0.2)',
                      }}
                    >
                      <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Estimated Delivery
                      </p>
                      <p style={{ color: '#d4a843', fontWeight: 600, fontSize: 16 }}>
                        {new Date(data.estimatedDelivery).toLocaleDateString('en-AE', {
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}

                  {data.trackingUrl && (
                    <a
                      href={data.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: 16,
                        padding: '10px 20px',
                        background: '#b8860b',
                        color: '#fff',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'opacity 0.2s',
                      }}
                    >
                      Track on DHL.com →
                    </a>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <p style={{ fontSize: 40, marginBottom: 12 }}>🏭</p>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
                    Order Being Prepared
                  </p>
                  <p style={{ color: '#888', fontSize: 14 }}>
                    {data.message ?? 'Your order is being packed and will ship soon.'}
                  </p>
                </div>
              )}
            </div>

            {/* Timeline */}
            {data.events.length > 0 && (
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: 28,
                }}
              >
                <h2
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 24,
                  }}
                >
                  Shipment Timeline
                </h2>

                <div style={{ position: 'relative' }}>
                  {/* Vertical line */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 19,
                      top: 20,
                      bottom: 20,
                      width: 2,
                      background: 'linear-gradient(to bottom, #b8860b, rgba(184,134,11,0.1))',
                    }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {data.events.map((event, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <TimelineIcon typeCode={event.typeCode} isLatest={idx === 0} />
                        <div style={{ paddingTop: 8, flex: 1 }}>
                          <p style={{ color: '#fff', fontWeight: 500, marginBottom: 4, fontSize: 14 }}>
                            {event.description}
                          </p>
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {event.location && (
                              <span style={{ color: '#b8860b', fontSize: 12 }}>
                                📍 {event.location}
                              </span>
                            )}
                            <span style={{ color: '#666', fontSize: 12 }}>
                              {new Date(event.timestamp).toLocaleString('en-AE')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a
            href={`/account/orders/${orderId}`}
            style={{ color: '#666', fontSize: 13, textDecoration: 'none' }}
          >
            ← Back to Order Details
          </a>
        </div>
      </div>
    </div>
  );
}
