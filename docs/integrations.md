# Integrations

SaaSForge AI uses an integration abstraction so third-party services can be connected cleanly without leaking credentials to the frontend.

## Available providers

### Stripe
Used for:
- subscriptions
- checkout
- invoices
- customer portal
- webhooks

Required env vars:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### GitHub
Used for:
- repository sync
- deployment workflows
- source backups

Required env vars:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

### Google
Used for:
- OAuth login
- Calendar sync
- Workspace integrations

Required env vars:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Resend / SendGrid
Used for:
- verification emails
- password resets
- billing notices
- deployment notifications

### OpenAI / Anthropic / Google AI
Used for:
- product specification generation
- UI generation
- code generation
- project memory and modifications

## Production integration strategy

1. Keep credentials only on the server.
2. Use provider-specific service modules.
3. Store connection metadata in the `Integration` entity.
4. Log connect/disconnect actions in `AuditLog`.
5. Show clear UI states when configuration is missing.
