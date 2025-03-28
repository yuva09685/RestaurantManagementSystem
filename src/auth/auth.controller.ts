import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: CreateUserDto) {
    return this.authService.signup(data);
  }

  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    const token = await this.authService.login(data.email, data.password);
    if (!token) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return token;
  }
}
