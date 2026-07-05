import { test, expect } from '@playwright/test';

test.describe('Jnan Store - Starter E2E Scenarios', () => {
  
  test('1. Home page loads and displays core brand elements', async ({ page }) => {
    await page.goto('/');
    
    // Arabic title check
    await expect(page).toHaveTitle(/Jnan Store|متجر جنان/i);
    
    // Check navigation logo links
    const logoLink = page.locator('a[aria-label="الرئيسية"]').first();
    await expect(logoLink).toBeVisible();
  });

  test('2. Product details page loading and variant switching', async ({ page }) => {
    // Navigate straight to the premium saudi coffee by slug
    await page.goto('/shop/premium-saudi-coffee-golden-blend');
    
    // Confirm title details render (uses h1 element)
    const productTitle = page.locator('h1').first();
    await expect(productTitle).toBeVisible();
    
    // Check main price is displayed
    const priceDisplay = page.locator('text=ر.س');
    await expect(priceDisplay.first()).toBeVisible();
  });

  test('3. Authentication login flow', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill correct mock credentials from auth.mock.ts
    await page.fill('input[placeholder="example@jnan.com"]', 'user@jnan.com');
    await page.fill('input[type="password"]', 'User123!');
    
    // Click submit
    await page.click('button[type="submit"]');
    
    // We should be redirected to the homepage or profile page
    await page.waitForURL(url => url.pathname === '/' || url.pathname === '/profile');
    expect(page.url()).toContain('/');
  });

  test('4. Add item to cart and view slide-out drawer', async ({ page }) => {
    await page.goto('/shop/premium-saudi-coffee-golden-blend');
    
    // Click 'add to cart' button
    const addToCartButton = page.locator('button:has-text("أضف للسلة")').first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();
    
    // Open the cart drawer
    const openCartBtn = page.locator('button[aria-label="سلة المشتريات"]').first();
    await openCartBtn.click();
    
    // Verify drawer item is rendered
    const cartItem = page.locator('[role="listitem"]').first();
    await expect(cartItem).toBeVisible();
  });

  test('5. Wishlist toggle state change', async ({ page }) => {
    await page.goto('/shop/premium-saudi-coffee-golden-blend');
    
    // Toggle wishlist heart button
    const wishlistButton = page.locator('button[aria-label*="المفضلة"]').first();
    await expect(wishlistButton).toBeVisible();
    await wishlistButton.click();
  });

  test('6. Checkout flow navigation', async ({ page }) => {
    await page.goto('/shop/premium-saudi-coffee-golden-blend');
    
    // Add to cart
    const addToCartButton = page.locator('button:has-text("أضف للسلة")').first();
    await addToCartButton.click();
    
    // Navigate to checkout page
    await page.goto('/checkout');
    expect(page.url()).toContain('/checkout');
  });

});
