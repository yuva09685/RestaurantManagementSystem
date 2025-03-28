import * as Joi from 'joi';

// Joi Validation Schema
export const CreateUserSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  age: Joi.number().min(18).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role_id: Joi.string().uuid().required(),
});

// DTO Class
export class CreateUserDto {
  name: string;
  age: number;
  email: string;
  password: string;
  role_id: string; // UUID of the role instead of role name
}
