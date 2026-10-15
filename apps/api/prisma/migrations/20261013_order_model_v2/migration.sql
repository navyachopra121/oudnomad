-- =============================================================================
-- Migration: 20261013_order_model_v2
-- Fixes drift between 20260911_init and current schema.prisma
-- Migrates from Stripe-based model to Razorpay-based model
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. DROP OLD OrderStatus enum values and recreate
--    Old: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
--    New: PENDING_PAYMENT, CONFIRMED, PLACED, SHIPPED, DELIVERED,
--         CANCELLED, PAYMENT_FAILED, EXPIRED, REFUNDED
-- ---------------------------------------------------------------------------

-- Step 1a: rename old enum
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";

-- Step 1b: create new enum
CREATE TYPE "OrderStatus" AS ENUM (
  'PENDING_PAYMENT',
  'CONFIRMED',
  'PLACED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'PAYMENT_FAILED',
  'EXPIRED',
  'REFUNDED'
);

-- Step 1c: migrate existing Order rows (map old → new values)
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders"
  ALTER COLUMN "status" TYPE "OrderStatus"
  USING (
    CASE "status"::text
      WHEN 'PENDING'    THEN 'PENDING_PAYMENT'::"OrderStatus"
      WHEN 'PROCESSING' THEN 'CONFIRMED'::"OrderStatus"
      WHEN 'SHIPPED'    THEN 'SHIPPED'::"OrderStatus"
      WHEN 'DELIVERED'  THEN 'DELIVERED'::"OrderStatus"
      WHEN 'CANCELLED'  THEN 'CANCELLED'::"OrderStatus"
      WHEN 'REFUNDED'   THEN 'REFUNDED'::"OrderStatus"
      ELSE 'PENDING_PAYMENT'::"OrderStatus"
    END
  );
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';

-- Step 1d: drop old enum
DROP TYPE "OrderStatus_old";

-- ---------------------------------------------------------------------------
-- 2. Add new enums missing from init migration
-- ---------------------------------------------------------------------------

CREATE TYPE "ShippingMethodEnum" AS ENUM ('STANDARD', 'EXPRESS');

CREATE TYPE "PaymentAttemptStatus" AS ENUM ('CREATED', 'SUCCEEDED', 'FAILED');

CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

CREATE TYPE "NotificationType" AS ENUM (
  'ORDER_CONFIRMATION',
  'SHIPPING_UPDATE',
  'PASSWORD_RESET',
  'ABANDONED_CART'
);

CREATE TYPE "NotificationStatus" AS ENUM (
  'PENDING', 'SENT', 'FAILED', 'DEAD_LETTERED'
);

-- ---------------------------------------------------------------------------
-- 3. Drop old tables that no longer exist in schema.prisma
-- ---------------------------------------------------------------------------

-- Drop old Payment table (replaced by payment_attempts)
DROP TABLE IF EXISTS "Payment";

-- Drop old ShippingMethod table (replaced by shipping_rates enum-keyed table)
DROP TABLE IF EXISTS "ShippingMethod";

-- ---------------------------------------------------------------------------
-- 4. Alter "orders" table — bring columns in sync with schema.prisma
-- ---------------------------------------------------------------------------

-- Remove old columns
ALTER TABLE "orders" DROP COLUMN IF EXISTS "regionId";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "currencyCode";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "subtotalMinor";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "taxMinor";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shippingMinor";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "totalMinor";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shippingMethodName";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shippingRecipientName";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shippingLine1";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shippingLine2";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shippingCity";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shippingState";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shippingPostalCode";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shippingCountryCode";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shippingPhone";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billingRecipientName";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billingLine1";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billingLine2";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billingCity";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billingState";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billingPostalCode";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billingCountryCode";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billingPhone";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "orderNumber";

-- Add new columns matching schema.prisma
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "order_number"          TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_address_id"   TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_method"       "ShippingMethodEnum" NOT NULL DEFAULT 'STANDARD';
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_cost"         DECIMAL(10,2) NOT NULL DEFAULT 5.00;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "subtotal"              DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "tax_amount"            DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "discount_amount"       DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "total"                 DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "reservation_expires_at" TIMESTAMP(3);

-- Shipping fields (DHL/GCC support)
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "awb_code"              TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "carrier_shipment_id"   TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "tracking_url"          TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "dispatched_at"         TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "delivered_at"          TIMESTAMP(3);

