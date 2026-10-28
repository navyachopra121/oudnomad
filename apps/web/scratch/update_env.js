const fs = require('fs');
const path = require('path');

// 1. Update apps/api/.env
const apiEnvPath = '/var/www/oudnomad/apps/api/.env';
if (fs.existsSync(apiEnvPath)) {
  let content = fs.readFileSync(apiEnvPath, 'utf8');
  content = content.replace(/EMAIL_PROVIDER=.*/g, 'EMAIL_PROVIDER="smtp"');
  if (!content.includes('hello.oudnomaddubai@gmail.com')) {
    content += `\nSMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hello.oudnomaddubai@gmail.com
SMTP_PASS=${process.env.SMTP_PASS || ''}
SMTP_FROM=hello.oudnomaddubai@gmail.com
MAIL_FROM_ADDRESS=hello.oudnomaddubai@gmail.com
`;
  }
  fs.writeFileSync(apiEnvPath, content, 'utf8');
  console.log('API_ENV_UPDATED');
}

// 2. Update apps/web/.env.local
const webEnvPath = '/var/www/oudnomad/apps/web/.env.local';
const webEnvContent = `NEXT_PUBLIC_API_URL=https://oudnomaddubai.com/api
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hello.oudnomaddubai@gmail.com
SMTP_PASS=${process.env.SMTP_PASS || ''}
`;
fs.writeFileSync(webEnvPath, webEnvContent, 'utf8');
console.log('WEB_ENV_UPDATED');
