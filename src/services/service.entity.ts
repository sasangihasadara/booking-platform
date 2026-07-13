import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingEntity } from '../bookings/booking.entity';

@Entity({ name: 'services' })
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'integer' })
  duration: number;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => BookingEntity, (booking) => booking.service)
  bookings: BookingEntity[];

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
