# Connecting Clients

Your server is a remote HTTP endpoint (`https://<site>.netlify.app/mcp`). Modern clients connect to it **natively** over Streamable HTTP. The `mcp-remote` bridge — which most older tutorials lead with — is now a **fallback**, not the default. Its own README says to drop it once your client supports remote servers.

## Native connection (preferred)

**Claude Code** — native Streamable HTTP, custom headers supported:

```bash
claude mcp add --transport http my-mcp https://<site>.netlify.app/mcp \
  --header "Authorization: Bearer <token>"
```

**Cursor** — native Streamable HTTP. Add to `mcp.json`:

```json
{
  "mcpServers": {
    "my-mcp": {
      "url": "https://<site>.netlify.app/mcp",
      "headers": { "Authorization": "Bearer <token>" }
    }
  }
}
```

**Claude Desktop / claude.ai** — add a **Custom Connector** (Settings → Connectors → Add). Connectors are built around OAuth (see below). For a server that authenticates with a **static bearer token** rather than OAuth, the connector UI may not give you a place to set that header — in that case use the `mcp-remote` fallback for Desktop.

## `mcp-remote` fallback

For clients that only speak stdio, or can't set headers natively, `mcp-remote` bridges a local stdio MCP server to your remote HTTP one:

```json
{
  "mcpServers": {
    "my-mcp": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote",
        "https://<site>.netlify.app/mcp",
        "--header", "Authorization: Bearer <token>"
      ]
    }
  }
}
```

The bearer token sits in plaintext in this config file — treat it like any other on-disk secret, and revoke + reissue if it leaks.

## Local testing with the MCP Inspector

Before wiring up a real client, exercise the server directly:

```bash
npx @modelcontextprotocol/inspector
```

Connect via **Streamable HTTP** to `http://localhost:8888/mcp` (under `netlify dev`) or your deployed URL, add an `Authorization: Bearer <token>` header, and confirm tools list and call. This isolates "is my server correct?" from "is my client configured right?".

## OAuth and Custom Connectors (deep-dive)

Static bearer tokens are perfect for a personal server or a small set of trusted users. **OAuth** is what you want when you're publishing a connector for **end users who shouldn't be handed a raw token** — they click "Connect," approve access, and the client obtains and refreshes tokens for them. This is how Claude Desktop / claude.ai Custom Connectors and Cursor's OAuth flow are designed to work.

What an OAuth-capable remote MCP server has to provide (per the MCP spec's authorization model):

- **OAuth 2.1 authorization + token endpoints** (or delegation to an external identity provider).
- **Protected-resource metadata** so the client can discover where to authorize.
- Often **Dynamic Client Registration**, so clients can register without you hand-issuing credentials.
- Bearer **access tokens** your server validates on each MCP request — the same `Authorization` check, just with tokens minted by the OAuth flow instead of pasted by hand.

This is materially more work than a shared secret and is its own project. Decision rule:

- **Personal or small trusted group** → static bearer token (single secret or per-user API keys). Done.
- **Public connector for arbitrary end users** → OAuth. Budget for it accordingly, and lean on a hosted identity provider rather than hand-rolling the OAuth server.

Because native client support and the connector/OAuth surface are moving quickly, verify the current connection steps for the specific client in front of you rather than trusting any single snapshot — including this one.
