import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'User registered successfully' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOkResponse({ description: 'User login successful' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOkResponse({ description: 'Tokens refreshed successfully' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto);
  }

  @Post('logout')
  @ApiOkResponse({ description: 'Logged out successfully' })
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto);
  }
}
