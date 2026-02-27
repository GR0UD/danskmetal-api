# Dansk Metal API

A minimal REST API for managing users and menu sessions. Lightweight, middleware-driven Express-style app built with Bun/Node and TypeScript.

## Features

- User creation and authentication
- Menu session management
- Middleware for authentication, error handling and rate limiting

## Tech

- TypeScript
- Bun (recommended) or Node.js
- Minimal file-based structure under `src/`

## Quick Start

Prerequisites: Bun (recommended) or a recent Node.js. Clone the repo and install dependencies:

```sh
bun install
```

Start the development server:

```sh
bun run dev
# or with npm / pnpm (if configured)
```

Open http://localhost:3000

## Configuration

Create a `.env` file or export environment variables used by the app. Common variables:

- `PORT` — port to bind (default: `3000`)
- `DATABASE_URL` — connection string for the database
- `JWT_SECRET` — secret used by `src/middleware/auth.ts` for signing/verifying tokens
- `RATE_LIMIT_WINDOW` / `RATE_LIMIT_MAX` — optional rate-limit settings

Check `src/db.ts` and `src/middleware/auth.ts` for exact expectations.

## Project Structure

- [src/index.ts](src/index.ts) — application entry
- [src/db.ts](src/db.ts) — database connection
- [src/createUser.ts](src/createUser.ts) — helper to create users
- [src/routes/user.ts](src/routes/user.ts) — user-related routes
- [src/routes/session.ts](src/routes/session.ts) — session-related routes
- [src/models/User.ts](src/models/User.ts) — `User` model
- [src/models/MenuSession.ts](src/models/MenuSession.ts) — `MenuSession` model
- [src/middleware/auth.ts](src/middleware/auth.ts) — auth middleware
- [src/middleware/errorHandler.ts](src/middleware/errorHandler.ts) — global error handler
- [src/middleware/rateLimit.ts](src/middleware/rateLimit.ts) — rate limiting

## API (examples)

Below are the most common endpoints; see route files for full details and payload shapes.

- `POST /users` — create a new user

  Example:

  ```sh
  curl -X POST http://localhost:3000/users \
  	-H "Content-Type: application/json" \
  	-d '{"email":"alice@example.com","password":"s3cret"}'
  ```

- `POST /sessions` — create a session / login

  Example:

  ```sh
  curl -X POST http://localhost:3000/sessions \
  	-H "Content-Type: application/json" \
  	-d '{"email":"alice@example.com","password":"s3cret"}'
  ```

Other routes and protected endpoints are implemented in `src/routes/session.ts` and `src/routes/user.ts`. Authentication is enforced by `src/middleware/auth.ts`.

## Development notes

- The app exposes middleware for error handling and rate limiting; review `src/middleware` to adjust behavior.
- Models live in `src/models` and are small single-responsibility modules.

## Contributing

Open an issue or submit a PR. Keep changes small and focused.

## License

This repository does not include an explicit license. Add a `LICENSE` file if you intend to publish.
