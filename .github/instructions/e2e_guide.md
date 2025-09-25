E2E Guide (MCP Playwright only)

This repository enforces MCP-provided Playwright browser tools for all E2E checks.

Local reproduction
- Start the web server: npm run web (or npx expo start --web)
- Open the forced route: http://localhost:19006/?e2e=home (replace host/port as needed)
- Use the MCP Playwright browser tools (mcp_playwright_browser_*) to drive the browser and capture screenshots.

CI (optional static export)
- Build a static web export:
  npm run build:web
- Serve the built site on a static server (e.g., http-server or a GitHub action that serves from web-build/)
- Use MCP Playwright browser tools against the served static URL for reliable E2E runs.

Notes
- Do NOT run local terminal Playwright or CI Playwright jobs; they have been intentionally disabled. Use the MCP Playwright browser tools.
- Keep forced-route behavior (`?e2e=`) intact to allow deterministic screen rendering for E2E.
