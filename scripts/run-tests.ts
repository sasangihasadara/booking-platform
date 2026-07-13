import 'reflect-metadata';
import assert from 'node:assert/strict';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/auth/auth.service';
import { BookingStatus } from '../src/bookings/booking-status.enum';
import { BookingsService } from '../src/bookings/bookings.service';
import { ServicesService } from '../src/services/services.service';
import { User } from '../src/users/user.entity';

type TestFn = () => Promise<void> | void;

const tests: Array<{ name: string; fn: TestFn }> = [];

function test(name: string, fn: TestFn) {
  tests.push({ name, fn });
}

function createConfigService(overrides: Record<string, string>) {
  return {
    get(key: string, fallback?: string) {
      return overrides[key] ?? fallback;
    },
  } as never;
}

function createAuthService(store: User[]) {
  const accessSecret = 'access-secret';
  const refreshSecret = 'refresh-secret';

  const usersRepository = {
    async findOne(options: { where: { id?: number; email?: string } }) {
      if (options.where.id !== undefined) {
        return store.find((user) => user.id === options.where.id) ?? null;
      }
      if (options.where.email !== undefined) {
        return store.find((user) => user.email === options.where.email) ?? null;
      }
      return null;
    },
    create(payload: Partial<User>) {
      return { ...payload } as User;
    },
    async save(user: User) {
      const existingIndex = store.findIndex((entry) => entry.id === user.id);
      if (existingIndex >= 0) {
        store[existingIndex] = { ...store[existingIndex], ...user };
        return store[existingIndex];
      }

      const saved = {
        ...user,
        id: store.length + 1,
        refreshToken: user.refreshToken ?? null,
      } as User;
      store.push(saved);
      return saved;
    },
  } as never;

  const jwtService = {
    sign(payload: { sub: number; email: string }, options: { secret: string }) {
      return options.secret === accessSecret
        ? `access-${payload.sub}`
        : `refresh-${payload.sub}`;
    },
    async verifyAsync(token: string, options: { secret: string }) {
      if (options.secret !== refreshSecret || !token.startsWith('refresh-')) {
        throw new Error('invalid token');
      }

      const id = Number(token.split('-')[1]);
      return { sub: id, email: store.find((user) => user.id === id)?.email ?? 'user@example.com' };
    },
  } as unknown as JwtService;

  const configService = createConfigService({
    'jwt.secret': accessSecret,
    'jwt.expiresIn': '1d',
    'jwt.refreshSecret': refreshSecret,
    'jwt.refreshExpiresIn': '7d',
  });

  return new AuthService(usersRepository, jwtService, configService);
}

function createServicesService() {
  const store = [
    { id: 1, title: 'Haircut', description: 'Basic', duration: 30, price: 10, isActive: true },
  ];
  const bookings = [{ id: 99, serviceId: 1, bookingDate: '2099-12-31', bookingTime: '10:00' }];

  const servicesRepository = {
    async findOne(options: { where: { id: number } }) {
      return store.find((service) => service.id === options.where.id) ?? null;
    },
    create(payload: unknown) {
      return payload;
    },
    async save(entity: any) {
      const index = store.findIndex((service) => service.id === entity.id);
      if (index >= 0) {
        store[index] = entity;
      } else {
        entity.id = store.length + 1;
        store.push(entity);
      }
      return entity;
    },
    async remove(entity: any) {
      const index = store.findIndex((service) => service.id === entity.id);
      if (index >= 0) {
        store.splice(index, 1);
      }
    },
    manager: {
      async count(_entity: unknown, options: { where: { serviceId: number } }) {
        return bookings.filter((booking) => booking.serviceId === options.where.serviceId).length;
      },
    },
  } as never;

  return new ServicesService(servicesRepository);
}

