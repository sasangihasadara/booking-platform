import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingStatus } from './booking-status.enum';
import { BookingEntity } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsQueryDto } from './dto/bookings-query.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { ServicesService } from '../services/services.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingsRepository: Repository<BookingEntity>,
    private readonly servicesService: ServicesService,
  ) {}

  async create(dto: CreateBookingDto) {
    await this.validateBookingDateTime(dto.bookingDate, dto.bookingTime);
    const service = await this.servicesService.ensureServiceExists(dto.serviceId);

    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        serviceId: dto.serviceId,
        bookingDate: dto.bookingDate,
        bookingTime: dto.bookingTime,
      },
    });

    if (existingBooking) {
      throw new ConflictException('A booking already exists for this service at the selected date and time');
    }

    const booking = this.bookingsRepository.create({
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone,
      serviceId: service.id,
      bookingDate: dto.bookingDate,
      bookingTime: dto.bookingTime,
      status: BookingStatus.PENDING,
      notes: dto.notes ?? null,
    });

    try {
      return await this.bookingsRepository.save(booking);
    } catch (error) {
      if (error instanceof Error && error.message.includes('SQLITE_CONSTRAINT')) {
        throw new ConflictException('A booking already exists for this service at the selected date and time');
      }
      throw error;
    }
  }

  async findAll(query: BookingsQueryDto) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 10), 1), 100);
    const skip = (page - 1) * limit;

    const queryBuilder = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service')
      .orderBy('booking.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (query.status) {
      queryBuilder.andWhere('booking.status = :status', { status: query.status });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(booking.customerName LIKE :search OR booking.customerEmail LIKE :search OR booking.customerPhone LIKE :search OR service.title LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async findOne(id: number) {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async updateStatus(id: number, dto: UpdateBookingStatusDto) {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED && dto.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cancelled bookings cannot be marked as completed');
    }

    if (booking.status === BookingStatus.COMPLETED && dto.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Completed bookings cannot be cancelled');
    }

    booking.status = dto.status;
    return this.bookingsRepository.save(booking);
  }

  async cancel(id: number) {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Completed bookings cannot be cancelled');
    }

    booking.status = BookingStatus.CANCELLED;
    return this.bookingsRepository.save(booking);
  }

  private async validateBookingDateTime(bookingDate: string, bookingTime: string) {
    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}:00`);

    if (Number.isNaN(bookingDateTime.getTime())) {
      throw new BadRequestException('Invalid booking date/time');
    }

    if (bookingDateTime.getTime() < Date.now()) {
      throw new BadRequestException('Booking date and time cannot be in the past');
    }
  }
}
