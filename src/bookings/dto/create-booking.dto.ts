import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+94771234567' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  serviceId: number;

  @ApiProperty({ example: '2026-07-12' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'bookingDate must be in YYYY-MM-DD format' })
  bookingDate: string;

  @ApiProperty({ example: '14:30' })
  @Matches(/^\d{2}:\d{2}$/, { message: 'bookingTime must be in HH:mm format' })
  bookingTime: string;

  @ApiProperty({ example: 'Please call before arriving', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
