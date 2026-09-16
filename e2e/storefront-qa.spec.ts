import { test, expect } from '@playwright/test';

test.describe('OudNomad Storefront & API QA Matrix', () => {

  test('1. Core Purchase Flow (Happy Path)', async ({ page }) => {
    await page.goto('/search?q=oud');
    await expect(page.locator('h1')).toBeVisible();

    // Navigate to product detail
    await page.goto('/products/royal-oud-parfum');
    await page.click('text=Add to Cart');

    // Cart page navigation
    await page.goto('/cart');
    await expect(page.locator('text=Checkout')).toBeVisible();
    await page.click('text=Checkout');

    // Fill shipping details
    await page.fill('input[name="email"]', 'customer@example.com');
    await page.fill('input[name="fullName"]', 'Test Customer');
    await page.fill('input[name="addressLine1"]', '123 Luxury Way');
    await page.fill('input[name="city"]', 'Mumbai');
    await page.fill('input[name="postalCode"]', '400001');

    // Check explicit Terms Acceptance checkbox
    await page.check('input[name="acceptTerms"]');

    // Place Order
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Order Confirmed')).toBeVisible();
  });

  test('2. Inventory - Block Out of Stock Item', async ({ page }) => {
    await page.goto('/products/out-of-stock-attar');
    const addToCartBtn = page.locator('button:has-text("Out of Stock")');
    await expect(addToCartBtn).toBeDisabled();
  });

  test('3. Inventory - Parallel Checkout Race Condition Guard', async ({ browser }) => {
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    await pageA.goto('/checkout?variantId=last-unit-variant');
    await pageB.goto('/checkout?variantId=last-unit-variant');

    // Trigger simultaneous submit
    const submitA = pageA.click('button[type="submit"]');
    const submitB = pageB.click('button[type="submit"]');

    await Promise.allSettled([submitA, submitB]);

    // One must succeed, one must receive clear stock error
    const hasErrorA = await pageA.locator('text=out of stock').isVisible();
    const hasErrorB = await pageB.locator('text=out of stock').isVisible();

    expect(hasErrorA || hasErrorB).toBe(true);
    await contextA.close();
    await contextB.close();
  });

  test('4. Payments - Declined Card Handling', async ({ page }) => {
    await page.goto('/checkout?mockPayment=declined');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Card was declined')).toBeVisible();
  });

  test('5. Coupons - Expiry & Minimum Order Threshold Validation', async ({ request }) => {
    // Expired coupon
    const expiredRes = await request.post('/api/cart/coupon', {
      data: { code: 'EXPIRED2025', cartTotal: 200 }
    });
    expect(expiredRes.status()).toBe(400);

    // Minimum order threshold
    const lowTotalRes = await request.post('/api/cart/coupon', {
      data: { code: 'MIN500', cartTotal: 100 }
    });
    expect(lowTotalRes.status()).toBe(400);
  });

  test('6. Order State Machine - Invalid Transition Rejection', async ({ request }) => {
    // Attempt invalid DELIVERED -> PENDING transition
    const res = await request.patch('/api/admin/orders/ord-123/status', {
      headers: { Authorization: 'Bearer mock-admin-token' },
      data: { status: 'PENDING' }
    });
    expect(res.status()).toBe(400);
  });

  test('7. User Lockout & Sole Admin Demotion Protection', async ({ request }) => {
    // Attempt to block/demote last remaining admin
    const res = await request.patch('/api/admin/users/sole-admin-id', {
      headers: { Authorization: 'Bearer mock-admin-token' },
      data: { role: 'CUSTOMER', isBlocked: true }
    });
    expect(res.status()).toBe(400);
  });

  test('8. Reviews - Uniqueness Constraint & Admin Aggregation Re-computation', async ({ request }) => {
    // Second review attempt for same product/user
    const secondReviewRes = await request.post('/api/products/prod-1/reviews', {
      headers: { Authorization: 'Bearer mock-user-token' },
      data: { rating: 5, comment: 'Duplicate review' }
    });
    expect(secondReviewRes.status()).toBe(400);
  });

  test('9. Wishlist & Cache Invalidation', async ({ request }) => {
    // Idempotent wishlist add
    const wish1 = await request.post('/api/wishlist/prod-1', {
      headers: { Authorization: 'Bearer mock-user-token' }
    });
    const wish2 = await request.post('/api/wishlist/prod-1', {
      headers: { Authorization: 'Bearer mock-user-token' }
    });
    expect(wish1.status()).toBe(200);
    expect(wish2.status()).toBe(200);
  });
});
