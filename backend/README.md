# SAMBARAM API

The backend is organized as an application package. `server.py` remains a small
compatibility entrypoint, so existing deployments using `uvicorn server:app`
continue to work without changes.

```text
app/
  api/routes/       HTTP endpoints grouped by domain
  core/             environment settings and Mongo lifecycle
  data/             static first-run seed data
  schemas/          Pydantic request and persistence models
  services/         AI streaming and notification integrations
  main.py           application factory and router registration
  seed.py            idempotent database bootstrap
```

## Run locally

```bash
cd backend
./venv/bin/uvicorn server:app --reload
```

Required environment variables are `MONGO_URL` and `DB_NAME`. Optional provider
settings (`GEMINI_API_KEY`, Telegram, Twilio, and Resend) retain their existing
queued/fallback behavior when absent. Set `CORS_ORIGINS` to a comma-separated
allowlist in production; it defaults to the existing permissive behavior.
