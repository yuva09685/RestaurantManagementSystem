import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) return true; // No role required, allow access

    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('Access Denied. No token provided.');

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload; // Attach user details to request

      if (!requiredRoles.includes(payload.role)) {
        throw new ForbiddenException('Access Denied. Insufficient role.');
      }

      return true;
    } catch (error) {
      throw new ForbiddenException('Access Denied. Invalid or expired token.');
    }
  }
}
