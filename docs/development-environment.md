# Development Environment Setup

## Requirements

- Node.js 20+
- npm
- MongoDB connection string

## Setup

1. Clone the repository.
1. Run `npm install` from the repo root.
1. Create backend environment variables for:
   - `MONGO_CONNECTION_STRING`
   - `JWT_SECRET`
   - `CLIENT_ORIGIN` if needed
1. Start the backend:
   - `cd packages/express-backend`
   - `npm run dev`
1. Start the frontend in a second terminal:
   - `cd packages/react-frontend`
   - `npm run dev`

## Build and Validation

- Root lint: `npm run lint`
- Frontend build: `npm run build`

## Coding Standards and Style

- Use the existing package structure instead of creating parallel folders for the same concern.
- Prefer small route files and focused page components.
- Keep changes minimal and consistent with the current codebase style.
- Format code with Prettier using the package-level `format` scripts.
- Run lint before pushing changes.

## Contribution Workflow

The project’s contribution steps are documented in [CONTRIBUTING.md](../CONTRIBUTING.md).
