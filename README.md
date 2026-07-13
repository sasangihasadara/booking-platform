# Booking Platform API

A NestJS REST API for managing services and customer bookings with JWT authentication, validation, Swagger documentation, and SQLite persistence.

## Features

- JWT-based authentication for register/login
- Authenticated CRUD for services
- Public booking creation for customers
- Booking status updates, cancellation, pagination, and search
- Global validation and exception handling
- Swagger UI documentation
- SQLite database with migration support

## Tech Stack

- NestJS
- TypeScript
- TypeORM
- SQLite
- Swagger

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```
3. Run the database migration:
   ```bash
   npm run migration:run
   ```
4. Start the development server:
   ```bash
   npm run start:dev
   ```

## Environment Variables

- `PORT` - server port, default `3000`
- `DATABASE_PATH` - SQLite database path, default `booking.sqlite`
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - access token expiration, default `1d`
- `SWAGGER_PATH` - Swagger route path, default `docs`

## Database Setup

The project uses SQLite by default. The database file is created automatically at `booking.sqlite` unless `DATABASE_PATH` is changed.

## Running Migrations

```bash
npm run migration:run
```

To revert the last migration:

```bash
npm run migration:revert
```

## API Documentation

Swagger UI is available at:

```text
http://localhost:3000/docs
```

A basic Postman collection is included in [postman_collection.json](postman_collection.json).

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Services (requires JWT)

- `POST /api/services`
- `GET /api/services`
- `GET /api/services/:id`
- `PATCH /api/services/:id`
- `DELETE /api/services/:id`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings` (requires JWT)
- `GET /api/bookings/:id` (requires JWT)
- `PATCH /api/bookings/:id/status` (requires JWT)
- `PATCH /api/bookings/:id/cancel` (requires JWT)

## Assumptions

- Services are managed by authenticated users only.
- Customers can create bookings without authentication.
- Booking dates and times must be in the future.
- Duplicate bookings for the same service, date, and time are rejected.
- Cancelled bookings cannot be moved to `COMPLETED`.

## Future Improvements

- Refresh tokens
- Role-based access control
- Unit and integration tests
- Docker support
- Soft delete and audit logs
