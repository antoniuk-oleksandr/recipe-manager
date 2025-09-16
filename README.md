# Recipe Manager (🚧 In Development)

<div align="center">

[![Backend CI/CD](https://github.com/antoniuk-oleksandr/recipe-manager/actions/workflows/backend.yaml/badge.svg)](https://github.com/antoniuk-oleksandr/recipe-manager/actions/workflows/backend.yaml) 
[![codecov](https://codecov.io/gh/antoniuk-oleksandr/recipe-manager/graph/badge.svg?token=RARSAUWQPE)](https://codecov.io/gh/antoniuk-oleksandr/recipe-manager)
[![API Docs](https://img.shields.io/badge/docs-Swagger-blue)](https://antoniuk-oleksandr.github.io/recipe-manager/)

</div>


Recipe Manager aims to be a full-stack web application for creating, browsing, and managing recipes. Users can sign up, create profiles, add recipes, mark favorites, and search through a collection of recipes.

> **Note:** Recipe Manager is currently under active development. Many features are planned and in progress.
> The app is not yet production-ready—follow along or contribute as features are built!

🔗 Live Staging: [https://recipe-manager-backend-etny.onrender.com](https://recipe-manager-backend-etny.onrender.com)

## Current Status

- 🛠️ **Development in progress**
- Core structure scaffolded (backend, frontend, infra)
- Initial tech stack selected
- Feature implementation is ongoing (see Roadmap below)

## Planned Features

- User Authentication: Secure login with email/password (JWT)
- Profile Pages: View and edit profile information
- Recipe Management: Create, edit, delete, and view recipes (public/private)
- Favorites System: Favorite recipes and view favorite list
- Search & Filters: Search recipes by title, ingredients, tags, and apply filters
- Responsive Design: Fully responsive UI with React & TailwindCSS
- CI/CD: Automated deployment and testing
- Test coverage reporting with CodeCov
- Redis Caching: Improved search performance
- Logging: Centralized and structured application logging
- Swagger Documentation: Interactive API documentation with Swagger
- AWS Deployment: Planned cloud deployment for production

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- TailwindCSS

### Backend

- NestJS
- PostgreSQL
- Drizzle ORM
- JWT Authentication

### Others

- Redis (caching)
- Docker & Docker Compose
- REST API

## Project Structure

```
recipe-manager/
├── backend/            # NestJS server for API logic and database interaction
├── frontend/           # React frontend for client interaction
├── infra/              # Project infrastructure (e.g., Docker Compose)
```

## API Documentation

Interactive API docs are available here:  
🌐 [Recipe Manager API Docs](https://antoniuk-oleksandr.github.io/recipe-manager/)

## Getting Started

### Prerequisites

- Docker (recommended; runs all services in containers)
- PostgreSQL (if running outside Docker)
- Node.js (if running outside Docker)

### Run Locally (Docker)

Clone the repository:

```bash
git clone https://github.com/yourusername/recipe-manager.git
cd recipe-manager
```

Build and run the app:

```bash
make compose-up
```

This command launches:

- Backend server
- PostgreSQL database
- Frontend UI _(coming soon)_
- Redis server _(coming soon)_

### Environment Variables

#### Backend `.env`

```env
# Database configuration
DATABASE_URL=your_postgresql_database_url

# JWT configuration
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=your_jwt_access_expires_in
JWT_REFRESH_EXPIRES_IN=your_jwt_refresh_expires_in

# Misc configuration
PORT=your_port
PASSWORD_SALT_ROUNDS=your_password_salt_rounds
```

#### Docker Compose `.env`

```env
# Main database configuration
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_postgres_db_name
POSTGRES_HOST=your_postgres_host
POSTGRES_PORT=your_postgres_port

# Test database configuration
POSTGRES_TEST_USER=your_postgres_test_db_user
POSTGRES_TEST_PASSWORD=your_postgres_test_db_password
POSTGRES_TEST_DB=your_postgres_test_db_name
POSTGRES_TEST_PORT=your_postgres_test_db_port
```

#### Frontend `.env`

```env
Coming soon
```

## Backend Roadmap

- [x] Dockerfile setup
- [x] Docker Compose setup
- [x] CI/CD pipeline with GitHub Actions
- [x] Test coverage reporting with CodeCov
- [x] Database migrations / Drizzle setup
- [x] Health & system checks
- [x] Render deployment for staging
- [ ] Email/password authentication (JWT) **25% done**
- [ ] Logging
- [ ] Metrics
- [ ] Swagger documentation
- [ ] Users management
- [ ] Recipes management
- [ ] Favorites system
- [ ] Search & filters
- [ ] Redis caching
- [ ] AWS deployment for production

## Frontend Roadmap

- [ ] CI/CD
- [ ] Test coverage reporting with CodeCov
- [ ] Render deployment for staging
- [ ] Sign-in / Sign-up pages
- [ ] Recipe pages (view, create, edit, delete)
- [ ] My Recipes page
- [ ] Favorites page
- [ ] Search & filters
- [ ] Layout & navigation (responsive)
- [ ] Recipe detail page
- [ ] Settings / profile page
- [ ] AWS deployment for production

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request with your changes. For major updates, open an issue first to discuss what you’d like to change.

## Author

Created by Oleksandr Antoniuk

Feel free to reach out for questions, ideas, or collaborations.
