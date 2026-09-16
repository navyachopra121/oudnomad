import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Row,
  Column,
  Preview,
} from '@react-email/components';

export interface CartItem {
  productName: string;
  quantity: number;
  unitPrice: string | number;
}

export interface AbandonedCartEmailProps {
  customerName?: string;
  cartId: string;
  items: CartItem[];
  checkoutUrl?: string;
}

const formatCurrency = (amount: string | number) =>
  `$${Number(amount).toFixed(2)}`;

export function AbandonedCartEmail({
  customerName,
  cartId,
  items,
  checkoutUrl,
}: AbandonedCartEmailProps) {
  const appUrl = process.env.APP_URL ?? 'https://oudnomad.com';
  const link = checkoutUrl ?? `${appUrl}/cart?cart=${cartId}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>You left something behind! Complete your Oudnomad order 🛒</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Oudnomad</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Your cart is waiting for you 🛒
            </Heading>
            <Text style={para}>
              Hi {customerName || 'there'},
            </Text>
            <Text style={para}>
              You left some items in your cart. Don't worry — we've saved them
              for you. Complete your purchase before they sell out!
            </Text>

            {/* Cart items */}
            <Section style={cartBox}>
              {items.slice(0, 5).map((item, i) => (
                <Row key={i} style={itemRow}>
                  <Column style={itemName}>
                    {item.productName} × {item.quantity}
                  </Column>
                  <Column style={itemPrice}>
                    {formatCurrency(Number(item.unitPrice) * item.quantity)}
                  </Column>
                </Row>
              ))}
              {items.length > 5 && (
                <Text style={moreItems}>
                  +{items.length - 5} more item(s)…
                </Text>
              )}
            </Section>

            <Section style={btnContainer}>
              <Button style={btn} href={link}>
                Complete My Order
              </Button>
            </Section>

            <Text style={para}>
              This offer won't last forever — items in your cart are subject to
              availability.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © 2025 Oudnomad. You're receiving this because you left items in
              your cart. If you'd prefer not to receive these emails, reply with
              "unsubscribe".
            </Text>
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

const cartBox: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
  border: '1px solid #e5e7eb',
};

const itemRow: React.CSSProperties = { marginBottom: '6px' };

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

const moreItems: React.CSSProperties = {
  fontSize: '13px',
  color: '#9ca3af',
  margin: '8px 0 0 0',
};

const btnContainer: React.CSSProperties = {
  textAlign: 'center',
  margin: '28px 0',
};

const btn: React.CSSProperties = {
  backgroundColor: '#e2a623',
  color: '#1a1a2e',
  fontSize: '15px',
  fontWeight: 700,
  padding: '14px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
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
