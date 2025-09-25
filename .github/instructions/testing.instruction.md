# Testing Guide — Playwright MCP & Hot Reload

## Philosophy
Use the MCP-provided browser tooling to run deterministic E2E checks against the running Expo web server. Keep the dev server running and use hot reload to speed iteration.

## Hot reload workflow (recommended)
1. Start server once: `npm run web` (do not restart unless necessary)
2. Make code changes
3. Re-run MCP navigation and screenshot commands to verify UI

## Playwright MCP quick checks
- Navigate to root: playwright_navigate → http://localhost:8081
- Capture screenshot: playwright_screenshot → `.playwright-mcp/after-changes.png`
- Save console logs: playwright_console_messages → `.playwright-mcp/console-full.log`

## E2E Smoke Example
1. Start dev server
2. Run MCP: navigate to `/`, click tab `Forecasts`, click tab `Library` and save screenshots
3. Verify screenshots in `.playwright-mcp`

## Notes
- If you must restart server for dependency changes or .env edits, do so sparingly and document reason in the session notes.
- For CI reliability, prefer building a static web export and run tests against the static server instead of Metro if you need reproducible CI pipelines.
