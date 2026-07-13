import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppConfig } from './config/app.config';
import { AuthModule } from './auth/auth.module';
import { BookingEntity } from './bookings/booking.entity';
import { BookingsModule } from './bookings/bookings.module';
import { ServiceEntity } from './services/service.entity';
import { ServicesModule } from './services/services.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>(
          'database.url',
          'postgresql://postgres:1234@localhost:5432/booking_db',
        ),
        entities: [User, ServiceEntity, BookingEntity],
        migrations: [join(__dirname, 'database/migrations/*{.ts,.js}')],
        synchronize: false,
        logging: false,
      }),
    }),
    AuthModule,
    ServicesModule,
    BookingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
