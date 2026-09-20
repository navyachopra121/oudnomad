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
  Preview,
} from '@react-email/components';

export interface PasswordResetEmailProps {
  rawToken: string;
  expiresInMin?: number;
  resetUrl?: string;
}

export function PasswordResetEmail({
  rawToken,
  expiresInMin = 30,
  resetUrl,
}: PasswordResetEmailProps) {
  const appUrl = process.env.APP_URL ?? 'https://oudnomad.com';
  const link = resetUrl ?? `${appUrl}/auth/reset-password?token=${rawToken}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{`Reset your Oudnomad password — link expires in ${expiresInMin} minutes`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Oudnomad</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Reset Your Password
            </Heading>
            <Text style={para}>
              We received a request to reset the password for your Oudnomad
              account. Click the button below to choose a new password.
            </Text>

            <Section style={btnContainer}>
              <Button style={btn} href={link}>
                Reset Password
              </Button>
            </Section>

            <Text style={para}>
              This link expires in{' '}
              <strong>{expiresInMin} minutes</strong>. If you didn't request a
              password reset, you can safely ignore this email.
            </Text>

            <Text style={tokenNote}>
              Or paste this URL into your browser:
              <br />
              <span style={{ color: '#6b7280', wordBreak: 'break-all' }}>
                {link}
              </span>
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

const tokenNote: React.CSSProperties = {
  fontSize: '13px',
  color: '#9ca3af',
  marginTop: '8px',
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
