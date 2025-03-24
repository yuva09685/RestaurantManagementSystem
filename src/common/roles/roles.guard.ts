import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>('role', context.getHandler());
    if (!requiredRole) return true; // If no role is required, allow access

    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new ForbiddenException('Access Denied. No token provided.');

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    try {
      const payload = this.jwtService.verify(token);
      if (payload.role !== requiredRole) throw new ForbiddenException('Access Denied. Insufficient role.');
      return true;
    } catch (error) {
      throw new ForbiddenException('Access Denied. Invalid token.');
    }
  }
}
