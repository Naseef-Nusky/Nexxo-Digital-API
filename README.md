# Nexxo Digital API

Contact / quote form backend using **SendGrid**.

## Setup

```bash
cd Nexxo-Digital-API
cp .env.example .env
npm install
```

Fill in `.env`:

- `SENDGRID_API_KEY` — from [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)
- `SENDGRID_FROM_EMAIL` — must be a verified sender / domain in SendGrid
- `SENDGRID_TO_EMAIL` — inbox that receives quote requests (e.g. `hello@nexxodigital.com`)
- `CORS_ORIGINS` — comma-separated frontend URLs

## Run

```bash
npm run dev
# or
npm start
```

API base: `http://localhost:5050`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/quote` | Submit quote form |

### `POST /api/quote` body

```json
{
  "name": "Jane Smith",
  "business": "Acme Ltd",
  "email": "jane@acme.com",
  "telephone": "+44...",
  "need": "Website Design",
  "project": "We need a new lead-gen site...",
  "source": "website"
}
```

On success the API emails `SENDGRID_TO_EMAIL` and optionally sends an auto-reply to the visitor.
