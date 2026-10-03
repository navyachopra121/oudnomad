const crypto = require('crypto');
const fs = require('fs');

const jwtAccess = crypto.randomBytes(64).toString('hex');
const jwtRefresh = crypto.randomBytes(64).toString('hex');

const envContent = `# =============================================================================
# oudnomad-store — Production Environment Variables
# =============================================================================

DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/oudnomad?schema=public"
REDIS_URL="redis://127.0.0.1:6379"

JWT_ACCESS_SECRET="${jwtAccess}"
JWT_REFRESH_SECRET="${jwtRefresh}"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

PAYMENT_PROVIDER="mock"
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_WEBHOOK_SECRET=""

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

EMAIL_PROVIDER="resend"
RESEND_API_KEY=""
RESEND_FROM="OudNomad <noreply@oudnomad.com>"

NODE_ENV="production"
PORT=3001
APP_URL="http://187.126.116.61"
NEXT_PUBLIC_API_URL="http://187.126.116.61/api"
CORS_ORIGINS="http://187.126.116.61,https://187.126.116.61,http://oudnomad.com,https://oudnomad.com,http://www.oudnomad.com,https://www.oudnomad.com"
`;

fs.writeFileSync('/var/www/oudnomad/.env', envContent, 'utf8');
fs.writeFileSync('/var/www/oudnomad/apps/api/.env', envContent, 'utf8');
fs.writeFileSync('/var/www/oudnomad/apps/web/.env.local', 'NEXT_PUBLIC_API_URL=http://187.126.116.61/api\n', 'utf8');
console.log('ENV_CONFIGURED_PROPERLY');
