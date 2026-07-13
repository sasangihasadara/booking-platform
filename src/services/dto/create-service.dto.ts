import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Haircut' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Professional haircut service', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 60 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 25.5 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
