import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Preview,
} from '@react-email/components';

export interface ShippingUpdateEmailProps {
  customerName: string;
  orderId: string;
  orderNumber?: string | null;
  note?: string;
}

export function ShippingUpdateEmail({
  customerName,
  orderId,
  orderNumber,
  note,
}: ShippingUpdateEmailProps) {
  const displayRef = orderNumber ?? orderId.slice(0, 8).toUpperCase();

  return (
    <Html lang="en">
      <Head />
      <Preview>Your Oudnomad order #{displayRef} has shipped! 📦</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Oudnomad</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Your order is on its way! 📦
            </Heading>
            <Text style={para}>Hi {customerName || 'there'},</Text>
            <Text style={para}>
              Great news! Your order <strong>#{displayRef}</strong> has been
              handed off to our courier and is on its way to you.
            </Text>

            {note && (
              <Section style={noteBox}>
                <Text style={noteText}>{note}</Text>
              </Section>
            )}

            <Text style={para}>
              You'll receive your package soon. If you have any questions about
              your delivery, don't hesitate to contact us.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>© 2025 Oudnomad. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── styles ──────────────────────────────────────────────────────────────────
const body: React.CSSProperties = {
  backgroundColor: '#f4f4f5',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  overflow: 'hidden',
};

const header: React.CSSProperties = {
  backgroundColor: '#1a1a2e',
  padding: '24px 32px',
};

const logo: React.CSSProperties = {
  color: '#e2a623',
  fontSize: '28px',
  fontWeight: 800,
  margin: 0,
};

const content: React.CSSProperties = { padding: '32px' };

const h2: React.CSSProperties = {
  fontSize: '22px',
  color: '#1a1a2e',
  marginBottom: '16px',
};

const para: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0 0 16px 0',
};

const noteBox: React.CSSProperties = {
  backgroundColor: '#ecfdf5',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
  border: '1px solid #d1fae5',
};

const noteText: React.CSSProperties = {
  fontSize: '14px',
  color: '#065f46',
  margin: 0,
};

const footer: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  padding: '20px 32px',
  borderTop: '1px solid #e5e7eb',
};

const footerText: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: 0,
  textAlign: 'center',
};