function createBookingsService() {
  const bookings: Array<any> = [];
  const bookingRepository = {
    async findOne(options: { where: { id?: number; serviceId?: number; bookingDate?: string; bookingTime?: string } }) {
      if (options.where.id !== undefined) {
        return bookings.find((booking) => booking.id === options.where.id) ?? null;
      }
      return (
        bookings.find(
          (booking) =>
            booking.serviceId === options.where.serviceId &&
            booking.bookingDate === options.where.bookingDate &&
            booking.bookingTime === options.where.bookingTime,
        ) ?? null
      );
    },
    create(payload: any) {
      return { ...payload };
    },
    async save(entity: any) {
      if (!entity.id) {
        entity.id = bookings.length + 1;
        bookings.push(entity);
      }
      return entity;
    },
    createQueryBuilder() {
      return {
        leftJoinAndSelect() {
          return this;
        },
        orderBy() {
          return this;
        },
        skip() {
          return this;
        },
        take() {
          return this;
        },
        andWhere() {
          return this;
        },
        async getManyAndCount() {
          return [bookings, bookings.length] as const;
        },
      };
    },
  } as never;

  const servicesService = {
    async ensureServiceExists(id: number) {
      return { id, title: 'Haircut', description: 'Basic', duration: 30, price: 10, isActive: true };
    },
  } as never;

  return new BookingsService(bookingRepository, servicesService);
}

test('auth register, login, refresh, and logout work', async () => {
  const store: User[] = [];
  const authService = createAuthService(store);

  const registered = await authService.register({
    email: 'User@example.com',
    password: 'StrongPass123',
  });
  assert.equal(registered.user.email, 'user@example.com');
  assert.ok(registered.accessToken.startsWith('access-'));
  assert.ok(registered.refreshToken.startsWith('refresh-'));
  assert.equal(store[0].email, 'user@example.com');
  assert.ok(store[0].refreshToken);

  const login = await authService.login({
    email: 'user@example.com',
    password: 'StrongPass123',
  });
  assert.ok(login.accessToken.startsWith('access-'));

  const refreshed = await authService.refreshTokens({
    refreshToken: registered.refreshToken,
  });
  assert.ok(refreshed.accessToken.startsWith('access-'));
  assert.ok(refreshed.refreshToken.startsWith('refresh-'));

  const logout = await authService.logout({
    refreshToken: refreshed.refreshToken,
  });
  assert.equal(logout.message, 'Logged out successfully');
  assert.equal(store[0].refreshToken, null);
});

test('services service blocks deletion while bookings exist', async () => {
  const servicesService = createServicesService();
  await assert.rejects(() => servicesService.remove(1), BadRequestException);
});

test('services service throws for missing service', async () => {
  const servicesService = createServicesService();
  await assert.rejects(() => servicesService.findOne(999), /Service not found/);
});

test('booking service rejects past dates and duplicate bookings', async () => {
  const bookingsService = createBookingsService();

  await assert.rejects(
    () =>
      bookingsService.create({
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        customerPhone: '+94771234567',
        serviceId: 1,
        bookingDate: '2000-01-01',
        bookingTime: '10:00',
        notes: 'Test',
      }),
    /cannot be in the past/,
  );

  await bookingsService.create({
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    customerPhone: '+94771234567',
    serviceId: 1,
    bookingDate: '2099-12-31',
    bookingTime: '10:00',
    notes: 'Test',
  });

  await assert.rejects(
    () =>
      bookingsService.create({
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        customerPhone: '+94771234567',
        serviceId: 1,
        bookingDate: '2099-12-31',
        bookingTime: '10:00',
        notes: 'Test',
      }),
    ConflictException,
  );
});

test('booking service prevents invalid status transitions', async () => {
  const bookingsService = createBookingsService();
  const booking = await bookingsService.create({
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    customerPhone: '+94771234567',
    serviceId: 1,
    bookingDate: '2099-12-31',
    bookingTime: '11:00',
    notes: 'Test',
  });

  booking.status = BookingStatus.CANCELLED;
  await assert.rejects(
    () => bookingsService.updateStatus(booking.id, { status: BookingStatus.COMPLETED }),
    /Cancelled bookings cannot be marked as completed/,
  );
});

async function main() {
  let passed = 0;
  for (const entry of tests) {
    try {
      await entry.fn();
      passed += 1;
      console.log(`PASS ${entry.name}`);
    } catch (error) {
      console.error(`FAIL ${entry.name}`);
      throw error;
    }
  }

  console.log(`\n${passed}/${tests.length} tests passed`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
