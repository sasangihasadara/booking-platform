import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from '../bookings/booking.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceEntity } from './service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly servicesRepository: Repository<ServiceEntity>,
  ) {}

  create(dto: CreateServiceDto) {
    const service = this.servicesRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      duration: dto.duration,
      price: dto.price,
      isActive: dto.isActive ?? true,
    });

    return this.servicesRepository.save(service);
  }

  async findAll() {
    return this.servicesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const service = await this.servicesRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async update(id: number, dto: UpdateServiceDto) {
    const service = await this.findOne(id);

    if (dto.title !== undefined) {
      service.title = dto.title;
    }
    if (dto.description !== undefined) {
      service.description = dto.description;
    }
    if (dto.duration !== undefined) {
      service.duration = dto.duration;
    }
    if (dto.price !== undefined) {
      service.price = dto.price;
    }
    if (dto.isActive !== undefined) {
      service.isActive = dto.isActive;
    }

    return this.servicesRepository.save(service);
  }

  async remove(id: number) {
    const service = await this.findOne(id);

    const bookingCount = await this.servicesRepository.manager.count(BookingEntity, {
      where: { serviceId: id },
    });

    if (bookingCount > 0) {
      throw new BadRequestException('Service cannot be deleted while bookings exist');
    }

    await this.servicesRepository.remove(service);
    return { message: 'Service deleted successfully' };
  }

  async ensureServiceExists(id: number) {
    const service = await this.servicesRepository.findOne({ where: { id } });
    if (!service) {
      throw new BadRequestException('Selected service does not exist');
    }

    return service;
  }
}
