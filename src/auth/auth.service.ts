import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { db } from '../db/index';
import { roles } from '../db/schema';
import { eq } from 'drizzle-orm';
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

  async signup(data: { name: string; age: number; email: string; password: string; role_id: string}): Promise<{ message: string }> {
    try {
      const existingUser = await this.usersService.findUserByEmail(data.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Fetch role ID based on role name
      const roleData = await db.select().from(roles).where(eq(roles.name, data.role_id)).then(res => res[0]);

      if (!roleData) {
        throw new ConflictException('Invalid role provided');
      }

      const hashedPassword = await this.hashPassword(data.password);

      await this.usersService.createUser({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role_id: roleData.id, // Assign role ID
      });

      return { message: 'User created successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error signing up: ' + error.message);
    }
  }

  async login(email: string, password: string): Promise<{ token: string; role: string }> {
    try {
      const user = await this.usersService.findUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Fetch role name from `roles` table
      const roleData = await db.select().from(roles).where(eq(roles.id, user.role_id)).then(res => res[0]);

      if (!roleData) {
        throw new InternalServerErrorException('Role not found');
      }

      const token = this.jwtService.sign({ id: user.id, role: roleData.name });

      return { token, role: roleData.name };
    } catch (error) {
      throw new InternalServerErrorException('Error logging in: ' + error.message);
    }
  }
}
