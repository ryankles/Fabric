# Architecture Docs

## Stack

- Frontend: React 19, React Router, Vite
- Backend: Express 5, Node.js
- Database: MongoDB with Mongoose

## Frontend Framework and Libraries

- `react` for component rendering
- `react-router-dom` for routing
- Vite for local development and production builds
- Tailwind-style utility classes in the existing CSS approach for UI styling

## Backend Architecture

- Express exposes JSON APIs under `/api/*`
- Cookie-based authentication uses JWTs
- Mongoose models define the application data layer
- Route files organize API behavior by domain, such as auth, materials, announcements, assignments, and grades

## Code Structure

### Workspace Layout

- `packages/react-frontend`
  Frontend application source, pages, assets, and Vite configuration.
- `packages/express-backend`
  Backend server, route handlers, middleware, models, and utility code.

### Frontend Structure

- `src/MyApp.jsx`
  Top-level app shell and auth-driven entry point.
- `src/pages/`
  Screen-level views for dashboard, announcements, materials, calendar, and grades.
- `src/hooks/`
  Shared frontend logic such as course loading helpers.

### Backend Structure

- `backend.js`
  Server bootstrap, middleware registration, and route mounting.
- `routes/`
  Domain routes for auth, courses, materials, announcements, assignments, submissions, grades, enrollments, and dashboard.
- `models/`
  Mongoose schemas for the classroom data model.
- `middleware/`
  Request-level shared logic such as `requireAuth`.
- `utils/`
  Shared backend helper logic, such as course access checks.

## Request Flow

1. The React frontend sends authenticated requests with cookies.
1. Express validates auth through middleware.
1. Route handlers query or write MongoDB through Mongoose models.
1. Responses return JSON to the frontend for rendering.

## Third-Party APIs

There are no external third-party product APIs in the current MVP. The application currently depends on its own Express API and MongoDB only.
