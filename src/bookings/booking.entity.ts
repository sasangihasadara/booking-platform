import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceEntity } from '../services/service.entity';
import { BookingStatus } from './booking-status.enum';

@Entity({ name: 'bookings' })
@Index(['serviceId', 'bookingDate', 'bookingTime'], { unique: true })
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  customerName: string;

  @Column({ type: 'varchar', length: 255 })
  customerEmail: string;

  @Column({ type: 'varchar', length: 50 })
  customerPhone: string;

  @Column()
  serviceId: number;

  @ManyToOne(() => ServiceEntity, (service) => service.bookings, {
    onDelete: 'RESTRICT',
    eager: true,
  })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column({ type: 'date' })
  bookingDate: string;

  @Column({ type: 'time' })
  bookingTime: string;

  @Column({ type: 'simple-enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
