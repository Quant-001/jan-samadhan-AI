# Jan Samadhan AI

AI-powered citizen grievance management platform with a React frontend and a
Django REST backend.

## Project structure

```text
jan-samadhan-AI/
├── frontend/                 # React + Vite citizen, officer, and admin UI
│   ├── src/
│   │   ├── api/              # Backend API client
│   │   ├── components/       # Shared UI components
│   │   ├── hooks/            # Authentication, language, and theme hooks
│   │   ├── pages/            # Role-based application pages
│   │   └── utils/            # Frontend helpers
│   ├── package.json
│   └── vercel.json           # Vercel deployment configuration
├── backend/                  # Django API and application services
│   ├── config/               # Django settings, URLs, WSGI, and Celery
│   ├── grievance_app/        # Domain models, API, tasks, and permissions
│   ├── ai_models/            # Local classifier and optional transformer files
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml        # Local PostgreSQL, Redis, API, and workers
├── render.yaml               # Render production deployment configuration
├── .gitignore                # Git exclusions for secrets and generated files
└── .git/                     # Git repository metadata (not application code)
```

`backend/ai_models/` is intentionally kept inside the backend because the
classifier loads model files relative to Django's `BASE_DIR`. The model path
is shared by local Docker and Render deployments.

## Local development with Docker

```bash
docker compose up --build
```

The services are available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Django API schema: http://localhost:8000/api/schema/

## Local development without Docker

Start PostgreSQL and Redis, then configure `backend/.env` from
`backend/.env.example`.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Deployment

- Frontend deployment: Vercel, configured by `frontend/vercel.json`.
- Backend deployment: Render, configured by the root `render.yaml`.
- Do not commit `backend/.env`, uploaded media, model caches, or build output.
