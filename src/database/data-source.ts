import 'dotenv/config';
import 'reflect-metadata';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { BookingEntity } from '../bookings/booking.entity';
import { ServiceEntity } from '../services/service.entity';
import { User } from '../users/user.entity';

export default new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH ?? 'booking.sqlite',
  entities: [User, ServiceEntity, BookingEntity],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
});
