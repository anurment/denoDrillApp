import { test as setup, expect } from '@playwright/test';

const adminFile = './auth/admin.json';

setup('authenticate as an admin', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('/auth/login');
  await page.locator("input[type=email]").fill("admin@admin.com");
  await page.locator("input[type=password]").fill("123456");
  await page.locator("input[type=submit]").click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('/topics');
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  //await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: adminFile });
});

const userFile = './auth/user.json';

setup('register and authenticate as a user', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto("/auth/register");
  const email = "user2@user.com";
  const password = "password123456"
  await page.locator("input[type=email]").fill(email);
  await page.locator("input[type=password]").fill(password);
  await page.getByRole('button', {name: "Submit!"}).click();

  //await page.waitForURL('/auth/login');
  await page.locator("input[type=email]").fill(email);
  await page.locator("input[type=password]").fill(password);
  await page.getByRole('button', {name: "Login!"}).click();
  await page.waitForURL('/topics');
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  //await page.waitForURL('https://github.com/');
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  //await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: userFile });
});
