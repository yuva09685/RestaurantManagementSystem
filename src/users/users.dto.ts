import * as Joi from 'joi';

// Define User Role Type
export type UserRole = 'manager' | 'waiter';

// Joi Validation Schema
export const CreateUserSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  age: Joi.number().min(18).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('manager', 'waiter').default('waiter'), // Role-based access
});

// DTO Class
export class CreateUserDto {
  name: string;
  age: number;
  email: string;
  password: string;
  role?: UserRole; // Role is strictly 'manager' or 'waiter'
}
