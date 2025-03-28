import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../db/index';
import { users } from '../db/schema';

@Injectable()
export class UsersService {
  getAllUsers() {
    throw new Error('Method not implemented.');
  }

  async createUser(data: { name: string; email: string; password: string; role_id: string }) {
    try {
      await db.insert(users).values({
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: data.role_id, 
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating user: ' + error.message);
    }
  }

  async findUserByEmail(email: string): Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
    role_id: string;
  } | null> {
    try {
      const usersData = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then(res => res[0]);

      return usersData || null;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user: ' + error.message);
    }
  }
}
