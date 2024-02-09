import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 30000,
  retries: 0,
  reporter: "list",
  workers: 5,
  use: {
    baseURL: "http://localhost:7777",
    headless: true,
    ignoreHTTPSErrors: true,
  },
  testDir: './tests',
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    {
      name: "e2e-headless-chromium",
      use: {
        browserName: "chromium",
        //storageState: './auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
