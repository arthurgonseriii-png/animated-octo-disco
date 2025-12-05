// @ts-check
import { test, expect } from '@playwright/test';

// Hardcoded credentials for the test environment
const MASTER_ADMIN_USER = 'arthur.gonser1@yahoo.com';
const MASTER_ADMIN_PASS = 'Hollywood1';

test('homepage has BQC-Nav in title and welcomes user after login', async ({ page }) => {
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(msg.text()));

  await page.goto('http://localhost:5173/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/BQC-Nav/);

  // Perform login
  await page.fill('input[type="text"]', MASTER_ADMIN_USER);
  await page.fill('input[type="password"]', MASTER_ADMIN_PASS);
  await page.click('button:has-text("Login")');

  // Expect the welcome message to be visible
  await expect(page.locator('h1')).toHaveText(/Welcome back/);

  // Check for Firebase permission errors in the console
  const hasPermissionError = consoleMessages.some(msg => msg.includes('FirebaseError: Missing or insufficient permissions'));
  expect(hasPermissionError).toBe(false, 'Firebase permission errors were found in the console.');
});