-- Address snapshot (immutable billing/shipping at time of order)
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "snap_recipient_name"  TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "snap_line1"           TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "snap_line2"           TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "snap_city"            TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "snap_state"           TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "snap_postal_code"     TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "snap_country_code"    TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "snap_phone"           TEXT;

-- Unique index for order_number
CREATE UNIQUE INDEX IF NOT EXISTS "orders_order_number_key" ON "orders"("order_number");

-- Index for status and user_id lookups
CREATE INDEX IF NOT EXISTS "orders_user_id_idx"  ON "orders"("user_id");
CREATE INDEX IF NOT EXISTS "orders_status_idx"   ON "orders"("status");

-- FK to Address
ALTER TABLE "orders"
  ADD CONSTRAINT "orders_shipping_address_id_fkey"
  FOREIGN KEY ("shipping_address_id") REFERENCES "Address"("id")
  ON DELETE SET NULL ON UPDATE CASCADE
  NOT VALID; -- NOT VALID so we don't scan existing rows

-- ---------------------------------------------------------------------------
-- 5. Alter "order_items" table — bring columns in sync
-- ---------------------------------------------------------------------------

ALTER TABLE "order_items" DROP COLUMN IF EXISTS "productNameSnapshot";
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "variantSkuSnapshot";
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "unitPriceMinor";
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "taxMinor";
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "totalMinor";

ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "product_name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "size"         TEXT;
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "color"        TEXT;
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "unit_price"   DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "line_total"   DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "updatedAt";

-- Rename FK column if needed
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "variantId";
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "variant_id" TEXT;

-- ---------------------------------------------------------------------------
-- 6. Create missing tables
-- ---------------------------------------------------------------------------

