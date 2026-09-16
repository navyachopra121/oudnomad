import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Row,
  Column,
  Preview,
} from '@react-email/components';

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: string | number;
  lineTotal: string | number;
}

export interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
  orderNumber?: string | null;
  total: string | number;
  items: OrderItem[];
}

const formatCurrency = (amount: string | number) =>
  `$${Number(amount).toFixed(2)}`;

export function OrderConfirmationEmail({
  customerName,
  orderId,
  orderNumber,
  total,
  items,
}: OrderConfirmationEmailProps) {
  const displayRef = orderNumber ?? orderId.slice(0, 8).toUpperCase();

  return (
    <Html lang="en">
      <Head />
      <Preview>Your Oudnomad order #{displayRef} is confirmed! 🎉</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>Oudnomad</Heading>
          </Section>

          {/* Body */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              Order Confirmed! 🎉
            </Heading>
            <Text style={para}>Hi {customerName || 'there'},</Text>
            <Text style={para}>
              Thank you for your order. We've received your payment and are now
              preparing your items.
            </Text>

            <Section style={orderBox}>
              <Text style={orderRef}>Order #{displayRef}</Text>

              {/* Items */}
              {items.map((item, i) => (
                <Row key={i} style={itemRow}>
                  <Column style={itemName}>
                    {item.productName} × {item.quantity}
                  </Column>
                  <Column style={itemPrice}>
                    {formatCurrency(item.lineTotal)}
                  </Column>
                </Row>
              ))}

              <Hr style={divider} />

              <Row style={itemRow}>
                <Column style={{ ...itemName, fontWeight: 700 }}>Total</Column>
                <Column style={{ ...itemPrice, fontWeight: 700 }}>
                  {formatCurrency(total)}
                </Column>
              </Row>
            </Section>

            <Text style={para}>
              We'll send you a shipping notification once your order is on its
              way. If you have any questions, reply to this email.
            </Text>
          </Section>

          {/* Footer */}
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
  letterSpacing: '-0.5px',
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

const orderBox: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '1px solid #e5e7eb',
};

const orderRef: React.CSSProperties = {
  fontSize: '13px',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  margin: '0 0 12px 0',
};

const itemRow: React.CSSProperties = { marginBottom: '8px' };

const itemName: React.CSSProperties = {
  fontSize: '14px',
  color: '#111827',
  width: '75%',
};

const itemPrice: React.CSSProperties = {
  fontSize: '14px',
  color: '#111827',
  textAlign: 'right',
  width: '25%',
};

const divider: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '12px 0',
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
