# LinguaMentor

<p align="center">
  <img src="./frontend/public/robo_mentor.png" alt="LinguaMentor assistant" width="220" />
</p>

<p align="center">
  <img src="./frontend/public/rocket.png" alt="LinguaMentor launch visual" width="540" />
</p>

A full-stack AI language mentor you can run locally and improve as a serious engineering project.

This repository is a strong portfolio project because it combines:
- production-style authentication with OTP and JWT
- multi-conversation chat experience
- FastAPI backend + Next.js frontend
- MongoDB persistence
- LLM integration through Ollama/LangChain

---

## Quick Demo View

![Product walkthrough gif](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODd2dW1zb2liNmNhN2N5N2R4b2oxNjM0dDF2enVvM3g4cnd2aG85NiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/coxQHKASG60HrHtvkt/giphy.gif)

The app lets a user sign up, verify by OTP, log in, create chats, and continue learning conversations in a clean interface.

---

## Why This Project Stands Out

Most tutorial apps stop at a single endpoint and static UI. This codebase goes further:

- Handles auth lifecycle: signup, OTP verification, login, profile, password reset.
- Stores chat conversations and message history per authenticated user.
- Protects chat routes with bearer token validation.
- Splits concerns into routes, services, models, dependencies, and utilities.
- Ships with a modern frontend ready for iterative product improvements.

This is exactly the kind of practical software engineering scope recruiters look for in early-career backend/full-stack candidates.

---

## System Architecture

```mermaid
flowchart LR
    U[User Browser] --> F[Next.js Frontend]
    F -->|HTTP JSON + Bearer Token| B[FastAPI Backend]
    B -->|User/Auth/Chat Data| M[(MongoDB)]
    B -->|Prompt + Context| L[LangChain + Ollama]
    L --> B
    B --> F
```

### Runtime Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DB as MongoDB
    participant LLM as Ollama/LLM

    User->>Frontend: Sign up / Login
    Frontend->>Backend: /auth/*
    Backend->>DB: user + otp + token work
    DB-->>Backend: auth result
    Backend-->>Frontend: token / status

    User->>Frontend: Send chat message
    Frontend->>Backend: /chat/{id}/send (Bearer token)
    Backend->>DB: load recent context
    Backend->>LLM: prompt + history
    LLM-->>Backend: model response
    Backend->>DB: store user + assistant messages
    Backend-->>Frontend: response payload
```

---

## Tech Stack

### Backend
- Python 3.12+
- FastAPI
- MongoDB (PyMongo)
- JWT auth
- bcrypt password hashing
- LangChain ecosystem + Ollama

### Frontend
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Axios
- Radix UI primitives

---

## Repository Structure

```text
LinguaMentor/
├── app/
│   ├── core/                # config and database setup
│   ├── dependencies/        # auth dependency injection
│   ├── models/              # LLM prompt/core model logic
│   ├── routes/              # /auth and /chat API routes
│   ├── services/            # chat/auth business logic
│   └── utils/               # jwt, security, title generation
├── frontend/
│   ├── src/app/             # Next.js routes (auth + chat)
│   ├── src/components/      # UI and chat components
│   └── public/              # local assets used in README/UI
├── main.py                  # FastAPI entrypoint
├── requirments.txt          # backend dependencies
└── README.md
```

---

## API Surface

### Authentication Routes
- `POST /auth/signup`
- `POST /auth/verify-otp`
- `POST /auth/login`
- `POST /auth/forget-password`
- `POST /auth/change-password`
- `GET /auth/me`

### Chat Routes
- `POST /chat/new`
- `POST /chat/{conversation_id}/send`
- `GET /chat/list`
- `GET /chat/{conversation_id}`
- `DELETE /chat/{conversation_id}`

---

## Local Setup

## 1) Clone

```bash
git clone <your-fork-or-repo-url>
cd LinguaMentor
```

## 2) Backend Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirments.txt
```

Create a `.env` file in project root:

```env
JWT_SECRET_KEY=replace_with_a_strong_secret
```

Start backend:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 3) MongoDB

Make sure MongoDB is running at:

```text
mongodb://127.0.0.1:27017/
```

Database and indexes are initialized from `app/core/database.py` on startup.

## 4) Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL:

```text
http://localhost:3000
```

Backend default URL consumed by frontend:

```text
http://localhost:8000
```

---

## Screens and UX Coverage

- Landing page
- Signup
- OTP verification
- Login
- Forgot password
- Chat list sidebar
- Conversation page with persisted chat history

The frontend includes reusable components and a clear route layout to support fast iteration.

---

## What To Improve Next

If your goal is to reach Google-level engineering interviews, these are high-value improvements:

1. Add backend unit/integration tests with pytest.
2. Add input validation and stricter error model consistency.
3. Move secrets/config to typed settings classes.
4. Add rate limiting on OTP and auth endpoints.
5. Add CI checks for lint, tests, and type safety.
6. Add Docker Compose for one-command local startup.
7. Add structured logging and request tracing.

These improvements demonstrate practical reliability and software design judgment.

---

## Interview Talking Points

Use this project to discuss:

- How token-based auth is implemented and verified.
- How chat history is persisted and fetched efficiently.
- How prompt/context assembly works before LLM calls.
- Trade-offs between model quality, latency, and context window.
- How you would evolve this into a multi-tenant production service.

This creates a credible story in interviews: you built a real system, not just a static UI.

---

## License

Add a license file if you plan to share publicly (MIT is a common choice for portfolio repositories).
