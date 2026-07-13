import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from '../services/services.module';
import { BookingEntity } from './booking.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity]), ServicesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
