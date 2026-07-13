import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const user = this.usersRepository.create({
      email: dto.email.toLowerCase(),
      password: await bcrypt.hash(dto.password, 10),
    });

    const savedUser = await this.usersRepository.save(user);

    return this.buildAuthResponse(savedUser);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  async refreshTokens(dto: RefreshTokenDto) {
    const payload = await this.verifyRefreshToken(dto.refreshToken);
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshTokenMatches = await bcrypt.compare(
      dto.refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.buildAuthResponse(user);
  }

  async logout(dto: RefreshTokenDto) {
    const payload = await this.verifyRefreshToken(dto.refreshToken);
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshTokenMatches = await bcrypt.compare(
      dto.refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    user.refreshToken = null;
    await this.usersRepository.save(user);

    return { message: 'Logged out successfully' };
  }

  private async buildAuthResponse(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret', 'change-me'),
      expiresIn: this.configService.get<string>('jwt.expiresIn', '1d'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'jwt.refreshSecret',
        'refresh-change-me',
      ),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn', '7d'),
    });

    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.save(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>(
          'jwt.refreshSecret',
          'refresh-change-me',
        ),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
