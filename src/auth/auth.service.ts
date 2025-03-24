import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async signup(data: { name: string; age: number; email: string; password: string; role?: 'manager' | 'waiter' }): Promise<{ message: string }> {
    try {
      const existingUser = await this.usersService.findUserByEmail(data.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await this.hashPassword(data.password);

      await this.usersService.createUser({
        ...data,
        password: hashedPassword,
      });

      return  { message: 'User created successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error signing up: ' + error.message);
    }
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    try {
      const user = await this.usersService.findUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.jwtService.sign({ id: user.id, role: user.role });

      return { token };
    } catch (error) {
      throw new InternalServerErrorException('Error logging in: ' + error.message);
    }
  }
}
