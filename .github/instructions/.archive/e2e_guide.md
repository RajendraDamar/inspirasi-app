```markdown
E2E Guide (MCP browser tools only)

This repository enforces MCP-provided browser tools for all E2E checks; there are no local or CI test runners in the repository.

Local reproduction
- Start the web server: npm run web (or npx expo start --web)
- Open the forced route: http://localhost:19006/?e2e=home (replace host/port as needed)
- Use the MCP browser tools (MCP-provided browser helpers) to drive the browser and capture screenshots.

CI (optional static export)
- Build a static web export:
  npm run build:web
- Serve the built site on a static server (e.g., http-server or a GitHub action that serves from web-build/)
- Use the MCP browser tools against the served static URL for reliable E2E runs.

Notes
- Do NOT run local terminal browser test runners or CI-based browser test jobs; they have been intentionally removed from the repo. Use the MCP browser tools.
- Keep forced-route behavior (`?e2e=`) intact to allow deterministic screen rendering for E2E.

```
