import { SetMetadata } from '@nestjs/common';

export const Roles = (role: 'manager' | 'waiter') => SetMetadata('role', role);