-- order_status_events
CREATE TABLE IF NOT EXISTS "order_status_events" (
  "id"         TEXT        NOT NULL,
  "order_id"   TEXT        NOT NULL,
  "status"     "OrderStatus" NOT NULL,
  "note"       TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "order_status_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "order_status_events_order_id_idx"
  ON "order_status_events"("order_id");

ALTER TABLE "order_status_events"
  ADD CONSTRAINT "order_status_events_order_id_fkey"
  FOREIGN KEY ("order_id") REFERENCES "orders"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- payment_attempts
CREATE TABLE IF NOT EXISTS "payment_attempts" (
  "id"                  TEXT                   NOT NULL,
  "order_id"            TEXT                   NOT NULL,
  "gateway_order_id"    TEXT                   NOT NULL,
  "gateway_payment_id"  TEXT,
  "idempotency_key"     TEXT                   NOT NULL,
  "status"              "PaymentAttemptStatus" NOT NULL DEFAULT 'CREATED',
  "amount"              DECIMAL(10,2)          NOT NULL,
  "failure_reason"      TEXT,
  "created_at"          TIMESTAMP(3)           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"          TIMESTAMP(3)           NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "payment_attempts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "payment_attempts_gateway_order_id_key"
  ON "payment_attempts"("gateway_order_id");
CREATE UNIQUE INDEX IF NOT EXISTS "payment_attempts_gateway_payment_id_key"
  ON "payment_attempts"("gateway_payment_id") WHERE "gateway_payment_id" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "payment_attempts_idempotency_key_key"
  ON "payment_attempts"("idempotency_key");
CREATE INDEX IF NOT EXISTS "payment_attempts_order_id_idx"
  ON "payment_attempts"("order_id");

ALTER TABLE "payment_attempts"
  ADD CONSTRAINT "payment_attempts_order_id_fkey"
  FOREIGN KEY ("order_id") REFERENCES "orders"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- refunds
CREATE TABLE IF NOT EXISTS "refunds" (
  "id"                    TEXT           NOT NULL,
  "order_id"              TEXT           NOT NULL,
  "payment_attempt_id"    TEXT           NOT NULL,
  "gateway_refund_id"     TEXT,
  "amount"                DECIMAL(10,2)  NOT NULL,
  "reason"                TEXT,
  "status"                "RefundStatus" NOT NULL DEFAULT 'PENDING',
  "initiated_by_admin_id" TEXT           NOT NULL,
  "created_at"            TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"            TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "refunds_gateway_refund_id_key"
  ON "refunds"("gateway_refund_id") WHERE "gateway_refund_id" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "refunds_order_id_idx"
  ON "refunds"("order_id");

ALTER TABLE "refunds"
  ADD CONSTRAINT "refunds_order_id_fkey"
  FOREIGN KEY ("order_id") REFERENCES "orders"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "refunds"
  ADD CONSTRAINT "refunds_payment_attempt_id_fkey"
  FOREIGN KEY ("payment_attempt_id") REFERENCES "payment_attempts"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- shipping_rates (replaces ShippingMethod table)
CREATE TABLE IF NOT EXISTS "shipping_rates" (
  "method" "ShippingMethodEnum" NOT NULL,
  "cost"   DECIMAL(10,2)        NOT NULL,
  "label"  TEXT                 NOT NULL,

  CONSTRAINT "shipping_rates_pkey" PRIMARY KEY ("method")
);

INSERT INTO "shipping_rates" ("method", "cost", "label")
VALUES
  ('STANDARD', 5.00, 'Standard Delivery (5-7 business days)'),
  ('EXPRESS', 15.00, 'Express Delivery (1-2 business days)')
ON CONFLICT DO NOTHING;

-- notifications
CREATE TABLE IF NOT EXISTS "notifications" (
  "id"               TEXT                 NOT NULL,
  "idempotency_key"  TEXT                 NOT NULL,
  "type"             "NotificationType"   NOT NULL,
  "status"           "NotificationStatus" NOT NULL DEFAULT 'PENDING',
  "recipient"        TEXT                 NOT NULL,
  "payload"          JSONB                NOT NULL DEFAULT '{}',
  "attempts"         INTEGER              NOT NULL DEFAULT 0,
  "last_error"       TEXT,
  "sent_at"          TIMESTAMP(3),
  "created_at"       TIMESTAMP(3)         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"       TIMESTAMP(3)         NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "notifications_idempotency_key_key"
  ON "notifications"("idempotency_key");
CREATE INDEX IF NOT EXISTS "notifications_status_idx"  ON "notifications"("status");
CREATE INDEX IF NOT EXISTS "notifications_type_idx"    ON "notifications"("type");

-- invoices
CREATE TABLE IF NOT EXISTS "invoices" (
  "id"           TEXT         NOT NULL,
  "order_id"     TEXT         NOT NULL,
  "invoice_no"   TEXT         NOT NULL,
  "pdf_url"      TEXT         NOT NULL,
  "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "invoices_order_id_key"
  ON "invoices"("order_id");
CREATE UNIQUE INDEX IF NOT EXISTS "invoices_invoice_no_key"
  ON "invoices"("invoice_no");

ALTER TABLE "invoices"
  ADD CONSTRAINT "invoices_order_id_fkey"
  FOREIGN KEY ("order_id") REFERENCES "orders"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- 7. Add extra columns to existing tables that were added to schema.prisma
--    after the init migration
-- ---------------------------------------------------------------------------

-- Cart
ALTER TABLE "Cart" ADD COLUMN IF NOT EXISTS "abandoned_email_sent_at" TIMESTAMP(3);

-- Inventory
ALTER TABLE "Inventory" ADD COLUMN IF NOT EXISTS "low_stock_threshold" INTEGER NOT NULL DEFAULT 5;

-- InventoryAdjustment (new table)
CREATE TABLE IF NOT EXISTS "inventory_adjustments" (
  "id"           TEXT         NOT NULL,
  "inventory_id" TEXT         NOT NULL,
  "adjusted_by"  TEXT         NOT NULL,
  "delta"        INTEGER      NOT NULL,
  "reason"       TEXT         NOT NULL,
  "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "inventory_adjustments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "inventory_adjustments_inventory_id_idx"
  ON "inventory_adjustments"("inventory_id");

ALTER TABLE "inventory_adjustments"
  ADD CONSTRAINT "inventory_adjustments_inventory_id_fkey"
  FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AuditLog (new table)
CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id"          TEXT         NOT NULL,
  "actor_id"    TEXT         NOT NULL,
  "action"      TEXT         NOT NULL,
  "target_type" TEXT         NOT NULL,
  "target_id"   TEXT         NOT NULL,
  "metadata"    JSONB        NOT NULL DEFAULT '{}',
  "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "audit_logs_target_idx" ON "audit_logs"("target_type", "target_id");
CREATE INDEX IF NOT EXISTS "audit_logs_actor_idx"  ON "audit_logs"("actor_id");

-- PasswordResetToken (new table)
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
  "id"         TEXT         NOT NULL,
  "user_id"    TEXT         NOT NULL,
  "token_hash" TEXT         NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "used_at"    TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_hash_key"
  ON "password_reset_tokens"("token_hash");
CREATE INDEX IF NOT EXISTS "password_reset_tokens_user_id_idx"
  ON "password_reset_tokens"("user_id");

ALTER TABLE "password_reset_tokens"
  ADD CONSTRAINT "password_reset_tokens_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- EmailVerificationToken (new table)
CREATE TABLE IF NOT EXISTS "email_verification_tokens" (
  "id"         TEXT         NOT NULL,
  "user_id"    TEXT         NOT NULL,
  "token_hash" TEXT         NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "used_at"    TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "email_verification_tokens_token_hash_key"
  ON "email_verification_tokens"("token_hash");
CREATE INDEX IF NOT EXISTS "email_verification_tokens_user_id_idx"
  ON "email_verification_tokens"("user_id");

ALTER TABLE "email_verification_tokens"
  ADD CONSTRAINT "email_verification_tokens_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ProductPrice — add updatedAt if missing
ALTER TABLE "ProductPrice" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Product — add missing columns
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "avg_rating"    FLOAT NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "review_count"  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "search_vector" tsvector;

-- ProductVariant — add missing columns
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "size"  TEXT;
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "color" TEXT;
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "stock" INTEGER NOT NULL DEFAULT 0;

-- ProductImage — add missing columns
ALTER TABLE "ProductImage" ADD COLUMN IF NOT EXISTS "path"          TEXT NOT NULL DEFAULT '';
ALTER TABLE "ProductImage" ADD COLUMN IF NOT EXISTS "sort_order"    INTEGER NOT NULL DEFAULT 0;
-- fix url to allow empty string default
ALTER TABLE "ProductImage" ALTER COLUMN "url" SET DEFAULT '';

-- User — add emailVerified column rename
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- WishlistItem (new table)
CREATE TABLE IF NOT EXISTS "wishlist_items" (
  "id"         TEXT         NOT NULL,
  "user_id"    TEXT         NOT NULL,
  "product_id" TEXT         NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "wishlist_items_user_id_product_id_key"
  ON "wishlist_items"("user_id", "product_id");

ALTER TABLE "wishlist_items"
  ADD CONSTRAINT "wishlist_items_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "wishlist_items"
  ADD CONSTRAINT "wishlist_items_product_id_fkey"
  FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Review (new table)
CREATE TABLE IF NOT EXISTS "reviews" (
  "id"          TEXT         NOT NULL,
  "product_id"  TEXT         NOT NULL,
  "user_id"     TEXT         NOT NULL,
  "rating"      INTEGER      NOT NULL,
  "title"       TEXT,
  "body"        TEXT,
  "is_reported" BOOLEAN      NOT NULL DEFAULT false,
  "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at"  TIMESTAMP(3),

  CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "reviews_product_id_user_id_key"
  ON "reviews"("product_id", "user_id");
CREATE INDEX IF NOT EXISTS "reviews_product_id_idx" ON "reviews"("product_id");

ALTER TABLE "reviews"
  ADD CONSTRAINT "reviews_product_id_fkey"
  FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reviews"
  ADD CONSTRAINT "reviews_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ProductRecommendation (new table)
CREATE TABLE IF NOT EXISTS "product_recommendations" (
  "id"             TEXT         NOT NULL,
  "product_id"     TEXT         NOT NULL,
  "recommended_id" TEXT         NOT NULL,
  "score"          FLOAT        NOT NULL,
  "source"         TEXT         NOT NULL,
  "computed_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "product_recommendations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "product_recommendations_product_id_recommended_id_key"
  ON "product_recommendations"("product_id", "recommended_id");
CREATE INDEX IF NOT EXISTS "product_recommendations_product_id_score_idx"
  ON "product_recommendations"("product_id", "score");

ALTER TABLE "product_recommendations"
  ADD CONSTRAINT "product_recommendations_product_id_fkey"
  FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "product_recommendations"
  ADD CONSTRAINT "product_recommendations_recommended_id_fkey"
  FOREIGN KEY ("recommended_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
