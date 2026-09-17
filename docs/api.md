# SaaSForge AI API

Base URL in local dev: `/api`

## Authentication

- Browser sessions use an HTTP-only cookie named `sf_session`.
- For server-to-server integrations, use scoped API keys generated in Settings → API.
- Never expose secrets in client code.

## Endpoints

### GET /api/projects
Returns all projects for the authenticated organization.

### POST /api/projects
Creates a new project.

Payload:
```json
{
  "name": "EstateFlow CRM",
  "prompt": "Build a CRM for real estate agencies",
  "category": "CRM",
  "maturity": "Production ready",
  "style": "Dark"
}
```

### GET /api/templates
Returns the public template library.

### GET /api/analytics
Returns a consolidated metrics object:
- visitors
- users
- mrr
- creditsUsed

### POST /api/builder
Submits an AI Builder instruction.

Payload:
```json
{
  "projectId": "proj_123",
  "prompt": "Add Stripe subscriptions"
}
```

## Planned production endpoints

- `POST /api/deployments`
- `POST /api/domains/verify`
- `POST /api/integrations/:provider/connect`
- `GET /api/billing/invoices`
- `POST /api/webhooks/stripe`
- `POST /api/webhooks/github`

## Security notes

- Validate all payloads on the server.
- Apply rate limiting for auth and write endpoints.
- Scope actions by organization and membership role.
- Record audit logs for billing, deploy and security-sensitive actions.
