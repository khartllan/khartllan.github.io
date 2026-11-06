import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4331', browserName: 'chromium' },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4331 --ignore-lock',
    url: 'http://127.0.0.1:4331',
    reuseExistingServer: !process.env.CI,
  },
});
