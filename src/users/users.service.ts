import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../db/index';
import { usersTable } from '../db/schema';

@Injectable()
export class UsersService {
  getAllUsers() {
    throw new Error('Method not implemented.');
  }
  async createUser(data: { name: string; age: number; email: string; password: string; role?: 'manager' | 'waiter' }) {
    try {
      await db.insert(usersTable).values({
        name: data.name,
        age: data.age,
        email: data.email,
        password: data.password,
        role: data.role ?? 'waiter', // Default role is 'waiter'
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating user: ' + error.message);
    }
  }

  async findUserByEmail(email: string): Promise<{ id: number; name: string; age: number; email: string; password: string; role: 'manager' | 'waiter' } | null> {
    try {
      const users = await db.select().from(usersTable).where(eq(usersTable.email, email));
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user: ' + error.message);
    }
  }
}
