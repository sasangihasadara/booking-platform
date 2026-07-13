# Booking Platform API

A NestJS REST API for managing services and customer bookings with JWT authentication, validation, Swagger documentation, and PostgreSQL persistence.

## Features

- JWT-based authentication for register/login
- Refresh token support
- Authenticated CRUD for services
- Public booking creation for customers
- Booking status updates, cancellation, pagination, and search
- Global validation and exception handling
- Swagger UI documentation
- PostgreSQL database with migration support
- Docker support

## Tech Stack

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
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
- `DATABASE_URL` - PostgreSQL connection string, default `postgresql://postgres:1234@localhost:5432/booking_db`
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - access token expiration, default `1d`
- `JWT_REFRESH_SECRET` - refresh token signing secret
- `JWT_REFRESH_EXPIRES_IN` - refresh token expiration, default `7d`
- `SWAGGER_PATH` - Swagger route path, default `docs`

## Database Setup

Create a PostgreSQL database named `booking_db`, then update `DATABASE_URL` if your username, password, host, or port are different.

Example:

```bash
createdb booking_db
```

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

### Auth Response

Auth endpoints return:

- `accessToken`
- `refreshToken`
- `user`

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

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

## Docker

Run the full stack with:

```bash
docker compose up --build
```

The app will be available at:

- `http://localhost:3000/`
- `http://localhost:3000/docs`

## Assumptions

- Services are managed by authenticated users only.
- Customers can create bookings without authentication.
- Booking dates and times must be in the future.
- Duplicate bookings for the same service, date, and time are rejected.
- Cancelled bookings cannot be moved to `COMPLETED`.

## Future Improvements

- Role-based access control
- Unit and integration tests
- Soft delete and audit logs
