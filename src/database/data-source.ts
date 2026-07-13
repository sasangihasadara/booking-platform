import 'dotenv/config';
import 'reflect-metadata';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { BookingEntity } from '../bookings/booking.entity';
import { ServiceEntity } from '../services/service.entity';
import { User } from '../users/user.entity';

export default new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL ??
    'postgresql://postgres:1234@localhost:5432/booking_db',
  entities: [User, ServiceEntity, BookingEntity],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
});
