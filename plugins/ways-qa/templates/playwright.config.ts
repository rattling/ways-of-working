import { defineConfig, devices } from '@playwright/test';
import config from './environments.json';

// Which environment the tests run against. One setting switches all of it:
//   QA_ENV=live npx playwright test        (PowerShell: $env:QA_ENV='live'; npx playwright test)
// The environments and their URLs are in environments.json. BASE_URL overrides the URL outright,
// for a one-off run against somewhere else; it applies to the first app.
const envName: string = process.env.QA_ENV || (process.env.CI ? config.ci : config.default);
const env: Record<string, string> = (config.environments as Record<string, Record<string, string>>)[envName];
if (!env) {
  throw new Error(`QA_ENV=${envName} isn't in environments.json. Known: ${Object.keys(config.environments).join(', ')}`);
}
const apps = Object.keys(env);

// One project per app: its tests go in tests/<app>/ and get that app's URL as baseURL.
// With a single app, every test in tests/ uses it.
const projects =
  apps.length === 1
    ? [{ name: apps[0], testDir: './tests', use: { ...devices['Desktop Chrome'], baseURL: process.env.BASE_URL ?? env[apps[0]] } }]
    : [
        ...apps.map((app, i) => ({
          name: app,
          testDir: `./tests/${app}`,
          use: { ...devices['Desktop Chrome'], baseURL: (i === 0 && process.env.BASE_URL) || env[app] },
        })),
        // Tests directly in tests/ (not in an app's folder) run once, with no baseURL.
        { name: 'general', testDir: './tests', testIgnore: apps.map((a) => `**/${a}/**`), use: { ...devices['Desktop Chrome'] } },
      ];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'on-failure' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  metadata: { environment: envName },
  projects,
});
