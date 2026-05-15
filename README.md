docker compose up --build# TaskFlow

Plateforme de gestion de tâches collaboratives — Kanban, temps réel, authentification JWT.

## Stack

| Couche    | Technologies                                      |
|-----------|---------------------------------------------------|
| Backend   | Java 17, Spring Boot 3, Spring Security, JPA, PostgreSQL, Flyway |
| Gateway   | Node.js, Express, Socket.io, JWT, Redis           |
| Frontend  | Next.js 14, React, Redux Toolkit, TypeScript, Tailwind CSS |
| Infra     | Docker, Docker Compose                            |

## Démarrage rapide

### Prérequis
- [Docker](https://www.docker.com/) et Docker Compose installés

### Lancer le projet

```bash
# 1. Cloner le projet
git clone <repo-url>
cd taskflow

# 2. Lancer tous les services
docker compose up --build
```

L'application sera disponible sur :

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000      |
| Gateway  | http://localhost:3001      |
| Backend  | http://localhost:8080      |

### Développement local (sans Docker)

**Backend**
```bash
cd backend
# Démarrer PostgreSQL + Redis via Docker uniquement
docker compose up postgres redis -d
mvn spring-boot:run
```

**Gateway**
```bash
cd gateway
npm install
cp .env.example .env
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Variables d'environnement

### Gateway — `.env`
```
PORT=3001
BACKEND_URL=http://localhost:8080
JWT_SECRET=mySecretKey123456789012345678901234567890123456789012
REDIS_URL=redis://localhost:6379
```

### Frontend — `.env.local`
```
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3001
```

## Architecture

```
Browser
  └── Frontend Next.js :3000
        └── Gateway Node.js :3001  (auth JWT, rate limit, WebSocket)
              └── Backend Spring Boot :8080  (logique métier, JPA)
                    └── PostgreSQL :5432
                    └── Redis :6379
```

## Endpoints API principaux

| Méthode | URL                                  | Description            |
|---------|--------------------------------------|------------------------|
| POST    | /api/auth/register                   | Créer un compte        |
| POST    | /api/auth/login                      | Se connecter (→ JWT)   |
| GET     | /api/projects                        | Mes projets            |
| POST    | /api/projects                        | Créer un projet        |
| GET     | /api/projects/:id/tasks              | Tâches d'un projet     |
| POST    | /api/projects/:id/tasks              | Créer une tâche        |
| PATCH   | /api/tasks/:id/status                | Changer le statut      |
| DELETE  | /api/tasks/:id                       | Supprimer une tâche    |
